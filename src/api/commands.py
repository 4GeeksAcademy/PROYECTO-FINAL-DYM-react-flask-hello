import click

from api.constants import base_types
from api.models import Ability, Trainer, Type, db


def setup_commands(app) -> None:


    @app.cli.command("insert-test-trainers")  # name of our command
    @click.argument("count", type=int)  # argument of out command
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

    @app.cli.command("insert-test-data")
    def insert_test_data() -> None:
        pass

    @app.cli.command("seed-types")
    def seed_types() -> None:
        created = 0

        for name, generation in base_types:
            if Type.query.filter_by(name=name).first():
                continue

            db.session.add(
                Type(name=name, introduced_in_generation=generation)
            )
            created += 1

        if created > 0:
            db.session.commit()
            click.echo(f" {created} types inserted.")
        else:
            click.echo("No new types inserted (already exist).")

        
    @app.cli.command("seed-abilities")
    def seed_abilities() -> None:
        sample_abilities = [
            {
                "name": "Overgrow",
                "short_effect": "Boosts Grass-type moves when HP is low.",
                "effect": (
                    "When HP is below 1/3, the Pokemon's Grass-type moves "
                    "do 1.5 damage."
                ),
                "is_hidden_default": False,
            },
        ]

        created = 0
        for data in sample_abilities:
            if Ability.query.filter_by(name=data["name"]).first():
                continue

            db.session.add(Ability(**data))
            created += 1

            if created > 0:
                db.session.commit()
                click.echo(f"{created} abilities inserted.")
            else:
                click.echo("No new abilities inserted (already exist).")

