from __future__ import annotations

from typing import Any, Dict, Iterable, List, Optional

import click
from sqlalchemy import select

from .models import (
    Ability,
    Move,
    Pokemon,
    Trainer,
    Type,
    db,
    pokemon_ability,
    pokemon_move,
    pokemon_type
)

from api.services import pokeapi


GENERATION_MAP = {
    "generation-i": 1,
    "generation-ii": 2,
    "generation-iii": 3,
    "generation-iv": 4,
    "generation-v": 5,
    "generation-vi": 6,
    "generation-vii": 7,
    "generation-viii": 8,
    "generation-ix": 9,
}


def _roman_generation(generation_name: Optional[str]) -> Optional[int]:
    if not generation_name:
        return None
    generation_name = generation_name.lower()
    return GENERATION_MAP.get(generation_name)


def _extract_english_effect(effect_entries: Iterable[Dict[str, Any]]) -> Dict[str, Optional[str]]:
    english = next(
        (entry for entry in effect_entries if entry.get(
            "language", {}).get("name") == "en"),
        {},
    )

    return {
        "effect": english.get("effect"),
        "short_effect": english.get("short_effect"),
    }


def _get_or_create_type(name: str, introduced_in_generation: Optional[int]) -> Type:
    type_obj = Type.query.filter_by(name=name).first()
    if not type_obj:
        type_obj = Type(
            name=name, introduced_in_generation=introduced_in_generation)
        db.session.add(type_obj)
    else:
        if introduced_in_generation and type_obj.introduced_in_generation != introduced_in_generation:
            type_obj.introduced_in_generation = introduced_in_generation
    return type_obj


def _get_or_create_ability(name: str) -> Ability:
    ability = Ability.query.filter_by(name=name).first()
    if ability:
        return ability

    detail = pokeapi.fetch_ability_detail(name)
    english = _extract_english_effect(detail.get("effect_entries", []))

    ability = Ability(
        name=detail["name"],
        short_effect=english["short_effect"],
        effect=english["effect"],
        is_hidden_default=False,
    )
    db.session.add(ability)
    return ability


def _get_or_create_move(name: str) -> Move:
    move = Move.query.filter_by(name=name).first()
    if move:
        return move

    detail = pokeapi.fetch_move_detail(name)
    english = _extract_english_effect(detail.get("effect_entries", []))

    move = Move(
        name=detail["name"],
        accuracy=detail.get("accuracy"),
        power=detail.get("power"),
        pp=detail.get("pp"),
        priority=detail.get("priority"),
        damaged_class=detail.get("damage_class", {}).get("name"),
        type_name=detail.get("type", {}).get("name"),
        short_effect=english["short_effect"],
        effect=english["effect"],
    )
    db.session.add(move)
    return move


def setup_commands(app) -> None:
    @app.cli.command("insert-test-trainers")  # name of our command
    @click.argument("count", type=int)  # argument of out command
    def insert_test_trainers(count: int) -> None:
        click.echo(f"Creating {count} trainers tests...")
        trainers: List[Trainer] = []
        for i in range(1, count + 1):
            trainer = Trainer(
                email=f"trainer{i}@test.com",
                display_name=f"Ash_{i}",
            )
            trainer.set_password("pikachu1234")
            trainers.append(trainer)

        db.session.add_all(trainers)
        db.session.commit()
        click.echo("Entrenadores creados correctamente <3")

    @app.cli.command("sync-types")
    def sync_types() -> None:
        click.echo("Sincronizando tipos desde PokeAPI...")
        results = pokeapi.fetch_type_list()

        created = 0
        for result in results:
            name = result["name"]
            detail = pokeapi.fetch_json(f"/type/{name}")
            generation_name = detail.get("generation", {}).get("name")
            generation_number = _roman_generation(generation_name)

            type_obj = Type.query.filter_by(name=name).first()
            if not type_obj:
                type_obj = Type(
                    name=name,
                    introduced_in_generation=generation_number,
                )
                db.session.add(type_obj)
                created += 1
            else:
                if generation_number and type_obj.introduced_in_generation != generation_number:
                    type_obj.introduced_in_generation = generation_number
        db.session.commit()
        click.echo(
            f"Sincronización de tipos completada. Creados {created}, el total ahora es {Type.query.count()}.")

    @app.cli.command("sync-abilities")
    @click.option("--limit", default=200, help="Número máximo de habilidades.")
    @click.option("--offset", default=0, help="Offset de sincronización de habilidades.")
    def sync_abilities(limit: int, offset: int) -> None:
        click.echo(
            f"Sincronizando Habilidades desde PokeAPI (limit {limit}, offset {offset})...")
        listing = pokeapi.fetch_json(
            "/ability",
            params={"limit": limit, "offset": offset},
        )

        created = 0
        for item in listing.get("results", []):
            name = item["name"]
            ability = Ability.query.filter_by(name=name).first()
            if ability:
                continue

            ability = _get_or_create_ability(name)
            created += 1

        db.session.commit()
        click.echo(
            f"Sincronización de Habilidades completada. Creada {created}, el total ahora es {Ability.query.count()}.")

    @app.cli.command("sync-moves")
    @click.option("--limit", default=200, help="How many moves to sync.")
    @click.option("--offset", default=0, help="Offset for moves.")
    def sync_moves(limit: int, offset: int) -> None:
        click.echo(
            f"Sincronizando Movimientos desde PokeAPI (limit {limit}, offset {offset})...")
        listing = pokeapi.fetch_move_list(limit=limit, offset=offset)

        created = 0
        for item in listing:
            name = item["name"]
            move = Move.query.filter_by(name=name).first()
            if move:
                continue

            move = _get_or_create_move(name)
            created += 1

        db.session.commit()
        click.echo(
            f"Sincronización de Movimientos completada. Creados {created}, el total ahora es {Move.query.count()}.")

    @app.cli.command("sync-pokemon")
    @click.option("--limit", default=151, help="How many Pokémon to sync.")
    @click.option("--offset", default=0, help="Offset for Pokémon listing.")
    def sync_pokemon(limit: int, offset: int) -> None:
        click.echo(
            f"Sincronizanco Pokémons desde PokeAPI (limit {limit}, offset {offset})...")

        listing = pokeapi.fetch_pokemon_list(limit=limit, offset=offset)
        processed = 0
        created = 0

        for item in listing:
            name = item["name"]
            detail = pokeapi.fetch_pokemon_detail(name)

            pokedex_number = detail["id"]
            pokemon = Pokemon.query.filter_by(
                pokedex_number=pokedex_number).first()
            if not pokemon:
                pokemon = Pokemon(
                    pokedex_number=pokedex_number,
                )
                db.session.add(pokemon)
                created += 1

            pokemon.name = detail["name"]
            pokemon.height = detail.get(
                "height") / 10 if detail.get("height") else None
            pokemon.weight = detail.get(
                "weight") / 10 if detail.get("weight") else None

            type_objects: List[Type] = []
            for type_slot in detail.get("types", []):
                type_name = type_slot["type"]["name"]
                type_detail = pokeapi.fetch_json(f"/type/{type_name}")
                generation_number = _roman_generation(
                    type_detail.get("generation", {}).get("name"))
                type_obj = _get_or_create_type(type_name, generation_number)
                type_objects = type_objects

                ability_objects: List[Ability] = []
                for ability_slot in detail.get("abilities", []):
                    ability_name = ability_slot["ability"]["name"]
                    ability_obj = _get_or_create_ability(ability_name)
                    ability_objects.append(ability_obj)
                pokemon.abilities = ability_objects

                move_objects: List[Move] = []
                for move_slot in detail.get("moves", []):
                    move_name = move_slot["move"]["name"]
                    move_obj = _get_or_create_move(move_name)
                    move_objects.append(move_obj)
                pokemon.moves = move_objects

                processed += 1
                if processed % 25 == 0:
                    click.echo(f"  -> Processed {processed} Pokémon...")
                    db.session.commit()
                    click.echo(
                        f"Sincronización de Pokémon completada. Procesados {processed}, creados {created}, total ahora {Pokemon.query.count()}.")
