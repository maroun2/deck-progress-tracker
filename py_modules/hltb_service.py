"""
HowLongToBeat Service
Fetches game completion times from HowLongToBeat via the howlongtobeatpy library
"""

from typing import Optional, Dict, Any

from howlongtobeatpy import HowLongToBeat

# Use Decky's built-in logger
import decky
logger = decky.logger


class HLTBService:
    def __init__(self):
        self.min_similarity = 0.7  # Minimum similarity threshold
        self._hltb = HowLongToBeat(self.min_similarity)

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
            results = await self._hltb.async_search(game_name)
            if not results:
                return None

            best_match = max(results, key=lambda entry: entry.similarity)
            if best_match.similarity < self.min_similarity:
                return None

            logger.info(f"HLTB: {best_match.game_name} (similarity: {best_match.similarity:.2f})")

            return {
                "game_name": game_name,
                "matched_name": best_match.game_name,
                "similarity": round(best_match.similarity, 2),
                "main_story": best_match.main_story,
                "main_extra": best_match.main_extra,
                "completionist": best_match.completionist,
                "all_styles": best_match.all_styles,
                "hltb_url": best_match.game_web_link,
            }

        except Exception as e:
            logger.error(f"HLTB search failed for {game_name}: {e}")
            return None
