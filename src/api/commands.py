
import click
from api.models import db, Trainer

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
        print(f"Creando {count} trainersss de prueba...")

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
            print("Entrenadores creados exitosamente <3")

    @app.cli.command("insert-test-data")
    def insert_test_data():
        pass
