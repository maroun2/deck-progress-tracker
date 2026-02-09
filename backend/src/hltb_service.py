"""
HowLongToBeat Service
Fetches game completion times from HowLongToBeat using standard library only
"""

import asyncio
import json
import ssl
import re
import urllib.request
import urllib.parse
import urllib.error
from typing import Optional, Dict, Any, List
from difflib import SequenceMatcher

# Create SSL context that doesn't verify certificates (Steam Deck may have cert issues)
SSL_CONTEXT = ssl.create_default_context()
SSL_CONTEXT.check_hostname = False
SSL_CONTEXT.verify_mode = ssl.CERT_NONE

# Use Decky's built-in logger
import decky
logger = decky.logger


class RedirectHandler(urllib.request.HTTPRedirectHandler):
    """Custom redirect handler that follows redirects for POST requests"""

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        """Handle redirect - preserve method and data for 307/308"""
        # For 307 and 308, we should preserve the method and body
        if code in (307, 308):
            # Create new request with same method and data
            new_req = urllib.request.Request(
                newurl,
                data=req.data,
                headers=dict(req.headers),
                method=req.get_method()
            )
            return new_req
        # For other redirects, use default behavior
        return super().redirect_request(req, fp, code, msg, headers, newurl)


class HLTBService:
    def __init__(self):
        self.min_similarity = 0.7  # Minimum similarity threshold
        self.base_url = "https://howlongtobeat.com"
        self.user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

        # Create opener with custom redirect handler
        self.opener = urllib.request.build_opener(
            RedirectHandler(),
            urllib.request.HTTPSHandler(context=SSL_CONTEXT)
        )

    def _calculate_similarity(self, str1: str, str2: str) -> float:
        """Calculate string similarity using SequenceMatcher"""
        return SequenceMatcher(None, str1.lower(), str2.lower()).ratio()

    def _make_request(self, url: str, data: bytes = None, headers: dict = None, method: str = 'GET') -> Optional[bytes]:
        """Make HTTP request with redirect handling"""
        if headers is None:
            headers = {}

        req = urllib.request.Request(url, data=data, headers=headers, method=method)

        try:
            with self.opener.open(req, timeout=15) as response:
                return response.read()
        except urllib.error.HTTPError as e:
            # Log the error details
            logger.debug(f"HTTP Error {e.code} for {url}: {e.reason}")
            if e.code in (307, 308):
                # Manual redirect handling as fallback
                redirect_url = e.headers.get('Location')
                if redirect_url:
                    logger.debug(f"Following redirect to: {redirect_url}")
                    req = urllib.request.Request(redirect_url, data=data, headers=headers, method=method)
                    with self.opener.open(req, timeout=15) as response:
                        return response.read()
            raise
        except Exception as e:
            logger.debug(f"Request error for {url}: {e}")
            raise

    def _search_sync(self, game_name: str) -> Optional[Dict[str, Any]]:
        """Synchronous HLTB search"""
        try:
            # Build headers
            headers = {
                "Content-Type": "application/json",
                "Accept": "*/*",
                "User-Agent": self.user_agent,
                "Referer": f"{self.base_url}/",
                "Origin": self.base_url,
            }

            # HLTB API payload - simplified version
            payload = {
                "searchType": "games",
                "searchTerms": game_name.split(),
                "searchPage": 1,
                "size": 20,
                "searchOptions": {
                    "games": {
                        "userId": 0,
                        "platform": "",
                        "sortCategory": "popular",
                        "rangeCategory": "main",
                        "rangeTime": {"min": None, "max": None},
                        "gameplay": {"perspective": "", "flow": "", "genre": ""},
                        "rangeYear": {"min": "", "max": ""},
                        "modifier": ""
                    },
                    "users": {"sortCategory": "postcount"},
                    "filter": "",
                    "sort": 0,
                    "randomizer": 0
                }
            }

            data = json.dumps(payload).encode('utf-8')

            # Try multiple API endpoints
            endpoints = [
                f"{self.base_url}/api/search",      # Original endpoint
                f"{self.base_url}/api/s/",          # New endpoint
                f"{self.base_url}/api/search/",     # With trailing slash
            ]

            result = None
            last_error = None

            for endpoint in endpoints:
                try:
                    logger.debug(f"Trying HLTB endpoint: {endpoint}")
                    response_data = self._make_request(endpoint, data=data, headers=headers, method='POST')
                    result = json.loads(response_data.decode('utf-8'))
                    logger.debug(f"Success with endpoint: {endpoint}")
                    break
                except Exception as e:
                    last_error = e
                    logger.debug(f"Endpoint {endpoint} failed: {e}")
                    continue

            if result is None:
                if last_error:
                    raise last_error
                return None

            games = result.get("data", [])
            if not games:
                return None

            # Find best match by name similarity
            best_match = None
            best_similarity = 0.0

            for game in games:
                game_title = game.get("game_name", "")
                similarity = self._calculate_similarity(game_name, game_title)

                if similarity > best_similarity:
                    best_similarity = similarity
                    best_match = game

            if not best_match or best_similarity < self.min_similarity:
                return None

            # Extract times (convert from seconds to hours)
            def to_hours(seconds):
                if seconds and seconds > 0:
                    return round(seconds / 3600, 1)
                return None

            return {
                "game_name": game_name,
                "matched_name": best_match.get("game_name"),
                "similarity": round(best_similarity, 2),
                "main_story": to_hours(best_match.get("comp_main")),
                "main_extra": to_hours(best_match.get("comp_plus")),
                "completionist": to_hours(best_match.get("comp_100")),
                "all_styles": to_hours(best_match.get("comp_all")),
                "hltb_url": f"https://howlongtobeat.com/game/{best_match.get('game_id')}"
            }

        except Exception as e:
            logger.error(f"HLTB search error: {e}")
            return None

    async def search_game(self, game_name: str) -> Optional[Dict[str, Any]]:
        """Search HLTB for game completion times"""
        if not game_name or game_name.startswith("Unknown"):
            return None

        # Skip non-game entries (Proton, Steam Runtime, etc.)
        skip_patterns = [
            "proton", "steam linux runtime", "steamworks",
            "redistributable", "directx", "vcredist"
        ]
        name_lower = game_name.lower()
        for pattern in skip_patterns:
            if pattern in name_lower:
                logger.debug(f"Skipping non-game: {game_name}")
                return None

        try:
            logger.debug(f"Searching HLTB for: {game_name}")

            # Run sync request in thread pool
            result = await asyncio.to_thread(self._search_sync, game_name)

            if result:
                logger.info(
                    f"Found HLTB match: {result['matched_name']} "
                    f"(similarity: {result['similarity']:.2f})"
                )
            else:
                logger.debug(f"No HLTB results found for: {game_name}")

            return result

        except Exception as e:
            logger.error(f"HLTB search failed for {game_name}: {e}")
            return None

    async def bulk_fetch_games(
        self,
        game_list: List[Dict[str, str]],
        delay: float = 1.0,
        progress_callback=None
    ) -> Dict[str, Dict[str, Any]]:
        """Batch fetch multiple games with rate limiting"""
        results = {}
        total = len(game_list)

        for i, game in enumerate(game_list):
            appid = game.get("appid")
            game_name = game.get("name")

            if not appid or not game_name:
                continue

            result = await self.search_game(game_name)

            if result:
                results[appid] = result

            # Progress callback
            if progress_callback:
                progress_callback(i + 1, total)

            # Rate limiting delay
            if i < total - 1:  # Don't delay after last item
                await asyncio.sleep(delay)

        logger.info(f"Bulk fetch completed: {len(results)}/{total} games found")
        return results

    async def get_completion_time(
        self,
        appid: str,
        game_name: str,
        cache_lookup_func=None
    ) -> Optional[Dict[str, Any]]:
        """
        Get completion time for a game, checking cache first
        """
        # Check cache if function provided
        if cache_lookup_func:
            cached_data = await cache_lookup_func(appid)
            if cached_data:
                logger.debug(f"Using cached HLTB data for {appid}")
                return cached_data

        # Fetch fresh data
        return await self.search_game(game_name)
