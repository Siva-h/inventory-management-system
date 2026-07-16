import { useEffect, useState } from "react";
import api from "../services/api";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");

  const [editId, setEditId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    getCategories();
  }, []);

  // Get Categories
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
      alert("Failed to load categories");
    }
  };

  // Create Category
  const createCategory = async () => {
    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/categories",
        {
          category_name: categoryName,
          description: description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Category Created Successfully");

      setCategoryName("");
      setDescription("");

      getCategories();

    } catch (error) {
      console.log(error);
      alert("Failed to Create Category");
    }
  };

  // Edit Category
  const editCategory = (category) => {
    setCategoryName(category.category_name);
    setDescription(category.description);
    setEditId(category.id);
    setIsEditing(true);
  };

  // Update Category
  const updateCategory = async () => {
    try {
      const token = localStorage.getItem("token");

      await api.put(
        `/categories/${editId}`,
        {
          category_name: categoryName,
          description: description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Category Updated Successfully");

      setCategoryName("");
      setDescription("");
      setEditId(null);
      setIsEditing(false);

      getCategories();

    } catch (error) {
      console.log(error);
      alert("Failed to Update Category");
    }
  };

  // Delete Category
  const deleteCategory = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await api.delete(`/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Category Deleted Successfully");

      getCategories();

    } catch (error) {
  console.log(error);

  if (error.response) {
    alert(error.response.data.message);
  } else {
    alert("Failed to Delete Category");
  }
}
  }

  return (
    <div className="container mt-4">

      <h2 className="mb-4">Category Management</h2>

      <div className="card shadow p-4 mb-4">

        <div className="mb-3">
          <label className="form-label">Category Name</label>

          <input
            type="text"
            className="form-control"
            placeholder="Enter Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />

        </div>

        <div className="mb-3">

          <label className="form-label">Description</label>

          <input
            type="text"
            className="form-control"
            placeholder="Enter Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

        </div>

        <button
          className={`btn ${isEditing ? "btn-warning" : "btn-success"}`}
          onClick={isEditing ? updateCategory : createCategory}
        >
          {isEditing ? "Update Category" : "Add Category"}
        </button>

      </div>

      <table className="table table-bordered table-hover">

        <thead className="table-dark">

          <tr>
            <th>ID</th>
            <th>Category Name</th>
            <th>Description</th>
            <th width="180">Actions</th>
          </tr>

        </thead>

        <tbody>

          {categories.length > 0 ? (
            categories.map((category) => (
              <tr key={category.id}>

                <td>{category.id}</td>
                <td>{category.category_name}</td>
                <td>{category.description}</td>

                <td>

                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => editCategory(category)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteCategory(category.id)}
                  >
                    Delete
                  </button>

                </td>

              </tr>
            ))
          ) : (
            <tr>

              <td colSpan="4" className="text-center">
                No Categories Found
              </td>

            </tr>
          )}

        </tbody>

      </table>

    </div>
  );
}

export default Categories;