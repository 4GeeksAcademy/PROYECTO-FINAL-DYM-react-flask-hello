from __future__ import annotations

from datetime import datetime, timedelta

from flask import current_app
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
from sqlalchemy import Boolean, DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from werkzeug.security import generate_password_hash, check_password_hash

from . import db


class Trainer(db.Model):
    __tablename__ = "trainer"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(225), nullable=False)
    display_name: Mapped[str] = mapped_column(String(60), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    reset_token: Mapped[str | None] = mapped_column(String(255))
    reset_token_expires_at: Mapped[datetime | None ] = mapped_column(DateTime)

    def set_password(self, raw_password: str) -> None:
        self.password_hash = generate_password_hash(raw_password)

    def check_password(self, raw_password: str) -> bool:
        return check_password_hash(self.password_hash, raw_password)
    
    def generate_reset_token(self, expires_in_seconds: int = 3600) -> str:
        serializer = URLSafeTimedSerializer(current_app.config["SECRET_KEY"])
        token = serializer.dumps({"trainer_id": self.id})
        self.reset_token = token
        self.reset_token_expires_at = datetime.utcnow() + timedelta(seconds=expires_in_seconds)
        return token

    @staticmethod
    def verify_reset_token(token: str, max_age_seconds: int = 3600) -> "Trainer | None":
        serializer = URLSafeTimedSerializer(current_app.config["SECRET_KEY"])
        try:
            data = serializer.loads(token, max_age=max_age_seconds)
        except (BadSignature, SignatureExpired): 
            return None
        return Trainer.query.get(data["trainer_id"])
    
    def clear_reset_token(self) -> None:
        self.reset_token = None
        self.reset_token_expires_at = None

    def __repr__(self) -> str:
        return f"<Trainer id={self.id} email='{self.email}' display_name='{self.display_name}'>"

    def serialize(self) -> dict:
        return {
            "id": self.id,
            "email": self.email,
            "display_name": self.display_name,
        }
