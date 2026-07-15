from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models import db, Product, Category
product = Blueprint("product", __name__)
@product.route("/products", methods=["POST"])
@jwt_required()
def create_product():

    data = request.get_json()

    category = Category.query.get(data["category_id"])

    if not category:
        return jsonify({"message": "Category Not Found"}), 404

    new_product = Product(
        product_name=data["product_name"],
        sku=data["sku"],
        category_id=data["category_id"],
        unit_price=data["unit_price"],
        quantity=data["quantity"],
        status=data["status"]
    )

    db.session.add(new_product)
    db.session.commit()

    return jsonify({"message": "Product Created Successfully"}), 201
@product.route("/products", methods=["GET"])
@jwt_required()
def get_products():

    search = request.args.get("search")
    category = request.args.get("category")
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 5, type=int)

    query = Product.query

    if search:
        query = query.filter(Product.product_name.ilike(f"%{search}%"))

    if category:
        query = query.join(Category).filter(Category.category_name == category)

    pagination = query.paginate(page=page, per_page=per_page, error_out=False)

    product_list = []

    for product in pagination.items:
        product_list.append({
            "id": product.id,
            "product_name": product.product_name,
            "sku": product.sku,
            "category": product.category.category_name,
            "unit_price": product.unit_price,
            "quantity": product.quantity,
            "status": product.status,
            "low_stock": product.quantity < 10
        })

    return jsonify({
        "page": page,
        "total_pages": pagination.pages,
        "total_products": pagination.total,
        "products": product_list
    }), 200
@product.route("/products/<int:id>", methods=["PUT"])
@jwt_required()
def update_product(id):

    product = Product.query.get(id)

    if not product:
        return jsonify({"message": "Product Not Found"}), 404

    data = request.get_json()

    category = Category.query.get(data["category_id"])

    if not category:
        return jsonify({"message": "Category Not Found"}), 404

    product.product_name = data["product_name"]
    product.sku = data["sku"]
    product.category_id = data["category_id"]
    product.unit_price = data["unit_price"]
    product.quantity = data["quantity"]
    product.status = data["status"]

    db.session.commit()

    return jsonify({"message": "Product Updated Successfully"}), 200
@product.route("/products/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_product(id):

    product = Product.query.get(id)

    if not product:
        return jsonify({"message": "Product Not Found"}), 404

    db.session.delete(product)
    db.session.commit()

    return jsonify({"message": "Product Deleted Successfully"}), 200