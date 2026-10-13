import React, { useContext, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { HiOutlineBriefcase, HiOutlineBuildingOffice2, HiOutlineUserGroup } from "react-icons/hi2";
import { Context } from "../../main";

const roleNotes = {
  Student: "Apply to internships, track statuses, and stay interview-ready.",
  Company: "Post roles, review candidates, and move hiring faster.",
  College: "Monitor internship engagement and placement activity centrally.",
};

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "Student",
  });
  const [loading, setLoading] = useState(false);
  const { isAuthorized, setIsAuthorized, setUser } = useContext(Context);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(`${API_URL}/user/login`, formData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      const userResponse = await axios.get(`${API_URL}/user/me`, {
        withCredentials: true,
      });

      const loggedInUser = userResponse.data.user;
      setUser(loggedInUser);
      setIsAuthorized(true);
      toast.success(data.message || "Login successful.");

      if (loggedInUser.role === "Student") navigate("/student/dashboard");
      else if (loggedInUser.role === "Company") navigate("/company/dashboard");
      else if (loggedInUser.role === "College") navigate("/college/dashboard");
      else navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  if (isAuthorized) {
    return <Navigate to="/" replace />;
  }

  return (
    <section className="authPage">
      <div className="auth-card">
        <div className="auth-copy">
          <span className="eyebrow">Secure Access</span>
          <h1>Sign in to your internship workspace</h1>
          <p>
            Pick your role and continue into the portal experience designed for
            your internship workflow.
          </p>

          <div className="auth-points">
            <div className="auth-point">
              <HiOutlineUserGroup />
              <span>{roleNotes.Student}</span>
            </div>
            <div className="auth-point">
              <HiOutlineBuildingOffice2 />
              <span>{roleNotes.Company}</span>
            </div>
            <div className="auth-point">
              <HiOutlineBriefcase />
              <span>{roleNotes.College}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleLogin}>
          <div className="inputTag">
            <label htmlFor="role">Login As</label>
            <select id="role" name="role" value={formData.role} onChange={handleChange}>
              <option value="Student">Student</option>
              <option value="Company">Company</option>
              <option value="College">College</option>
            </select>
          </div>

          <div className="inputTag">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="inputTag">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>

          <Link to="/register" className="auth-link">
            Need an account? Register here
          </Link>
        </form>
      </div>

      <div className="banner">
        <img src="/login.png" alt="Internship portal login" />
      </div>
    </section>
  );
};

export default Login;
