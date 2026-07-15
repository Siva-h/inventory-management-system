import { useEffect, useState } from "react";
import api from "../services/api";

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
const [search, setSearch] = useState("");
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
  const [productName, setProductName] = useState("");
  const [sku, setSku] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [status, setStatus] = useState("Available");

  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

 useEffect(() => {
  getCategories();
}, []);

useEffect(() => {
  getProducts();
}, [search, page]);

  const getCategories = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCategories(response.data);
    } catch (error) {
      console.log(error);
      alert("Failed to Load Categories");
    }
  };

  const getProducts = async () => {
    try {
      const token = localStorage.getItem("token");

    const response = await api.get(
  `/products?search=${search}&page=${page}&per_page=5`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      setProducts(response.data.products);
setTotalPages(response.data.total_pages);
    } catch (error) {
      console.log(error);
      alert("Failed to Load Products");
    }
  };

  const createProduct = async () => {
    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/products",
        {
          product_name: productName,
          sku: sku,
          category_id: Number(categoryId),
          unit_price: Number(unitPrice),
          quantity: Number(quantity),
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Product Created Successfully");

      clearForm();
      getProducts();

    } catch (error) {
      console.log(error);
      alert("Failed to Create Product");
    }
  };

 const deleteProduct = async (id) => {

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this product?"
  );

  if (!confirmDelete) return;

  try {
    const token = localStorage.getItem("token");

    await api.delete(`/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    alert("Product Deleted Successfully");

    getProducts();

  } catch (error) {
    console.log(error);
    alert("Failed to Delete Product");
  }
};

  const editProduct = (product) => {
    setIsEdit(true);
    setEditId(product.id);

    setProductName(product.product_name);
    setSku(product.sku);

    const selectedCategory = categories.find(
      (c) => c.category_name === product.category
    );

    if (selectedCategory) {
      setCategoryId(selectedCategory.id);
    }

    setUnitPrice(product.unit_price);
    setQuantity(product.quantity);
    setStatus(product.status);
  };

  const updateProduct = async () => {
    try {
      const token = localStorage.getItem("token");

      await api.put(
        `/products/${editId}`,
        {
          product_name: productName,
          sku: sku,
          category_id: Number(categoryId),
          unit_price: Number(unitPrice),
          quantity: Number(quantity),
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Product Updated Successfully");

      setIsEdit(false);
      setEditId(null);

      clearForm();
      getProducts();

    } catch (error) {
      console.log(error);
      alert("Failed to Update Product");
    }
  };

  const clearForm = () => {
    setProductName("");
    setSku("");
    setCategoryId("");
    setUnitPrice("");
    setQuantity("");
    setStatus("Available");
  };
    return (
    <div className="container mt-4">

      <h2 className="mb-4">Product Management</h2>
      <div className="mb-4">
  <input
    type="text"
    className="form-control"
    placeholder="Search Product..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
</div>

      <div className="card shadow p-4 mb-4">

        <div className="mb-3">
          <label className="form-label">Product Name</label>
          <input
            type="text"
            className="form-control"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">SKU</label>
          <input
            type="text"
            className="form-control"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Category</label>
          <select
            className="form-control"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Select Category</option>

            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.category_name}
              </option>
            ))}

          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Unit Price</label>
          <input
            type="number"
            className="form-control"
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Quantity</label>
          <input
            type="number"
            className="form-control"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Status</label>

          <select
            className="form-control"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option>Available</option>
            <option>Out of Stock</option>
          </select>
        </div>

        <button
          className={`btn ${isEdit ? "btn-warning" : "btn-success"}`}
          onClick={isEdit ? updateProduct : createProduct}
        >
          {isEdit ? "Update Product" : "Add Product"}
        </button>

      </div>

      <table className="table table-bordered table-hover">

        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Product</th>
            <th>SKU</th>
            <th>Category</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Low Stock</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.product_name}</td>
                <td>{product.sku}</td>
                <td>{product.category}</td>
                <td>{product.unit_price}</td>
                <td>{product.quantity}</td>
                <td>{product.status}</td>
                <td>{product.low_stock ? "Yes" : "No"}</td>

                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => editProduct(product)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteProduct(product.id)}
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center">
                No Products Found
              </td>
            </tr>
          )}

        </tbody>

      </table>
 <div className="d-flex justify-content-center mt-4">

        <button
          className="btn btn-secondary me-2"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>

        <span className="mt-2">
          Page {page} of {totalPages}
        </span>

        <button
          className="btn btn-secondary ms-2"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>

      </div>

    </div>
  );
}

export default Products;