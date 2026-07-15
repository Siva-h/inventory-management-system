import { useEffect, useState } from "react";
import api from "../services/api";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    getCategories();
  }, []);

  // Get Categories
  const getCategories = async () => {
    try {
      const token = localStorage.getItem("token");

      console.log("Token:", token);

      const response = await api.get("/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCategories(response.data);
    } catch (error) {
      console.log(error);
      console.log(error.response);
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
      alert("Error Creating Category");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Category Management</h2>

      <div className="card shadow p-4 mb-4">

        <div className="mb-3">
          <label className="form-label">Category Name</label>
          <input
            type="text"
            className="form-control"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter Category Name"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <input
            type="text"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter Description"
          />
        </div>

        <button
          className="btn btn-success"
          onClick={createCategory}
        >
          Add Category
        </button>

      </div>

      <table className="table table-bordered table-hover">

        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Category Name</th>
            <th>Description</th>
          </tr>
        </thead>

        <tbody>
          {categories.length > 0 ? (
            categories.map((category) => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.category_name}</td>
                <td>{category.description}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">
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