from http import HTTPStatus

from flask import Blueprint, jsonify, request
from sqlalchemy import select

from api.models import Pokemon, db

bp = Blueprint("pokemon_routes", __name__, url_prefix="/pokemon")


@bp.get("/")
def list_pokemon():
    try:
        limit = min(int(request.args.get("limit", 50)), 200)
    except ValueError:
        limit = 50

    try:
        offset = max(int(request.args.get("offset", 0)), 0)
    except ValueError:
        offset = 0

    stmt = (
        select(Pokemon)
        .order_by(Pokemon.pokedex_number)
        .limit(limit)
        .offset(offset)
    )
    rows = db.session.execute(stmt).scalars().all()

    return jsonify([pokemon.serialize() for pokemon in rows])


@bp.get("/<int:pokedex_number>")
def get_pokemon(pokedex_number: int):
    pokemon = Pokemon.query.filter_by(pokedex_number=pokedex_number).first()
    if not pokemon:
        return (
            jsonify({"message": "Pokémon no encontrado"}),
            HTTPStatus.NOT_FOUND,
        )

    payload = pokemon.serialize()
    payload["types"] = [type_.serialize() for type_ in pokemon.types]
    payload["abilities"] = [ability.serialize()
                            for ability in pokemon.abilities]
    payload["moves"] = [move.serialize() for move in pokemon.moves]

    return jsonify(payload)


