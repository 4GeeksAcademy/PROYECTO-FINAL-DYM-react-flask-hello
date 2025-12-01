from http import HTTPStatus

from flask import Blueprint, jsonify, request

from api.models import Trainer, db
from api.utils.auth import create_access_token, login_required

from api.utils.ctx import current_trainer

bp = Blueprint("auth", __name__, url_prefix="")


@bp.post("/register")
def register_trainer():
    payload = request.get_json(silent=True) or {}

    email: str | None = payload.get("email")
    password: str | None = payload.get("password")
    display_name: str | None = payload.get("display_name")

    if not email or not password or not display_name:
        return (
            jsonify({"message": "email, password y display_name son obligatorios"}),
            HTTPStatus.BAD_REQUEST,
        )

    if Trainer.query.filter_by(email=email).first():
        return jsonify({"message": "Ese email ya está registrado"}), HTTPStatus.CONFLICT

    trainer = Trainer(email=email, display_name=display_name)
    trainer.set_password(password)

    db.session.add(trainer)
    db.session.commit()

    access_token = create_access_token(trainer)

    return (
        jsonify(
            {
                "trainer": trainer.serialize(),
                "access_token": access_token,
            }
        ),
        HTTPStatus.CREATED,
    )


@bp.post("/login")
def login_trainer():

    payload = request.get_json(silent=True) or {}

    email: str | None = payload.get("email")
    password: str | None = payload.get("password")

    if not email or not password:
        return (
            jsonify({"message": "email y password son obligatorios"}),
            HTTPStatus.BAD_REQUEST,
        )

    trainer = Trainer.query.filter_by(email=email).first()
    if not trainer or not trainer.check_password(password):
        return jsonify({"message": "Credenciales inválidas"}), HTTPStatus.UNAUTHORIZED

    access_token = create_access_token(Trainer)
    return jsonify({"trainer": trainer.serialize(), "access_token": access_token})


@bp.get("/me")
@login_required
def me():
    trainer = current_trainer()
    return jsonify({"trainer": trainer.serialize()})
