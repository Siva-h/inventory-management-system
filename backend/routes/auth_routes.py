from datetime import timedelta
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from models import User

auth = Blueprint("auth", __name__)

@auth.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

    user = User.query.filter_by(username=username).first()

    if not user:
        return jsonify({"message": "Invalid Username"}), 401

    if user.password != password:
        return jsonify({"message": "Invalid Password"}), 401

    access_token = create_access_token(
        identity=user.username,
        expires_delta=timedelta(hours=12)
    )

    return jsonify({
        "access_token": access_token,
        "message": "Login Successful"
    }), 200