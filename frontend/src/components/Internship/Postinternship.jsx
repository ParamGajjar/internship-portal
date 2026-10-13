import React, { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";
import { Context } from "../../main";

const initialForm = {
  title: "",
  description: "",
  category: "",
  location: "",
  type: "On-site",
  duration: "",
  stipend: "",
  applicationDeadline: "",
};

const PostInternship = () => {
  const { isAuthorized, user } = useContext(Context);
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${API_URL}/internship/post`,
        {
          ...formData,
          stipend: formData.stipend ? Number(formData.stipend) : 0,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      toast.success(data.message || "Internship posted successfully.");
      setFormData(initialForm);
      navigate("/company/my-internships");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post internship.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthorized) return <Navigate to="/login" />;
  if (user?.role !== "Company") return <Navigate to="/" />;

  return (
    <section className="page-shell">
      <div className="form-card">
        <div className="page-header">
          <div>
            <span className="eyebrow">Publish Internship</span>
            <h1>Create a role students can discover and apply for</h1>
          </div>
          <p>
            Add structured role information so students and colleges get a clear
            view of your internship opportunity.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Frontend Developer Intern"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Web Development"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows="8"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe responsibilities, expected skills, and what the intern will learn."
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Ahmedabad, Gujarat"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="type">Type</label>
              <select id="type" name="type" value={formData.type} onChange={handleChange}>
                <option value="On-site">On-site</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="duration">Duration</label>
              <input
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="3 Months"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="stipend">Monthly Stipend</label>
              <input
                id="stipend"
                name="stipend"
                type="number"
                value={formData.stipend}
                onChange={handleChange}
                placeholder="10000"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="applicationDeadline">Application Deadline</label>
            <input
              id="applicationDeadline"
              name="applicationDeadline"
              type="date"
              value={formData.applicationDeadline}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Posting internship..." : "Post Internship"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default PostInternship;
