import React, { useContext } from "react";
import { Context } from "../../main";

const CompanyDashboard = () => {
  const { user } = useContext(Context);

  return (
    <section className="dashboardPage">
      <div className="dashboardContainer">
        <h1>Company Dashboard</h1>

        <div className="welcomeCard">
          <h2>Welcome, {user?.name || "Company"} 👋</h2>
          <p>
            Post internships, manage applicants and track recruitment
            activities.
          </p>
        </div>

        <div className="dashboardCards">
          <div className="dashboardCard">
            <h3>Post Internship</h3>
            <p>Create and publish new internship opportunities.</p>
          </div>

          <div className="dashboardCard">
            <h3>My Internships</h3>
            <p>Manage internships posted by your company.</p>
          </div>

          <div className="dashboardCard">
            <h3>Applicants</h3>
            <p>Review students who have applied to your internships.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyDashboard;