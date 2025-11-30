from __future__ import annotations

from typing import Any, Dict, List

import requests

BASE_URL = "https://pokeapi.co/api/v2"


def fetch_json(path: str, params: Dict[str, Any] | None = None) -> Dict[str, Any]:
    resp = requests.get(f"{BASE_URL}{path}", params=params, timeout=30)
    resp.raise_for_status()
    return resp.json()


def fetch_type_list() -> List[Dict[str, Any]]:
    data = fetch_json("/type?limit=999")
    return data["results"]


def fetch_pokemon_list(limit: int = 151, offset: int = 0) -> List[Dict[str, Any]]:
    data = fetch_json("/pokemon", params={"limit": limit, "offset": offset})
    return data["results"]


def fetch_pokemon_detail(name_or_id: str | int) -> Dict[str, Any]:
    return fetch_json(f"/pokemon/{name_or_id}")


def fetch_ability_detail(name_or_id: str | int) -> Dict[str, Any]:
    return fetch_json(f"/ability/{name_or_id}")


def fetch_move_list(limit: int = 200, offset: int = 0) -> List[Dict[str, Any]]:
    data = fetch_json("/move", params={"limit": limit, "offset": offset})
    return data["results"]


def fetch_move_detail(name_or_id: str | int) -> Dict[str, Any]:
    return fetch_json(f"/move/{name_or_id}")

