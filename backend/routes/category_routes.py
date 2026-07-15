from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models import db, Category

category = Blueprint("category", __name__)

# Create Category
@category.route("/categories", methods=["POST"])
@jwt_required()
def create_category():
    data = request.get_json()

    new_category = Category(
        category_name=data["category_name"],
        description=data["description"]
    )

    db.session.add(new_category)
    db.session.commit()

    return jsonify({"message": "Category Created Successfully"}), 201


# Get All Categories
@category.route("/categories", methods=["GET"])
@jwt_required()
def get_categories():

    categories = Category.query.all()

    result = []

    for c in categories:
        result.append({
            "id": c.id,
            "category_name": c.category_name,
            "description": c.description
        })

    return jsonify(result), 200


# Update Category
@category.route("/categories/<int:id>", methods=["PUT"])
@jwt_required()
def update_category(id):

    category_data = Category.query.get_or_404(id)

    data = request.get_json()

    category_data.category_name = data["category_name"]
    category_data.description = data["description"]

    db.session.commit()

    return jsonify({"message": "Category Updated Successfully"}), 200


# Delete Category
@category.route("/categories/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_category(id):

    category_data = Category.query.get_or_404(id)

    db.session.delete(category_data)

    db.session.commit()

    return jsonify({"message": "Category Deleted Successfully"}), 200