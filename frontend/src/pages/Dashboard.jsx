import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total_categories: 0,
    total_products: 0,
    low_stock: 0,
  });

  useEffect(() => {
    getDashboardData();
  }, []);

  const getDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStats(response.data);

    } catch (error) {
      console.log(error);
      alert("Failed to Load Dashboard");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="container mt-5">

      <h2 className="text-center mb-5">
        Inventory Management System
      </h2>

      <div className="row">

        <div className="col-md-4 mb-4">
          <div className="card bg-primary text-white shadow">
            <div className="card-body text-center">
              <h5><i className="bi bi-tags-fill me-2"></i>Total Categories</h5>
              <h1>{stats.total_categories}</h1>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card bg-success text-white shadow">
            <div className="card-body text-center">
              <h5><i className="bi bi-box-seam me-2"></i>Total Products</h5>
              <h1>{stats.total_products}</h1>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card bg-danger text-white shadow">
            <div className="card-body text-center">
             <h5><i className="bi bi-exclamation-triangle-fill me-2"></i>Low Stock</h5>
              <h1>{stats.low_stock}</h1>
            </div>
          </div>
        </div>

      </div>

      <div className="row mt-4">

        <div className="col-md-4">
          <button
            className="btn btn-primary w-100"
            onClick={() => navigate("/categories")}
          >
            Manage Categories
          </button>
        </div>

        <div className="col-md-4">
          <button
            className="btn btn-success w-100"
            onClick={() => navigate("/products")}
          >
            Manage Products
          </button>
        </div>

        <div className="col-md-4">
          <button
            className="btn btn-dark w-100"
            onClick={logout}
          >
            Logout
          </button>
        </div>

      </div>
<hr />

<div className="text-center mt-4">
  <small className="text-muted">
    Inventory Management System © 2026
  </small>
</div>
    </div>
  );
}

export default Dashboard;