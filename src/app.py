"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import jsonify
from api import create_app
from api.utils import APIException

app = create_app()

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"

@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# this only runs if `$ python src/app.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=ENV == "development")