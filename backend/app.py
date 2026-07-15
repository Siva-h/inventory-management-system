from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import Config
from models import db

from routes.auth_routes import auth
from routes.category_routes import category
from routes.product_routes import product
from routes.dashboard_routes import dashboard

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)
db.init_app(app)
jwt = JWTManager(app)

# -------- JWT Debug Handlers --------

@jwt.invalid_token_loader
def invalid_token_callback(error):
    print("INVALID TOKEN:", error)
    return {"message": error}, 401

@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    print("TOKEN EXPIRED")
    return {"message": "Token expired"}, 401

@jwt.unauthorized_loader
def missing_token_callback(error):
    print("MISSING TOKEN:", error)
    return {"message": error}, 401

# -----------------------------------

app.register_blueprint(auth)
app.register_blueprint(category)
app.register_blueprint(product)
app.register_blueprint(dashboard)
with app.app_context():
    db.create_all()

@app.route("/")
def home():
    return {"message": "Inventory Management System API is Running Successfully!"}

if __name__ == "__main__":
    app.run(debug=True)