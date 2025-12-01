from flask import jsonify, Blueprint

bp = Blueprint('hello', __name__)

@bp.route('/', methods=['GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend"
    }
    return jsonify(response_body), 200