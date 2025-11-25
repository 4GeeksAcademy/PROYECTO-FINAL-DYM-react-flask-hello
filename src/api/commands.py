import click
from api.models import db, Trainer, Pokemon, Type

"""
In this file, you can add as many commands as you want using the @app.cli.command decorator
Flask commands are usefull to run cronjobs or tasks outside of the API but sill in integration 
with youy database, for example: Import the price of bitcoin every night as 12am
"""


def setup_commands(app):
    """ 
    This is an example command "insert-test-users" that you can run from the command line
    by typing: $ flask insert-test-users 5
    Note: 5 is the number of users to add
    """

    @app.cli.command("insert-test-trainers")  # name of our command
    @click.argument("count", type=int)  # argument of out command
    def insert_test_trainers(count: int):
        click.echo(f"Creando {count} trainersss de prueba...")

        trainers = []
        for i in range(1, count + 1):
            trainer = Trainer(
                email=f"trainer{i}@test.com",
                display_name=f"Ash_{i}",
            )
            trainer.set_password("pikachu1234")
            trainers.append(trainer)

            db.session.add_all(trainers)
            db.session.commit()
            click.echo("Entrenadores creados exitosamente <3")

    @app.cli.command("insert-test-data")
    def insert_test_data():
        pass

    @app.cli.command("seed-types")
    def seed_types():
        base_types = [
            ("Normal", 1),
            ("Fuego", 1),
            ("Agua", 1),
            ("Electrico", 1),
            ("Planta", 1),
            ("Hielo", 1),
            ("Lucha", 1),
            ("Lucha", 1),
            ("Veneno", 1),
            ("Tierra", 1),
            ("Volador", 1),
            ("Psíquico", 1),
            ("Bicho", 1),
            ("Roca", 1),
            ("Fantasma", 1),
            ("Dragón", 1),
            ("Oscuro", 2),
            ("Acero", 2),
            ("Hada", 6),
        ]

        for name, generation in base_types:
            if not Type.query.filter_by(name=name).first():
                db.session.add(Type(name=name, introduced_in_generation=generation))

                db.session.commit()
                click.echo("Tipos insertados correctamente")
