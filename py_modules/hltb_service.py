"""
HowLongToBeat Service
Fetches game completion times from HowLongToBeat via the howlongtobeatpy library
"""

from typing import Optional, Dict, Any, List

from howlongtobeatpy import HowLongToBeat

# Use Decky's built-in logger
import decky
logger = decky.logger

# Official titles (esp. Nintendo/Switch) often use a typographic en/em dash
# ("–"/"—") instead of a plain hyphen - HLTB's search backend returns ZERO
# results for the whole query when that's present (confirmed: "Dragon Quest
# XI S: Echoes of an Elusive Age – Definitive Edition" -> no results at all,
# vs similarity 1.0 with a plain hyphen). Normalize before searching.
_DASH_CHARS = ("–", "—")


def _sanitize_query(name: str) -> str:
    for ch in _DASH_CHARS:
        name = name.replace(ch, "-")
    return name


def _entry_to_dict(entry, game_name: str) -> Dict[str, Any]:
    return {
        "game_name": game_name,
        "matched_name": entry.game_name,
        "similarity": round(entry.similarity, 2),
        "main_story": entry.main_story,
        "main_extra": entry.main_extra,
        "completionist": entry.completionist,
        "all_styles": entry.all_styles,
        "hltb_url": entry.game_web_link,
        # Doesn't change the completion-time numbers (those are per game,
        # not per platform), but helps disambiguate same-named entries
        # (e.g. "Modern Warfare 3" 2011 original vs "III" 2023 reboot) when
        # picking a manual match.
        "release_year": entry.release_world,
        "platforms": entry.profile_platforms,
    }


class HLTBService:
    def __init__(self):
        self.min_similarity = 0.7  # Minimum similarity threshold
        self._hltb = HowLongToBeat(self.min_similarity)
        # Separate instance with no similarity floor, for manual search -
        # the user visually picks the right result, so we don't want to
        # silently hide low-similarity candidates from them.
        self._hltb_unfiltered = HowLongToBeat(0.0)

    async def search_candidates(self, query: str, limit: int = 8) -> List[Dict[str, Any]]:
        """Search HLTB and return the top candidates, regardless of
        similarity, for the user to pick from manually."""
        if not query:
            return []

        try:
            search_query = _sanitize_query(query)
            results = await self._hltb_unfiltered.async_search(search_query, similarity_case_sensitive=False)
            if not results:
                return []

            results_sorted = sorted(results, key=lambda entry: -entry.similarity)[:limit]
            return [_entry_to_dict(entry, query) for entry in results_sorted]

        except Exception as e:
            logger.error(f"HLTB manual search failed for {query}: {e}")
            return []

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
                return None

        try:
            search_name = _sanitize_query(game_name)

            # Case-insensitive: ROM/non-Steam game names are often ALL CAPS
            # (e.g. Switch titles like "CHRONO TRIGGER"), which would
            # otherwise tank the similarity score against HLTB's normally
            # cased title and drop below the match threshold.
            results = await self._hltb.async_search(search_name, similarity_case_sensitive=False)
            if not results:
                return None

            best_match = max(results, key=lambda entry: entry.similarity)
            if best_match.similarity < self.min_similarity:
                return None

            logger.info(f"HLTB: {best_match.game_name} (similarity: {best_match.similarity:.2f})")

            return _entry_to_dict(best_match, game_name)

        except Exception as e:
            logger.error(f"HLTB search failed for {game_name}: {e}")
            return None
