from http import HTTPStatus

from flask import Blueprint, jsonify, request

from api.models import Favorite, Pokemon, db
from api.utils.auth import login_required
from api.utils.ctx import current_trainer

bp = Blueprint("favorites", __name__, url_prefix="/favorites")


@bp.get("/")
@login_required
def list_favorites():
    favorites = Favorite.query.filter_by(trainer_id=current_trainer().id).all()
    return jsonify([favorite.serialize() for favorite in favorites])


@bp.post("/")
@login_required
def create_favorite():
    payload = request.get_json(silent=True) or {}

    pokemon_id = payload.get("pokemon_id")
    nickname = payload.get("nickname")

    if not pokemon_id:
        return (
            jsonify({"message": "pokemon_id es obligatorio"}),
            HTTPStatus.BAD_REQUEST,
        )

    pokemon = Pokemon.query.get(pokemon_id)
    if not pokemon:
        return (
            jsonify({"message": "Pokémon no encontrado"}),
            HTTPStatus.NOT_FOUND,
        )

    existing = Favorite.query.filter_by(
        trainer_id=current_trainer().id,
        pokemon_id=pokemon_id,
    ).first()
    if existing:
        return (
            jsonify({"message": "Este Pokémon ya está en tus favoritos"}),
            HTTPStatus.CONFLICT,
        )

    favorite = Favorite(
        trainer_id=current_trainer().id,
        pokemon_id=pokemon_id,
        nickname=nickname,
    )
    db.session.add(favorite)
    db.session.commit()

    return jsonify(favorite.serialize()), HTTPStatus.CREATED


@bp.patch("/<int:favorite_id>")
@login_required
def update_favorite(favorite_id: int):
    favorite = Favorite.query.filter_by(
        id=favorite_id,
        trainer_id=current_trainer().id,
    ).first()

    if not favorite:
        return (
            jsonify({"message": "Favorite no encontrado"}),
            HTTPStatus.NOT_FOUND,
        )

    payload = request.get_json(silent=True) or {}
    if "nickname" in payload:
        favorite.nickname = payload["nickname"]

    db.session.commit()
    return jsonify(favorite.serialize())


@bp.delete("/<int:favorite_id>")
@login_required
def delete_favorite(favorite_id: int):
    favorite = Favorite.query.filter_by(
        id=favorite_id,
        trainer_id=current_trainer().id,
    ).first()

    if not favorite:
        return (
            jsonify({"message": "Favorite no encontrado"}),
            HTTPStatus.NOT_FOUND,
        )

    db.session.delete(favorite)
    db.session.commit()
    return jsonify({"message": "Favorite eliminado"})
