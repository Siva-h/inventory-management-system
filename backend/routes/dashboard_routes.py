from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from models import Category, Product

dashboard = Blueprint("dashboard", __name__)

@dashboard.route("/dashboard", methods=["GET"])
@jwt_required()
def dashboard_data():

    total_categories = Category.query.count()
    total_products = Product.query.count()
    low_stock = Product.query.filter(Product.quantity < 10).count()

    return jsonify({
        "total_categories": total_categories,
        "total_products": total_products,
        "low_stock": low_stock
    }), 200