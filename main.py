"""
Deck Progress Tracker - Main Plugin Entry
Decky Loader plugin for automatic game tagging
"""

# Standard library imports first
import os
import sys
import asyncio
from pathlib import Path
from typing import Optional, Dict, Any, List

# Import decky to get plugin directory path
import decky
import json

# Setup paths
PLUGIN_DIR = Path(decky.DECKY_PLUGIN_DIR)

# Decky Loader does NOT install requirements.txt for plugins - it's each
# plugin's own responsibility. Third-party deps (howlongtobeatpy, aiohttp,
# etc.) are vendored directly in the zip under py_modules/vendor, built for
# this specific Python version/platform (see release.sh / CI workflows).
VENDOR_DIR = PLUGIN_DIR / "py_modules" / "vendor"
if VENDOR_DIR.exists():
    sys.path.insert(0, str(VENDOR_DIR))

    # Decky Loader's own frozen Python 3.11 bootstrap already imports a
    # pruned stdlib `html` package (only what Decky Loader itself needs,
    # missing html.parser) before our code ever runs. That partial package
    # is already cached in sys.modules, so sys.path alone can't fix
    # submodule lookups for it - extend its __path__ directly so Python
    # finds our bundled html/parser.py (see py_modules/stdlib_shims).
    try:
        import html as _html_pkg
        vendor_html_dir = str(VENDOR_DIR / "html")
        if vendor_html_dir not in _html_pkg.__path__:
            _html_pkg.__path__.append(vendor_html_dir)
    except Exception as _html_patch_error:
        decky.logger.error(f"Failed to patch html package search path: {_html_patch_error}")

    # Decky Loader's frozen Python can't find a system CA bundle for SSL
    # verification (outbound HTTPS requests, e.g. to howlongtobeat.com, fail
    # with CERTIFICATE_VERIFY_FAILED). Neither SSL_CERT_FILE/DIR env vars nor
    # patching ssl.create_default_context fixed this: aiohttp builds its
    # default verified SSLContext ONCE, at module-import time, and caches it
    # in aiohttp.connector._SSL_CONTEXT_VERIFIED - any later patch of the
    # *function* that built it is irrelevant, since the cached *object* is
    # what every request actually reuses. Overwrite that cached object
    # directly instead, with a context built from our vendored certifi
    # bundle (confirmed as the maintainer-endorsed fix in aio-libs/aiohttp
    # issues #3180 and #7287 - env vars/monkeypatching the function are
    # explicitly called out there as unreliable for this exact reason).
    try:
        import ssl
        import certifi
        import aiohttp.connector as _aiohttp_connector
        _aiohttp_connector._SSL_CONTEXT_VERIFIED = ssl.create_default_context(cafile=certifi.where())
    except Exception as _certifi_patch_error:
        decky.logger.error(f"Failed to configure certifi CA bundle for aiohttp: {_certifi_patch_error}")

# Read version from plugin.json
def get_plugin_version():
    try:
        plugin_json_path = PLUGIN_DIR / "plugin.json"
        if plugin_json_path.exists():
            with open(plugin_json_path) as f:
                data = json.load(f)
                return data.get("version", "unknown")
    except Exception:
        pass
    return "unknown"

PLUGIN_VERSION = get_plugin_version()

logger = decky.logger
logger.info(f"=== Deck Progress Tracker v{PLUGIN_VERSION} starting ===")
logger.info(f"Plugin dir: {PLUGIN_DIR}")

# Import backend modules
try:
    from database import Database
    from steam_data import SteamDataService
    logger.info("Core backend modules imported successfully")
except ImportError as e:
    logger.error(f"Core import failed: {e}")
    import traceback
    logger.error(traceback.format_exc())
    # Create dummy classes so plugin can at least load
    class Database:
        def __init__(self, *args): pass
        async def init_database(self): pass
        async def close(self): pass
    class SteamDataService:
        def __init__(self): pass

# HLTB has its own dependency (howlongtobeatpy), which may not be installed
# yet if requirements.txt was only processed on a prior install (e.g. a dev
# install done by copying files instead of using Decky's real installer).
# Isolate its import so a missing/broken dependency only disables HLTB
# lookups instead of taking down the whole plugin (tags, sync, playtime).
try:
    from hltb_service import HLTBService
    logger.info("HLTB service imported successfully")
except ImportError as e:
    logger.error(f"HLTB service unavailable (missing dependency?): {e}")
    class HLTBService:
        def __init__(self): pass
        async def search_game(self, game_name):
            return None


class Plugin:
    """Main plugin class for Decky Loader"""

    async def _main(self):
        """Initialize plugin on load"""
        logger.info("Deck Progress Tracker plugin starting...")

        # Get plugin data directory
        self.plugin_dir = os.environ.get(
            "DECKY_PLUGIN_RUNTIME_DIR",
            str(Path.home() / ".local" / "share" / "decky" / "deck-progress-tracker")
        )
        Path(self.plugin_dir).mkdir(parents=True, exist_ok=True)

        # Initialize database
        db_path = os.path.join(self.plugin_dir, "game_tracker.db")
        self.db = Database(db_path)
        await self.db.init_database()

        # Initialize services
        self.steam_service = SteamDataService()
        self.hltb_service = HLTBService()

        # Initialize sync progress tracking
        self.sync_in_progress = False
        self.sync_current = 0
        self.sync_total = 0

        logger.info("Plugin initialized successfully")

        # Note: Auto-sync removed. Sync is now triggered by frontend after plugin loads.
        # This ensures we use real-time playtime/achievement data from Steam's frontend API.
        logger.info("Plugin ready. Sync will be triggered by frontend with real-time data.")

        # Start background task for daily dropped game check
        self.dropped_task = asyncio.create_task(self._dropped_games_checker())
        logger.info("Started background task for dropped games checking")

    async def _unload(self):
        """Cleanup on plugin unload"""
        logger.info("Unloading plugin...")

        # Cancel background task
        if hasattr(self, 'dropped_task'):
            self.dropped_task.cancel()
            try:
                await self.dropped_task
            except asyncio.CancelledError:
                pass
            logger.info("Stopped background task for dropped games checking")

        if hasattr(self, 'db'):
            await self.db.close()

    async def _dropped_games_checker(self):
        """Background task that runs daily to check and tag dropped games"""
        logger.info("Dropped games checker task started")

        # Wait 1 hour after plugin load before first check (let things settle)
        await asyncio.sleep(3600)

        while True:
            try:
                logger.info("Running daily dropped games check...")
                dropped_count = await self._check_and_tag_dropped_games()
                logger.info(f"Dropped games check complete: {dropped_count} games tagged as dropped")

                # Sleep for 24 hours until next check
                await asyncio.sleep(24 * 60 * 60)

            except asyncio.CancelledError:
                logger.info("Dropped games checker task cancelled")
                break
            except Exception as e:
                logger.error(f"Error in dropped games checker: {e}")
                import traceback
                logger.error(traceback.format_exc())
                # Wait 1 hour before retrying on error
                await asyncio.sleep(3600)

    async def _check_and_tag_dropped_games(self, days_threshold: int = 365) -> int:
        """Check database for games that should be tagged as dropped

        Finds games where:
        - rt_last_time_played exists and is older than days_threshold
        - Game is not hidden
        - Game is not manually tagged
        - Game is not completed/mastered (either no tag or in_progress)
        - Game is not already dropped

        Returns count of games newly tagged as dropped
        """
        logger.info(f"Checking for games not played in {days_threshold} days...")

        try:
            # Get eligible games from database
            eligible_games = await self.db.get_games_eligible_for_dropped(days_threshold)
            logger.info(f"Found {len(eligible_games)} games eligible for dropped tagging")

            if not eligible_games:
                return 0

            dropped_count = 0
            for game in eligible_games:
                appid = game['appid']
                game_name = game['game_name']
                rt_last_time_played = game['rt_last_time_played']

                # Calculate days since played for logging
                import time
                current_time = int(time.time())
                days_since_played = (current_time - rt_last_time_played) / (24 * 60 * 60)

                # Tag as dropped
                success = await self.db.set_tag(appid, 'dropped', is_manual=False)
                if success:
                    dropped_count += 1
                    logger.info(f"Tagged as dropped: {game_name} (appid={appid}, not played for {days_since_played:.0f} days)")
                else:
                    logger.error(f"Failed to tag as dropped: {game_name} (appid={appid})")

            return dropped_count

        except Exception as e:
            logger.error(f"Error checking dropped games: {e}")
            import traceback
            logger.error(traceback.format_exc())
            return 0

    # ==================== Tag Calculation Logic ====================

    async def calculate_auto_tag(self, appid: str) -> Optional[str]:
        """Calculate automatic tag based on game stats

        Tag priority:
        1. Mastered: >=85% achievements unlocked
        2. Completed: playtime >= main_story time from HLTB
        3. Dropped: Not played for over 1 year (only if not mastered/completed)
        4. In Progress: playtime >= threshold (default 30 min)

        Note: Hidden games (non-Steam apps without HLTB) are filtered at sync level.
        """
        # Get game statistics
        stats = await self.db.get_game_stats(appid)
        if not stats:
            return None

        # Get HLTB data
        hltb = await self.db.get_hltb_cache(appid)

        # Get settings
        settings = await self.db.get_all_settings()
        in_progress_threshold = settings.get('in_progress_threshold', 30)  # Default 30 min

        # Priority 1: Mastered (>=85% achievements)
        # Calculate percentage from total/unlocked since it's not stored in DB
        total_achievements = stats.get('total_achievements', 0)
        unlocked_achievements = stats.get('unlocked_achievements', 0)
        if total_achievements > 0:
            achievement_percentage = (unlocked_achievements / total_achievements) * 100
        else:
            achievement_percentage = 0

        if achievement_percentage >= 85:
            return "mastered"

        # Priority 2: Completed (beat main story - playtime >= main_story)
        if hltb and hltb.get('main_story'):
            main_story_hours = hltb['main_story']
            main_story_minutes = main_story_hours * 60

            if stats['playtime_minutes'] >= main_story_minutes:
                return "completed"

        # Priority 3: Dropped (not played for over 1 year)
        # Only check if game was played before (has rt_last_time_played)
        # Don't override mastered/completed above
        rt_last_time_played = stats.get('rt_last_time_played')
        if rt_last_time_played and rt_last_time_played > 0:
            import time
            current_time = int(time.time())
            one_year_seconds = 365 * 24 * 60 * 60
            if current_time - rt_last_time_played > one_year_seconds:
                return "dropped"

        # Priority 4: In Progress (played >= threshold)
        if stats['playtime_minutes'] >= in_progress_threshold:
            return "in_progress"

        return None  # No tag (backlog)

    async def sync_game_tags(self, appid: str, force: bool = False) -> Dict[str, Any]:
        """Sync tags for a single game"""
        try:
            # Get current tag
            current_tag = await self.db.get_tag(appid)

            # Skip if manual override and not forcing
            if current_tag and current_tag.get('is_manual') and not force:
                return current_tag

            # Fetch fresh game stats
            stats = await self.steam_service.get_game_stats_full(appid)

            # This backend-only path reads the local achievement .vdf file
            # directly, which can come back empty (0/0) if that file isn't
            # present/synced on disk at this moment - even though we already
            # have the real count cached from an earlier frontend-driven
            # sync. Don't let a transient empty read clobber a known-good
            # achievement count in the DB.
            if not stats.get('total_achievements'):
                existing_stats = await self.db.get_game_stats(appid)
                if existing_stats and existing_stats.get('total_achievements'):
                    stats['total_achievements'] = existing_stats.get('total_achievements', 0)
                    stats['unlocked_achievements'] = existing_stats.get('unlocked_achievements', 0)
                    stats['achievement_percentage'] = existing_stats.get('achievement_percentage', 0)

            await self.db.update_game_stats(appid, stats)

            # Log playtime and achievement info
            logger.info(f"  Stats: playtime={stats.get('playtime_minutes', 0)}min, " +
                        f"achievements={stats.get('unlocked_achievements', 0)}/{stats.get('total_achievements', 0)}")

            # Fetch HLTB data if not cached
            cached_hltb = await self.db.get_hltb_cache(appid)
            if not cached_hltb:
                hltb_data = await self.hltb_service.search_game(stats['game_name'])
                if hltb_data:
                    await self.db.cache_hltb_data(appid, hltb_data)
                    cached_hltb = hltb_data

            # Log HLTB info
            if cached_hltb:
                logger.info(f"  HLTB: main={cached_hltb.get('main_story')}h, extra={cached_hltb.get('main_extra')}h")
            else:
                logger.info(f"  HLTB: no data")

            # Calculate new tag
            new_tag = await Plugin.calculate_auto_tag(self, appid)
            logger.info(f"  Calculated tag: {new_tag or 'none'}")

            # Update if changed, doesn't exist, or forcing reset from manual
            if new_tag:
                current_tag_value = current_tag.get('tag') if current_tag else None
                is_currently_manual = current_tag.get('is_manual', False) if current_tag else False

                # Update if: tag changed, no existing tag, or resetting from manual (force=True)
                if new_tag != current_tag_value or (force and is_currently_manual):
                    await self.db.set_tag(appid, new_tag, is_manual=False)
                    logger.info(f"  -> Tag set: {new_tag} (reset_manual={force and is_currently_manual})")

            return await self.db.get_tag(appid) or {}

        except Exception as e:
            logger.error(f"Failed to sync tags for {appid}: {e}")
            return {"error": str(e)}

    # ==================== Helper Methods ====================

    def _extract_appid(self, appid) -> str:
        """Extract appid string from various input formats.
        Decky API may pass params as dict or string depending on version."""
        if isinstance(appid, dict):
            # Handle case where call() passes {appid: "123"} as single param
            return str(appid.get('appid', appid))
        return str(appid)

    def _extract_params(self, first_arg, **kwargs) -> Dict[str, Any]:
        """Extract parameters from Decky API call.
        Decky may pass all params as a single dict in first_arg."""
        if isinstance(first_arg, dict):
            # All params came as a dict in first argument
            return first_arg
        # Traditional separate arguments
        result = {'appid': str(first_arg)} if first_arg is not None else {}
        result.update(kwargs)
        return result

    # ==================== Plugin API Methods ====================

    async def get_game_tag(self, appid) -> Dict[str, Any]:
        """Get tag for a specific game"""
        appid = self._extract_appid(appid)
        logger.info(f"=== get_game_tag called: appid={appid} ===")
        try:
            tag = await self.db.get_tag(appid)
            logger.info(f"[get_game_tag] appid={appid}, tag={tag}")
            if tag:
                return {"success": True, "tag": tag}
            return {"success": True, "tag": None}
        except Exception as e:
            logger.error(f"Error getting tag for {appid}: {e}")
            import traceback
            logger.error(traceback.format_exc())
            return {"success": False, "error": str(e)}

    async def set_manual_tag(self, appid_or_params, tag: str = None) -> Dict[str, bool]:
        """Manually set/override tag"""
        # Extract params - Decky may pass {appid, tag} as single dict
        params = self._extract_params(appid_or_params, tag=tag)
        appid = str(params.get('appid', ''))
        tag = params.get('tag')

        logger.info(f"=== set_manual_tag called: appid={appid}, tag={tag} ===")

        if not appid:
            return {"success": False, "error": "Missing appid parameter"}
        if not tag:
            return {"success": False, "error": "Missing tag parameter"}

        try:
            # Validate tag
            valid_tags = ['completed', 'in_progress', 'mastered', 'dropped']
            if tag not in valid_tags:
                logger.error(f"Invalid tag: {tag}. Must be one of: {valid_tags}")
                return {"success": False, "error": f"Invalid tag. Must be one of: {valid_tags}"}

            success = await self.db.set_tag(appid, tag, is_manual=True)
            logger.info(f"[set_manual_tag] appid={appid}, tag={tag}, success={success}")
            return {"success": success}
        except Exception as e:
            logger.error(f"Error setting manual tag for {appid}: {e}")
            import traceback
            logger.error(traceback.format_exc())
            return {"success": False, "error": str(e)}

    async def remove_tag(self, appid) -> Dict[str, bool]:
        """Remove tag from game"""
        appid = self._extract_appid(appid)
        try:
            success = await self.db.remove_tag(appid)
            return {"success": success}
        except Exception as e:
            logger.error(f"Error removing tag for {appid}: {e}")
            return {"success": False, "error": str(e)}

    async def reset_to_auto_tag(self, appid) -> Dict[str, Any]:
        """Reset manual override to auto-calculated tag"""
        appid = self._extract_appid(appid)
        try:
            # Force recalculation
            result = await Plugin.sync_game_tags(self, appid, force=True)
            return {"success": True, "tag": result}
        except Exception as e:
            logger.error(f"Error resetting tag for {appid}: {e}")
            return {"success": False, "error": str(e)}

    async def search_hltb_candidates(self, appid_or_params, query: str = None) -> Dict[str, Any]:
        """Search HLTB manually and return candidates for the user to pick
        from, when the automatic search didn't find (or got wrong) a match."""
        params = self._extract_params(appid_or_params, query=query)
        query = params.get('query')

        if not query:
            return {"success": False, "error": "Missing query parameter"}

        try:
            candidates = await self.hltb_service.search_candidates(query)
            return {"success": True, "candidates": candidates}
        except Exception as e:
            logger.error(f"Error searching HLTB candidates for '{query}': {e}")
            return {"success": False, "error": str(e)}

    async def set_manual_hltb_match(self, appid_or_params, candidate: Dict[str, Any] = None) -> Dict[str, Any]:
        """Manually set the HLTB match for a game, picked by the user from
        search_hltb_candidates results."""
        params = self._extract_params(appid_or_params, candidate=candidate)
        appid = str(params.get('appid', ''))
        candidate = params.get('candidate')

        logger.info(f"=== set_manual_hltb_match called: appid={appid} ===")

        if not appid:
            return {"success": False, "error": "Missing appid parameter"}
        if not candidate or not candidate.get('main_story'):
            return {"success": False, "error": "Missing or incomplete candidate"}

        try:
            await self.db.cache_hltb_data(appid, candidate)

            # Un-hide the game (it was likely hidden for lacking HLTB data)
            # and recalculate its auto tag immediately, instead of waiting
            # for the next sync pass.
            stats = await self.db.get_game_stats(appid)
            if stats and stats.get('is_hidden'):
                stats['is_hidden'] = False
                await self.db.update_game_stats(appid, stats)

            current_tag = await self.db.get_tag(appid)
            if not (current_tag and current_tag.get('is_manual')):
                calculated_tag = await Plugin.calculate_auto_tag(self, appid)
                if calculated_tag and calculated_tag != (current_tag.get('tag') if current_tag else None):
                    await self.db.set_tag(appid, calculated_tag, is_manual=False)

            return {"success": True}
        except Exception as e:
            logger.error(f"Error setting manual HLTB match for {appid}: {e}")
            import traceback
            logger.error(traceback.format_exc())
            return {"success": False, "error": str(e)}




    async def get_game_details(self, appid) -> Dict[str, Any]:
        """Get all details for a game"""
        appid = self._extract_appid(appid)
        logger.info(f"=== get_game_details called: appid={appid} ===")
        try:
            # Get stats
            stats = await self.db.get_game_stats(appid)
            logger.info(f"[get_game_details] stats from db: {stats}")

            # If no stats, fetch from Steam
            if not stats:
                logger.info(f"[get_game_details] no stats in db, fetching from Steam...")
                stats = await self.steam_service.get_game_stats_full(appid)
                logger.info(f"[get_game_details] stats from Steam: {stats}")
                if stats:
                    await self.db.update_game_stats(appid, stats)

            # Get tag
            tag = await self.db.get_tag(appid)
            logger.info(f"[get_game_details] tag: {tag}")

            # Get HLTB data
            hltb_data = await self.db.get_hltb_cache(appid)
            logger.info(f"[get_game_details] hltb_data: {hltb_data}")

            # Fix game name if it's "Unknown Game" (e.g., non-Steam games)
            if stats:
                game_name = stats.get('game_name')
                if not game_name or game_name.startswith('Unknown Game') or game_name.startswith('Game '):
                    real_name = await self.steam_service.get_game_name(appid)
                    if real_name and not real_name.startswith('Unknown Game') and not real_name.startswith('Game '):
                        stats['game_name'] = real_name
                        logger.info(f"[get_game_details] fixed game_name to: {real_name}")

            result = {
                "success": True,
                "appid": appid,
                "stats": stats,
                "tag": tag,
                "hltb_data": hltb_data
            }
            logger.info(f"[get_game_details] returning: success=True")
            return result

        except Exception as e:
            logger.error(f"Error getting game details for {appid}: {e}")
            import traceback
            logger.error(traceback.format_exc())
            return {"success": False, "error": str(e)}

    async def get_settings(self) -> Dict[str, Any]:
        """Get all plugin settings"""
        try:
            settings = await self.db.get_all_settings()
            return {"success": True, "settings": settings}
        except Exception as e:
            logger.error(f"Error getting settings: {e}")
            return {"success": False, "error": str(e)}

    async def update_settings(self, settings: Dict[str, Any]) -> Dict[str, bool]:
        """Update plugin settings"""
        try:
            for key, value in settings.items():
                await self.db.set_setting(key, value)

            logger.info(f"Settings updated: {settings}")
            return {"success": True}
        except Exception as e:
            logger.error(f"Error updating settings: {e}")
            return {"success": False, "error": str(e)}

    async def get_tag_statistics(self) -> Dict[str, Any]:
        """Get counts per tag type"""
        logger.info("=== get_tag_statistics called ===")
        try:
            all_tags = await self.db.get_all_tags()
            logger.info(f"[get_tag_statistics] all_tags count: {len(all_tags) if all_tags else 0}")
            if all_tags:
                logger.info(f"[get_tag_statistics] all_tags sample (first 3): {all_tags[:3]}")

            # Exclude hidden games from statistics (non-Steam apps without HLTB data)
            all_games = await self.db.get_all_game_stats(include_hidden=False)
            total_library = len(all_games) if all_games else 0
            logger.info(f"[get_tag_statistics] total_library (visible games): {total_library}")

            # Count tags only for non-hidden games
            visible_tags = 0
            tag_counts = {
                "completed": 0,
                "in_progress": 0,
                "mastered": 0,
                "dropped": 0,
            }

            for tag_entry in all_tags:
                appid = tag_entry.get('appid')
                # Check if this game is hidden
                game_stats = await self.db.get_game_stats(appid)
                if game_stats and game_stats.get('is_hidden'):
                    continue  # Skip hidden games

                tag_type = tag_entry.get('tag')
                if tag_type in tag_counts:
                    tag_counts[tag_type] += 1
                    visible_tags += 1

            stats = {
                **tag_counts,
                "backlog": total_library - visible_tags,
                "total": total_library
            }

            result = {"success": True, "stats": stats}
            logger.info(f"[get_tag_statistics] returning: {result}")
            return result
        except Exception as e:
            logger.error(f"Error getting tag statistics: {e}")
            import traceback
            logger.error(traceback.format_exc())
            return {"success": False, "error": str(e)}

    async def log_frontend(self, level: str, message: str) -> Dict[str, bool]:
        """Log a message from the frontend to the backend log file"""
        if level == "error":
            logger.error(f"[FRONTEND] {message}")
        elif level == "warn":
            logger.warning(f"[FRONTEND] {message}")
        else:
            logger.info(f"[FRONTEND] {message}")
        return {"success": True}

    async def get_sync_progress(self) -> Dict[str, Any]:
        """Get current sync progress for frontend to display"""
        return {
            "success": True,
            "syncing": self.sync_in_progress,
            "current": self.sync_current,
            "total": self.sync_total
        }

    async def record_play_session(self, appid_or_params, seconds: int = None, game_name: str = None) -> Dict[str, Any]:
        """Record a real play session duration (from SteamClient game lifetime
        notifications on the frontend). Only applied for non-Steam shortcuts,
        since Steam already tracks regular games' playtime reliably."""
        params = self._extract_params(appid_or_params, seconds=seconds, game_name=game_name)
        appid = str(params.get('appid', ''))
        seconds = int(params.get('seconds') or 0)
        game_name = params.get('game_name') or ''

        if not appid or seconds <= 0:
            return {"success": False, "error": "Invalid appid or seconds"}

        try:
            appid_int = int(appid)
            is_non_steam = appid_int > 2000000000
        except (ValueError, TypeError):
            is_non_steam = False

        if not is_non_steam:
            # Regular Steam games already get reliable playtime via appStore
            return {"success": True, "skipped": True}

        await self.db.add_tracked_playtime(appid, seconds, game_name)
        logger.info(f"Recorded play session for non-Steam appid={appid}: +{seconds}s")
        return {"success": True}

    async def sync_single_game_with_data(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Sync a single game with its complete data (progressive sync)

        This is used for progressive sync where frontend sends one game at a time
        with all its data (playtime, achievements, name) for immediate processing.
        """
        logger.info("=== sync_single_game_with_data called ===")

        try:
            # Extract parameters
            appid = str(params.get('appid', ''))
            game_data = params.get('game_data', {})
            achievement_data = params.get('achievement_data')
            game_name = params.get('game_name')

            # Track if this is part of a larger sync operation
            is_bulk_sync = params.get('is_bulk_sync', False)
            current_index = params.get('current_index', 0)
            total_count = params.get('total_count', 1)

            if not appid:
                return {"success": False, "error": "Missing appid"}

            # Update sync progress if part of bulk operation
            if is_bulk_sync:
                self.sync_in_progress = True
                self.sync_current = current_index
                self.sync_total = total_count

            # Extract game data
            # Some non-Steam shortcuts report playtime as a fractional-minute
            # string (e.g. "234.7") rather than a clean integer - go through
            # float() first so this never crashes the whole sync for that
            # one game (which would otherwise also skip its HLTB lookup).
            playtime_minutes = int(float(game_data.get('playtime_minutes', 0) or 0))
            rt_last_time_played = game_data.get('rt_last_time_played')

            # Extract achievement data if present
            if achievement_data and achievement_data.get('total', 0) > 0:
                total_achievements = achievement_data.get('total')
                unlocked_achievements = achievement_data.get('unlocked', 0)
                achievement_percentage = achievement_data.get('percentage', 0.0)
            else:
                total_achievements = None
                unlocked_achievements = None
                achievement_percentage = None

            # Process the game
            result = await Plugin.sync_game_with_playtime(
                self, appid, playtime_minutes,
                total_achievements, unlocked_achievements, achievement_percentage,
                game_name, rt_last_time_played
            )

            # Clear sync progress if this was the last game
            if is_bulk_sync and current_index >= total_count:
                self.sync_in_progress = False
                self.sync_current = 0
                self.sync_total = 0

            return {
                "success": True,
                "appid": appid,
                "tag_changed": result.get('tag_changed', False),
                "tag": result.get('tag')
            }

        except Exception as e:
            logger.error(f"sync_single_game_with_data failed for {params.get('appid')}: {e}")
            import traceback
            logger.error(traceback.format_exc())
            return {"success": False, "error": str(e)}

    async def get_all_games(self) -> Dict[str, Any]:
        """Get list of all games for frontend to fetch playtime"""
        logger.info("=== get_all_games called (frontend requesting game list) ===")
        try:
            # Get source settings
            settings = await self.db.get_all_settings()
            source_installed = settings.get('source_installed', True)
            source_non_steam = settings.get('source_non_steam', False)

            logger.info(f"Game sources: installed={source_installed}, non_steam={source_non_steam}")

            games = []

            # Get installed Steam games
            if source_installed:
                installed_games = await self.steam_service.get_all_games()
                games.extend(installed_games)
                logger.info(f"Added {len(installed_games)} installed games")

            # Get non-Steam games
            if source_non_steam:
                non_steam_games = await self.steam_service.get_non_steam_games()
                games.extend(non_steam_games)
                logger.info(f"Added {len(non_steam_games)} non-Steam games")

            logger.info(f"get_all_games: returning {len(games)} total games to frontend")
            return {"success": True, "games": games}
        except Exception as e:
            logger.error(f"get_all_games failed: {e}")
            import traceback
            logger.error(traceback.format_exc())
            return {"success": False, "error": str(e)}

    async def sync_library_with_playtime(self, playtime_data_or_params: Dict[str, Any], achievement_data: Dict[str, Dict[str, int]] = None) -> Dict[str, Any]:
        """Sync library using playtime and achievement data provided by frontend"""
        logger.info("=== sync_library_with_playtime called ===")

        # Handle Decky API passing all params as single dict
        # Frontend calls: call('sync_library_with_playtime', { game_data, achievement_data })
        # Decky passes entire object as first argument
        if isinstance(playtime_data_or_params, dict) and 'game_data' in playtime_data_or_params:
            game_data = playtime_data_or_params.get('game_data', {})
            achievement_data = playtime_data_or_params.get('achievement_data', {})
            game_names = playtime_data_or_params.get('game_names', {})
        elif isinstance(playtime_data_or_params, dict) and 'playtime_data' in playtime_data_or_params:
            # Backwards compatibility: convert old playtime_data format to game_data format
            playtime_data = playtime_data_or_params.get('playtime_data', {})
            game_data = {appid: {"playtime_minutes": mins, "rt_last_time_played": None}
                        for appid, mins in playtime_data.items()}
            achievement_data = playtime_data_or_params.get('achievement_data', {})
            game_names = playtime_data_or_params.get('game_names', {})
        else:
            # Direct params (backwards compatibility)
            playtime_data = playtime_data_or_params
            game_data = {appid: {"playtime_minutes": mins, "rt_last_time_played": None}
                        for appid, mins in playtime_data.items()}
            if achievement_data is None:
                achievement_data = {}
            game_names = {}

        try:
            logger.info(f"=== Starting sync with {len(game_data)} game entries ===")

            # Only sync games that were passed in game_data
            # This prevents single-game syncs from overwriting all other games with zeros
            appids_to_sync = list(game_data.keys())
            total = len(appids_to_sync)
            synced = 0
            new_tags = 0  # Track newly tagged games for notifications
            errors = 0
            error_list = []

            # Set sync progress for universal tracking
            self.sync_in_progress = True
            self.sync_current = 0
            self.sync_total = total

            hltb_requests = 0  # Track HLTB API requests for rate limiting

            for i, appid in enumerate(appids_to_sync):
                # Get game name from frontend (works for uninstalled games!)
                game_name = game_names.get(appid, None)

                # Extract game data from new structure
                game_info = game_data.get(appid, {})
                if isinstance(game_info, dict):
                    # Some non-Steam shortcuts report a fractional-minute
                    # string (e.g. "234.7") rather than a clean integer.
                    playtime_minutes = int(float(game_info.get('playtime_minutes', 0) or 0))
                    rt_last_time_played = game_info.get('rt_last_time_played')
                elif isinstance(game_info, (int, float, str)):
                    # Backwards compatibility: if old format passes just int/float/str
                    playtime_minutes = int(float(game_info or 0))
                    rt_last_time_played = None
                else:
                    logger.warning(f"Unexpected game_info type for {appid}: {type(game_info)} = {game_info}")
                    playtime_minutes = 0
                    rt_last_time_played = None

                # Get achievement data from frontend (None if not available)
                # We only pass data if we have actual achievement info (total > 0)
                # Otherwise pass None to preserve existing DB values
                game_achievements = achievement_data.get(appid)
                if isinstance(game_achievements, dict) and game_achievements.get('total', 0) > 0:
                    total_achievements = game_achievements.get('total')
                    unlocked_achievements = game_achievements.get('unlocked', 0)
                    achievement_percentage = game_achievements.get('percentage', 0.0)
                else:
                    # No achievement data from frontend - pass None to preserve existing
                    total_achievements = None
                    unlocked_achievements = None
                    achievement_percentage = None

                # Log progress every 50 games to reduce log spam
                if i % 50 == 0 or i == total - 1:
                    logger.info(f"[{i+1}/{total}] Progress: syncing game {appid} ({game_name or 'unknown'})")

                try:
                    # Check if we need to fetch HLTB (no cache and has playtime)
                    cached_hltb = await self.db.get_hltb_cache(appid)
                    needs_hltb = not cached_hltb and playtime_minutes > 0

                    result = await Plugin.sync_game_with_playtime(self, appid, playtime_minutes, total_achievements, unlocked_achievements, achievement_percentage, game_name, rt_last_time_played)
                    synced += 1

                    # Update sync progress
                    self.sync_current = i + 1

                    # Track if this game got a new/changed tag
                    if result.get('tag_changed'):
                        new_tags += 1

                    # Only add delay when we actually made an HLTB request
                    if needs_hltb:
                        hltb_requests += 1
                        # Rate limit: delay every 5 HLTB requests
                        if hltb_requests % 5 == 0:
                            await asyncio.sleep(1.0)

                except Exception as e:
                    errors += 1
                    error_list.append({"appid": appid, "error": str(e)})
                    logger.error(f"[{i+1}/{total}] Failed: {game_name} - {e}")
                    # Update progress even on error
                    self.sync_current = i + 1

            logger.info(f"Library sync completed: {synced}/{total} synced, {new_tags} new tags, {errors} errors")

            # Clear sync progress
            self.sync_in_progress = False
            self.sync_current = 0
            self.sync_total = 0

            return {
                "success": True,
                "total": total,
                "synced": synced,
                "new_tags": new_tags,  # New field for notification purposes
                "errors": errors,
                "error_details": error_list[:10]
            }

        except Exception as e:
            logger.error(f"sync_library_with_playtime failed: {e}")
            import traceback
            logger.error(traceback.format_exc())
            # Clear sync progress on error
            self.sync_in_progress = False
            self.sync_current = 0
            self.sync_total = 0
            return {"success": False, "error": str(e)}

    async def _fetch_game_name_from_steam_store(self, appid: str) -> Optional[str]:
        """Fetch game name from Steam's store API (works for uninstalled games)"""
        import urllib.request
        import json as json_lib

        try:
            url = f"https://store.steampowered.com/api/appdetails?appids={appid}"
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=5) as response:
                data = json_lib.loads(response.read().decode())
                if data.get(str(appid), {}).get('success'):
                    name = data[str(appid)]['data'].get('name')
                    return name
        except Exception as e:
            pass

        return None

    async def sync_game_with_playtime(self, appid: str, playtime_minutes: int, total_achievements: int = None, unlocked_achievements: int = None, achievement_percentage: float = None, frontend_game_name: str = None, rt_last_time_played: int = None) -> Dict[str, Any]:
        """Sync a single game using frontend-provided playtime, achievements, name, and last played timestamp

        NOTE: Achievement params can be None if frontend doesn't have data.
        In that case, we preserve existing achievement data in DB.
        """

        # Get current tag
        current_tag = await self.db.get_tag(appid)
        is_manual = current_tag and current_tag.get('is_manual')

        # Get existing stats to preserve achievement data if frontend doesn't have it
        existing_stats = await self.db.get_game_stats(appid)

        # Use game name from frontend if provided (works for uninstalled games!)
        if frontend_game_name:
            game_name = frontend_game_name
        else:
            # Fallback: Get game name from steam service (local appmanifest)
            game_name = await self.steam_service.get_game_name(appid)

            # If still not found locally (uninstalled game), try Steam Store API
            if not game_name or game_name.startswith('Unknown Game') or game_name.startswith('Game '):
                store_name = await self._fetch_game_name_from_steam_store(appid)
                if store_name:
                    game_name = store_name
                    logger.info(f"  Got name from Steam Store: {game_name}")

        # Check if this is a non-Steam game (appid > 2 billion = CRC32 hash)
        try:
            appid_int = int(appid)
            is_non_steam = appid_int > 2000000000
        except (ValueError, TypeError):
            is_non_steam = False

        # The frontend's appStore overview doesn't reliably report playtime
        # for non-Steam shortcuts. For those, never let it regress below
        # either of our two reliable sources: the real value Steam itself
        # keeps on disk (localconfig.vdf, keyed by the signed appid), or
        # what we've tracked ourselves via game session start/stop
        # notifications (see record_play_session).
        if is_non_steam:
            disk_minutes = await self.steam_service.get_game_playtime(appid)
            tracked_minutes = (existing_stats.get('tracked_playtime_seconds', 0) or 0) // 60 if existing_stats else 0
            best_known_minutes = max(disk_minutes, tracked_minutes)

            if best_known_minutes > playtime_minutes:
                logger.info(f"  Non-Steam game: using localconfig.vdf/tracked playtime ({best_known_minutes}min) over frontend value ({playtime_minutes}min)")
                playtime_minutes = best_known_minutes

        # Fetch HLTB if needed (do this before building stats so we can set is_hidden)
        # Retry HLTB lookup if:
        # 1. No cache exists at all
        # 2. Cache exists but has no main_story data (might have failed before)
        cached_hltb = await self.db.get_hltb_cache(appid)
        should_fetch_hltb = not cached_hltb or not cached_hltb.get('main_story')

        if should_fetch_hltb:
            logger.info(f"  Fetching HLTB for: {game_name} (cached={bool(cached_hltb)}, has_main_story={cached_hltb.get('main_story') if cached_hltb else None})")
            hltb_data = await self.hltb_service.search_game(game_name)
            if hltb_data and hltb_data.get('main_story'):
                # Only cache if we got actual completion time data
                await self.db.cache_hltb_data(appid, hltb_data)
                cached_hltb = hltb_data
                logger.info(f"  HLTB cached: main_story={hltb_data.get('main_story')}h")

        # Determine if this game should be hidden from library
        # Hide non-Steam apps that have no HLTB data (likely not real games: Discord, Chrome, etc.)
        is_hidden = is_non_steam and not cached_hltb

        # Build stats object with frontend playtime and achievements
        # If frontend doesn't have achievement data (None), preserve existing DB values
        final_total_achievements = total_achievements if total_achievements is not None else (existing_stats.get('total_achievements', 0) if existing_stats else 0)
        final_unlocked_achievements = unlocked_achievements if unlocked_achievements is not None else (existing_stats.get('unlocked_achievements', 0) if existing_stats else 0)
        final_achievement_percentage = achievement_percentage if achievement_percentage is not None else (existing_stats.get('achievement_percentage', 0.0) if existing_stats else 0.0)

        stats = {
            "appid": appid,
            "game_name": game_name,
            "playtime_minutes": playtime_minutes,  # From frontend!
            "total_achievements": final_total_achievements,
            "unlocked_achievements": final_unlocked_achievements,
            "achievement_percentage": round(final_achievement_percentage, 2),
            "is_hidden": is_hidden,
            "rt_last_time_played": rt_last_time_played  # Unix timestamp of last play
        }

        await self.db.update_game_stats(appid, stats)

        logger.info(f"  Stats: playtime={playtime_minutes}min, " +
                    f"achievements={final_unlocked_achievements}/{final_total_achievements}" +
                    (f", HIDDEN (non-Steam app without HLTB)" if is_hidden else "") +
                    (f", last_played={rt_last_time_played}" if rt_last_time_played else ""))

        if cached_hltb:
            logger.info(f"  HLTB: main={cached_hltb.get('main_story')}h, extra={cached_hltb.get('main_extra')}h")
        else:
            logger.info(f"  HLTB: no data")

        # Calculate tag (but don't override manual tags or hidden games)
        tag_changed = False

        if is_manual:
            logger.info(f"  Skipping tag calculation (manual override)")
        elif is_hidden:
            logger.info(f"  Skipping tag calculation (hidden non-Steam app)")
        else:
            # Calculate tag using centralized logic
            calculated_tag = await Plugin.calculate_auto_tag(self, appid)
            logger.info(f"  Calculated tag: {calculated_tag or 'none'}")

            # Apply calculated tag if it changed
            if calculated_tag:
                current_tag_value = current_tag.get('tag') if current_tag else None
                if calculated_tag != current_tag_value:
                    await self.db.set_tag(appid, calculated_tag, is_manual=False)
                    logger.info(f"  -> Tag set: {calculated_tag}")
                    tag_changed = True

        result = await self.db.get_tag(appid) or {}
        result['tag_changed'] = tag_changed
        return result

    async def get_all_tags_with_names(self) -> Dict[str, Any]:
        """Get all tags with game names for display"""
        logger.info("=== get_all_tags_with_names called ===")
        try:
            all_tags = await self.db.get_all_tags()
            logger.info(f"[get_all_tags_with_names] all_tags count: {len(all_tags) if all_tags else 0}")
            if all_tags:
                logger.info(f"[get_all_tags_with_names] all_tags sample (first 3): {all_tags[:3]}")

            result = []
            for tag_entry in all_tags:
                logger.info(f"[get_all_tags_with_names] tag_entry: {tag_entry}")
                appid = tag_entry['appid']
                stats = await self.db.get_game_stats(appid)
                logger.info(f"[get_all_tags_with_names] stats: {stats}")

                # Skip hidden games UNLESS they have a manual tag
                # (user explicitly tagged them, so they want to see them)
                is_hidden = stats.get('is_hidden', False) if stats else False
                is_manual = tag_entry.get('is_manual', False)
                if is_hidden and not is_manual:
                    logger.info(f"[get_all_tags_with_names] skipping hidden non-Steam app: {appid}")
                    continue

                game_name = stats.get('game_name') if stats else None
                logger.info(f"[get_all_tags_with_names] game_name: {game_name}")

                # If no name in stats, try to get it from Steam/shortcuts
                if not game_name or game_name.startswith('Unknown Game') or game_name.startswith('Game '):
                    game_name = await self.steam_service.get_game_name(appid)

                result.append({
                    'appid': appid,
                    'game_name': game_name,
                    'tag': tag_entry['tag'],
                    'is_manual': is_manual
                })

            # Sort by tag type, then by name
            tag_order = {'completed': 0, 'mastered': 1, 'in_progress': 2, 'dropped': 3}
            result.sort(key=lambda x: (tag_order.get(x['tag'], 99), x['game_name'].lower()))

            logger.info(f"[get_all_tags_with_names] returning {len(result)} games")
            if result:
                logger.info(f"[get_all_tags_with_names] result sample (first 3): {result[:3]}")
            return {'success': True, 'games': result}
        except Exception as e:
            logger.error(f"Error getting all tags with names: {e}")
            import traceback
            logger.error(traceback.format_exc())
            return {'success': False, 'error': str(e)}

    async def get_backlog_games(self) -> Dict[str, Any]:
        """Get all games without a tag (backlog games)"""
        logger.info("=== get_backlog_games called ===")
        try:
            # Get all tagged appids
            all_tags = await self.db.get_all_tags()
            tagged_appids = set(tag['appid'] for tag in all_tags) if all_tags else set()
            logger.info(f"[get_backlog_games] tagged_appids count: {len(tagged_appids)}")

            # Get all games from stats (excluding hidden games)
            all_game_stats = await self.db.get_all_game_stats(include_hidden=False)
            logger.info(f"[get_backlog_games] all_game_stats count (visible only): {len(all_game_stats) if all_game_stats else 0}")

            result = []
            for game in all_game_stats:
                appid = game['appid']
                if appid not in tagged_appids:
                    # Get game name
                    stats = await self.db.get_game_stats(appid)
                    game_name = stats.get('game_name') if stats else None

                    # If no name in stats, try to get from Steam/shortcuts
                    if not game_name or game_name.startswith('Unknown Game') or game_name.startswith('Game '):
                        game_name = await self.steam_service.get_game_name(appid)

                    result.append({
                        'appid': appid,
                        'game_name': game_name or f'Game {appid}',
                        'tag': 'backlog',
                        'is_manual': False
                    })

            # Sort by name
            result.sort(key=lambda x: x['game_name'].lower())

            logger.info(f"[get_backlog_games] returning {len(result)} games")
            if result:
                logger.info(f"[get_backlog_games] result sample (first 3): {result[:3]}")
            return {'success': True, 'games': result}
        except Exception as e:
            logger.error(f"Error getting backlog games: {e}")
            import traceback
            logger.error(traceback.format_exc())
            return {'success': False, 'error': str(e)}

    async def check_dropped_games(self, days_threshold: int = 365) -> Dict[str, Any]:
        """Manually trigger check for dropped games (for testing/manual run)"""
        logger.info(f"=== check_dropped_games called manually (threshold={days_threshold} days) ===")
        try:
            dropped_count = await self._check_and_tag_dropped_games(days_threshold)
            return {
                "success": True,
                "dropped_count": dropped_count,
                "message": f"Tagged {dropped_count} games as dropped"
            }
        except Exception as e:
            logger.error(f"Manual dropped games check failed: {e}")
            import traceback
            logger.error(traceback.format_exc())
            return {"success": False, "error": str(e)}
