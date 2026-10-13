import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Navigate, useSearchParams } from "react-router-dom";
import { Context } from "../../main";

const formatStatusClass = (status = "") =>
  status.toLowerCase().replace(/\s+/g, "-");

const CompanyApplicants = () => {
  const { isAuthorized, user } = useContext(Context);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [status, setStatus] = useState("Applied");
  const [comment, setComment] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewMode, setInterviewMode] = useState("Online");
  const [meetingLink, setMeetingLink] = useState("");
  const [collegeUpdate, setCollegeUpdate] = useState("");
  const [searchParams] = useSearchParams();
  const internshipFilter = searchParams.get("internship");
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

  const fetchApplications = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/application/company-applications`, {
        withCredentials: true,
      });
      setApplications(data.applications || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load applicants.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthorized && user?.role === "Company") {
      fetchApplications();
    } else {
      setLoading(false);
    }
  }, [isAuthorized, user]);

  const visibleApplications = useMemo(() => {
    if (!internshipFilter) return applications;
    return applications.filter((item) => item.internship?._id === internshipFilter);
  }, [applications, internshipFilter]);

  const openUpdatePanel = (application) => {
    setSelectedApplication(application);
    setStatus(application.status || "Applied");
    setComment(application.comment || "");
    setInterviewDate(application.interview?.date ? application.interview.date.slice(0, 16) : "");
    setInterviewMode(application.interview?.mode || "Online");
    setMeetingLink(application.interview?.meetingLink || "");
    setCollegeUpdate("");
  };

  const sendCollegeUpdate = async () => {
    if (!collegeUpdate.trim()) return toast.error("Enter an update for the college first.");
    try {
      const { data } = await axios.post(`${API_URL}/application/college-update`, {
        applicationId: selectedApplication._id,
        message: collegeUpdate,
      }, { withCredentials: true });
      toast.success(data.message || "College update sent.");
      setCollegeUpdate("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not send college update.");
    }
  };

  const updateStatus = async (event) => {
    event.preventDefault();
    if (!selectedApplication) return;

    try {
      const payload = { status, comment };

      if (status === "Interview Scheduled") {
        payload.interviewDate = interviewDate;
        payload.interviewMode = interviewMode;
        payload.meetingLink = meetingLink;
      }

      const { data } = await axios.put(
        `${API_URL}/application/update-status/${selectedApplication._id}`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      toast.success(data.message || "Application updated successfully.");
      setSelectedApplication(null);
      fetchApplications();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update application.");
    }
  };

  if (!isAuthorized) return <Navigate to="/login" />;
  if (user?.role !== "Company") return <Navigate to="/" />;
  if (loading) return <div className="page-shell"><div className="empty-state"><h3>Loading applicants...</h3></div></div>;

  return (
    <section className="page-shell">
      <div className="page-header">
        <div>
          <span className="eyebrow">Applicant Pipeline</span>
          <h1>Review student applications with a clean hiring workflow</h1>
        </div>
        <p>
          Keep candidate updates centralized, transparent, and ready for the
          next stage of recruitment.
        </p>
      </div>

      <div className="filter-bar">
        <span className="filter-pill">
          {internshipFilter ? "Filtered to one internship" : "All company applications"}
        </span>
        <span className="filter-pill">{visibleApplications.length} applicants shown</span>
      </div>

      {visibleApplications.length ? (
        <div className="application-grid">
          {visibleApplications.map((application) => (
            <article className="application-card" key={application._id}>
              <div className="application-header">
                <div>
                  <h3>{application.student?.name || "Student"}</h3>
                  <p>{application.student?.email || "No email"} · {application.student?.phone || "No phone"}</p>
                </div>
                <span className={`status-pill ${formatStatusClass(application.status)}`}>
                  {application.status}
                </span>
              </div>

              <div className="detail-list">
                <div className="detail-row">
                  <div>
                    <h4>Applied for</h4>
                    <p>{application.internship?.title || "Internship Role"}</p>
                  </div>
                </div>
                <div className="detail-row">
                  <div>
                    <h4>Application date</h4>
                    <p>{new Date(application.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="update-btn"
                onClick={() => openUpdatePanel(application)}
              >
                Manage Application
              </button>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No applications received yet</h3>
          <p>Once students apply to your internships, they will appear here.</p>
        </div>
      )}

      {selectedApplication && (
        <div className="application-modal-overlay">
          <div className="application-modal">
            <div className="modal-card">
              <button
                type="button"
                className="close-modal"
                onClick={() => setSelectedApplication(null)}
              >
                x
              </button>

              <h2>Manage candidate progress</h2>
              <p>
                {selectedApplication.student?.name} for{" "}
                {selectedApplication.internship?.title}
              </p>

              <form onSubmit={updateStatus}>
                <div className="form-group">
                  <label htmlFor="status">Application Status</label>
                  <select id="status" value={status} onChange={(event) => setStatus(event.target.value)}>
                    <option value="Applied">Applied</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Interview Scheduled">Interview Scheduled</option>
                    <option value="Selected">Selected</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="comment">Comment</label>
                  <textarea
                    id="comment"
                    rows="4"
                    placeholder="Add recruiter notes or interview guidance"
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="collegeUpdate">Private update for the student's college</label>
                  <textarea id="collegeUpdate" rows="3" maxLength={2000} placeholder="Progress note visible only to college accounts" value={collegeUpdate} onChange={(event) => setCollegeUpdate(event.target.value)} />
                  <button type="button" className="update-btn" onClick={sendCollegeUpdate}>Send to college only</button>
                </div>

                {status === "Interview Scheduled" && (
                  <>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="interviewDate">Interview Date</label>
                        <input
                          id="interviewDate"
                          type="datetime-local"
                          value={interviewDate}
                          onChange={(event) => setInterviewDate(event.target.value)}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="interviewMode">Interview Mode</label>
                        <select
                          id="interviewMode"
                          value={interviewMode}
                          onChange={(event) => setInterviewMode(event.target.value)}
                        >
                          <option value="Online">Online</option>
                          <option value="Offline">Offline</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="meetingLink">Meeting Link</label>
                      <input
                        id="meetingLink"
                        type="text"
                        placeholder="Paste the interview meeting link"
                        value={meetingLink}
                        onChange={(event) => setMeetingLink(event.target.value)}
                      />
                    </div>
                  </>
                )}

                <div className="modal-actions">
                  <button type="submit" className="submit-btn">
                    Update Application
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CompanyApplicants;
