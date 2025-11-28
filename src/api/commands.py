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

