import time
from typing import Dict

import click

from api.models import Ability, Pokemon, Trainer, Type, db
from api.services.pokeapi import (
    fetch_ability_detail,
    fetch_pokemon_detail,
    fetch_pokemon_list,
    fetch_type_list,
)


def setup_commands(app) -> None:
    @app.cli.command("insert-test-trainers")
    @click.argument("count", type=int)
    def insert_test_trainers(count: int) -> None:
        click.echo(f"Creating {count} trainers tests...")

        trainers: list[Trainer] = []
        for i in range(1, count + 1):
            trainer = Trainer(
                email=f"trainer{i}@test.com",
                display_name=f"Ash_{i}",
            )
            trainer.set_password("pikachu1234")
            trainers.append(trainer)

            db.session.add_all(trainers)
            db.session.commit()
            click.echo("Trainers created successfully <3")

    @app.cli.command("sync_types")
    def sync_types() -> None:
        click.echo("Syncing types from pokeAPI <3...")
        count = 0
        for entry in fetch_type_list():
            name = entry["name"]
            if name in {"shadow", "unknown"}:
                continue

            type_obj = Type.query.filter_by(name=name).first()
            if not type_obj:
                type_obj = Type(name=name, introduced_in_generation=1)
                db.session.add(type_obj)
                count += 1

                if count:
                    db.session.commit()
                click.echo(f"Types sync complete. Inserted {count} nwe types <3.")

    
    @app.cli.command("sync-pokemon")
    @click.argument("limit", type=int, default=151)
    def sync_pokemon(limit: int) -> None:
        click.echo(f"Syncing first {limit} Pokemon from PokeAPI...")

        ability_cache: Dict[str, Ability] = {}
        processed = 0

        for entry in fetch_pokemon_list(limit=limit):
            detail = fetch_pokemon_detail(entry["name"])

            pokemon = Pokemon.query.filter_by(pokedex_number=detail["id"]).first()
            if not pokemon:
                pokemon = Pokemon(
                    pokedex_number=detail["id"],
                    name=detail["name"],
                    height=detail["height"] / 10,
                    weight=detail["weight"] / 10,
                )
                db.session.add(pokemon)
            else:
                pokemon.name = detail["name"]
                pokemon.height = detail["height"] / 10
                pokemon.weight = detail["weight"] / 10

            pokemon.types.clear()
            for type_slot in detail["types"]:
                type_name = type_slot["type"]["name"]
                type_obj = Type.query.filter_by(name=type_name).first()
                if not type_obj:
                    type_obj = Type(name=type_name, introduced_in_generation=1)
                    db.session.add(type_obj)
                pokemon.types.append(type_obj)

            pokemon.abilities.clear()
            for ability_slot in detail["abilities"]:
                ability_name = ability_slot["ability"]["name"]

                ability_obj = ability_cache.get(ability_name)
                if not ability_obj:
                    ability_obj = Ability.query.filter_by(name=ability_name).first()

                if not ability_obj:
                    ability_data = fetch_ability_detail(ability_name)
                    short_effect = next(
                        (
                            entry["effect"]
                            for entry in ability_data["effect_entries"]
                            if entry["language"]["name"] == "en"
                        ),
                        None,
                    )

                    ability_obj = Ability(
                        name=ability_name,
                        short_effect=short_effect,
                        effect=long_effect, is_hidded_default=ability_slot["is_hidden"],
                    )
                    db.session.add(ability_obj)

                ability_cache[ability_name] = ability_obj
                pokemon.abilities.append(ability_obj)

            processed += 1
            time.sleep(0.2)

        db.session.commit()
        click.echo(f"Pokemon sunc complete. Processed {processed} entries.")

