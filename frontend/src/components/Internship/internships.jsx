import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useSearchParams } from "react-router-dom";

const formatStipend = (stipend) => {
  if (!stipend) return "Unpaid";
  return `Rs ${stipend.toLocaleString()}/month`;
};

const Internships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [skill, setSkill] = useState("");
  const [location, setLocation] = useState("");
  const [searchParams] = useSearchParams();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";
  const selectedCategory = searchParams.get("category");

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/internship/getall`, {
          params: { search, skill, location, role: selectedCategory },
        });
        setInternships(data.internships || []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load internships.");
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, [API_URL, search, skill, location, selectedCategory]);

  const visibleInternships = useMemo(() => {
    return internships;
  }, [internships]);

  if (loading) {
    return (
      <section className="page-shell">
        <div className="empty-state">
          <h3>Loading internships...</h3>
        </div>
      </section>
    );
  }

  return (
    <section className="page-shell">
      <div className="page-header">
        <div>
          <span className="eyebrow">Internship Marketplace</span>
          <h1>Discover opportunities that match student ambition</h1>
        </div>
        <p>
          Browse internships published by companies across technical, design,
          business, and emerging digital domains.
        </p>
      </div>

      <div className="filter-bar">
        <span className="filter-pill">
          {selectedCategory ? `Filtered by ${selectedCategory}` : "All categories"}
        </span>
        <span className="filter-pill">{visibleInternships.length} roles visible</span>
      </div>

      <form className="filter-bar" onSubmit={(event) => event.preventDefault()} aria-label="Search internships">
        <input aria-label="Job role" placeholder="Search job role or keywords" value={search} onChange={(event) => setSearch(event.target.value)} />
        <input aria-label="Required skill" placeholder="Required skill (e.g. React)" value={skill} onChange={(event) => setSkill(event.target.value)} />
        <input aria-label="Location" placeholder="Location" value={location} onChange={(event) => setLocation(event.target.value)} />
      </form>

      {visibleInternships.length ? (
        <div className="internship-grid">
          {visibleInternships.map((internship) => (
            <article className="internship-card" key={internship._id}>
              <div>
                <h3>{internship.title}</h3>
                <p>{internship.postedBy?.name || "Company"} · {internship.location}</p>
              </div>

              <div className="card-meta">
                <span className="meta-chip">{internship.category}</span>
                <span className="meta-chip">{internship.type}</span>
                <span className="meta-chip">{internship.duration}</span>
              </div>

              <p>{internship.description?.slice(0, 140) || "Internship description coming soon."}</p>

              <div className="detail-list">
                <div className="detail-row">
                  <div>
                    <h4>Stipend</h4>
                    <p>{formatStipend(internship.stipend)}</p>
                  </div>
                </div>
                <div className="detail-row">
                  <div>
                    <h4>Deadline</h4>
                    <p>
                      {internship.applicationDeadline
                        ? new Date(internship.applicationDeadline).toLocaleDateString()
                        : "Open until filled"}
                    </p>
                  </div>
                </div>
              </div>

              <Link to={`/internships/${internship._id}`} className="internship-btn">
                View Details
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No internships match this view yet</h3>
          <p>Try another category or check back after companies publish more roles.</p>
        </div>
      )}
    </section>
  );
};

export default Internships;
