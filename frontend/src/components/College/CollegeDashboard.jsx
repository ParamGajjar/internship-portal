import React, { useContext } from "react";
import { Context } from "../../main";

const CollegeDashboard = () => {
  const { user } = useContext(Context);

  return (
    <section className="dashboardPage">
      <div className="dashboardContainer">
        <h1>College Dashboard</h1>

        <div className="welcomeCard">
          <h2>Welcome, {user?.name || "College"} 👋</h2>
          <p>
            Monitor students, companies and internship activities through
            the college portal.
          </p>
        </div>

        <div className="dashboardCards">
          <div className="dashboardCard">
            <h3>Students</h3>
            <p>View and manage registered students.</p>
          </div>

          <div className="dashboardCard">
            <h3>Companies</h3>
            <p>View companies connected with the college.</p>
          </div>

          <div className="dashboardCard">
            <h3>Analytics</h3>
            <p>Track internship and placement statistics.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollegeDashboard;