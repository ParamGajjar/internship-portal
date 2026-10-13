import React, { useContext, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { HiOutlineBuildingOffice2, HiOutlineClipboardDocumentCheck, HiOutlineUserGroup } from "react-icons/hi2";
import { Context } from "../../main";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
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

  const handleRegister = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(`${API_URL}/user/register`, formData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      const userResponse = await axios.get(`${API_URL}/user/me`, {
        withCredentials: true,
      });

      const registeredUser = userResponse.data.user;
      setUser(registeredUser);
      setIsAuthorized(true);
      toast.success(data.message || "Registration successful.");

      if (registeredUser.role === "Student") navigate("/student/dashboard");
      else if (registeredUser.role === "Company") navigate("/company/dashboard");
      else if (registeredUser.role === "College") navigate("/college/dashboard");
      else navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed.");
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
          <span className="eyebrow">Portal Onboarding</span>
          <h1>Create a role-based account for your internship network</h1>
          <p>
            Register once and enter a workspace designed for student
            applications, company hiring, or college oversight.
          </p>

          <div className="auth-points">
            <div className="auth-point">
              <HiOutlineUserGroup />
              <span>Students can explore opportunities and track every application stage.</span>
            </div>
            <div className="auth-point">
              <HiOutlineBuildingOffice2 />
              <span>Companies can publish roles and manage a more organized applicant pipeline.</span>
            </div>
            <div className="auth-point">
              <HiOutlineClipboardDocumentCheck />
              <span>Colleges can supervise participation, progress, and internship outcomes.</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleRegister}>
          <div className="inputTag">
            <label htmlFor="role">Register As</label>
            <select id="role" name="role" value={formData.role} onChange={handleChange}>
              <option value="Student">Student</option>
              <option value="Company">Company</option>
              <option value="College">College</option>
            </select>
          </div>

          <div className="inputTag">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
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
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phone}
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
              minLength={8}
              placeholder="Minimum 8 characters"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <Link to="/login" className="auth-link">
            Already have an account? Login
          </Link>
        </form>
      </div>

      <div className="banner">
        <img src="/register.png" alt="Internship portal registration" />
      </div>
    </section>
  );
};

export default Register;
