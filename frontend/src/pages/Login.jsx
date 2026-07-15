import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await api.post("/login", {
        username: username,
        password: password,
      });

      localStorage.setItem("token", response.data.access_token);

      alert("Login Successful!");

      navigate("/dashboard");

    } catch (error) {
      console.log(error);

      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Unable to connect to server");
      }
    }
  };

  return (
    <div className="container mt-5">

      <div className="row justify-content-center">

        <div className="col-md-5">

          <div className="card shadow">

            <div className="card-header text-center">
              <h3>Inventory Management System</h3>
            </div>

            <div className="card-body">

              <div className="mb-3">
                <label>Username</label>

                <input
                  type="text"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label>Password</label>

                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                className="btn btn-primary w-100"
                onClick={handleLogin}
              >
                Login
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;