from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, Trainer, Pokemon
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required


api_bp = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api_bp)


@api_bp.route('/register', methods=['POST'])
def handle_register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        raise APIException("Email and password are required", status_code=400)
    if Trainer.query.filter_by(email=email).first():
        raise APIException("Email already registered", status_code=400)
    new_trainer = Trainer(email=email)
    new_trainer.set_password(password)
    db.session.add(new_trainer)
    db.session.commit()

    return jsonify({"msg": "User registered successfully"}), 200


@api_bp.route('/login', methods=['POST'])
def handle_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        raise APIException("Email and password are required", status_code=400)

    trainer = Trainer.query.filter_by(email=email).first()
    if not trainer or not trainer.check_password(password):
        raise APIException("Invalid email or password", status_code=401)

    token = create_access_token(identity=str(trainer.id))

    return jsonify({"msg": "Login successful", "token": token}), 200

def _get_trainer_or_404(trainer_id: int) -> Trainer:
    trainer = Trainer.query.get(trainer_id)
    if not trainer:
        raise APIException("Trainer not found", status_code=404)
    return trainer

def _get_pokemon_or_404(pokemon_id: int) -> Pokemon:
    pokemon = Pokemon.query.get(pokemon_id)
    if not pokemon:
        raise APIException("Pokemon not found", status_code=404)
    return pokemon

def _serialize_pokemon(pokemon):
    if hasattr(pokemon, "serialize") and callable(getattr(pokemon, "serialize")):
        return pokemon.serialize()
    return {"id": getattr(pokemon, "id", None), "name": getattr(pokemon, "name", None)}


@api_bp.route('/trainers/<int:trainer_id>/favorites', methods=['GET'])
def list_favorites(trainer_id: int):
    trainer = _get_trainer_or_404(trainer_id)

    if not hasattr(trainer, "favorites"):
        raise APIException("Trainer has no favorites relationship", status_code=500)
    

    favs = [ _serialize_pokemon(p) for p in trainer.favorites ]
    return jsonify({"trainer_id": trainer.id, "favorites": favs}), 200


@api_bp.route("/trainers/<int:trainer_id>/favorites", methods=["POST"])
def add_favorite(trainer_id: int):
    data = request.get_json() or {}
    pokemon_id = data.get("pokemon_id")
    if not pokemon_id:
        raise APIException("pokemon_id is required, status_code=400")
    
    trainer = _get_trainer_or_404(trainer_id)
    if not hasattr(trainer, "favorites"):
        raise APIException("Trainer has no favorites relationship", status_code=500)

    pokemon = _get_pokemon_or_404(pokemon_id)

    if pokemon in trainer.favorites: 
        return jsonify({"msg": "Pokemon already in your favorites", "pokemon": _serialize_pokemon(pokemon)}), 200

    trainer.favorites.append(pokemon)
    db.session.commit()
    return jsonify({"msg": "Pokémon added to favorites", "pokemon": _serialize_pokemon(pokemon)}), 201


@api_bp.route("/trainers/<int:trainer_id>/favorites/<int:pokemon_id>", methods=["DELETE"])
def remove_favorite(trainer_id: int, pokemon_id: int):
    trainer = _get_trainer_or_404(trainer_id)
    if not hasattr(trainer, "favorites"):
        raise APIException("Trainer has no favorites relationship", status_code=500)
    
    
    pokemon = _get_pokemon_or_404(pokemon_id)

    if pokemon not in trainer.favorites:
        raise APIException("Pokemon not in your favorites", status_code=404)
    
    trainer.favorites.remove(pokemon)
    db.session.commit()
    return jsonify({"msg": "Pokémon removed from favorites", "pokemon_id": pokemon_id}), 200

