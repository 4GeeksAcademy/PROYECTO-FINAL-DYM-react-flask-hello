from datetime import datetime, timedelta, timezone
from functools import wraps
from typing import Any, Callable, TypeVar, cast

import jwt

from flask import current_app, jsonify, request

from api.models import Trainer
from .ctx import clear_current_trainer, current_trainer, set_current_trainer

F = TypeVar("F", bound=Callable[..., Any])


def create_access_token(trainer: Trainer, expires_in_minutes: int = 60) -> str:
    payload = {
        "sub": trainer.id,
        "exp": datetime.now(tz=timezone.utc) + timedelta(minutes=expires_in_minutes),
        "iat": datetime.now(tz=timezone.utc),
    }
    secret = current_app.config["JWT_SECRET_KEY"]
    algorithm = current_app.config.get("JWT_ALGORITHM", "HS256")
    return jwt.encode(payload, secret, algorithm=algorithm)


def decode_access_token(token: str) -> Trainer | None:
    secret = current_app.config["JWT_SECRET_KEY"]
    algorithm = current_app.config.get("JWT_ALGORITHM", "HS256")

    try:
        decoded = jwt.decode(token, secret, algorithms=[algorithm])
    except jwt.PyJWTError:
        return None

    trainer_id = decoded.get("sub")
    if not trainer_id:
        return None

    return Trainer.query.get(trainer_id)


def login_required(fn: F) -> F:

    @wraps(fn)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get("Autorization", "")
        token = auth_header.replace("Bearer ", "").strip()

        if not token:
            return jsonify({"message": "Token faltante"}), 401

        trainer = decode_access_token(token)
        if not trainer:
            return jsonify({"message": "Token inválido o expirado"}), 401

        set_current_trainer(trainer)
        try:
            return fn(*args, **kwargs)
        finally:
            clear_current_trainer()

    return cast(F, wrapper)
