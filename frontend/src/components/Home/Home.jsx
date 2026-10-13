import React from "react";
import HeroSection from "./HeroSection";
import HowItWorks from "./HowItWorks";
import PopularCategories from "./PopularCategories";
import PopularCompanies from "./PopularCompanies";
import {
  HiOutlineChartBar,
  HiOutlineClipboardDocumentCheck,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineUserGroup,
  HiOutlineBuildingOffice2,
} from "react-icons/hi2";

const platformHighlights = [
  {
    icon: <HiOutlineSparkles />,
    title: "Single internship ecosystem",
    description:
      "Students, placement teams, and recruiters collaborate on the same portal instead of juggling forms, spreadsheets, and email threads.",
  },
  {
    icon: <HiOutlineClipboardDocumentCheck />,
    title: "Structured application tracking",
    description:
      "Every application moves through clear stages from applied to selected, making recruitment faster and less confusing.",
  },
  {
    icon: <HiOutlineChartBar />,
    title: "Live visibility for colleges",
    description:
      "Placement cells can monitor participation, shortlist rates, and internship progress in one dashboard.",
  },
  {
    icon: <HiOutlineShieldCheck />,
    title: "Verified institutional workflow",
    description:
      "Colleges can oversee company engagement, support students, and maintain accountable internship records.",
  },
];

const stakeholders = [
  {
    role: "Student",
    icon: <HiOutlineUserGroup />,
    title: "Students discover and apply with confidence",
    description:
      "Browse opportunities by role, stipend, duration, and location, then track every application from one place.",
  },
  {
    role: "Company",
    icon: <HiOutlineBuildingOffice2 />,
    title: "Companies recruit internship-ready talent",
    description:
      "Post openings, review applicants, schedule interviews, and move candidates through a clean hiring pipeline.",
  },
  {
    role: "College",
    icon: <HiOutlineChartBar />,
    title: "Colleges stay connected to outcomes",
    description:
      "Monitor student progress, strengthen employer relationships, and keep internship operations transparent.",
  },
];

const timeline = [
  {
    title: "Profile setup and onboarding",
    text: "Students create profiles, companies define requirements, and colleges centralize internship operations.",
  },
  {
    title: "Opportunity publishing and discovery",
    text: "Recruiters publish internships while students search roles that match skills, schedules, and ambitions.",
  },
  {
    title: "Application review and shortlisting",
    text: "Hiring teams manage application stages with clear visibility for both candidates and colleges.",
  },
  {
    title: "Internship progress and outcomes",
    text: "Track interviews, selections, and internship completion milestones from one system.",
  },
];

const Home = () => {
  return (
    <>
      <HeroSection />

      <div className="section-stack">
        <section className="portal-panel">
          <div className="portal-section-header">
            <div>
              <span className="eyebrow">Platform Vision</span>
              <h2>Built to streamline the full internship journey</h2>
            </div>
            <p>
              This portal is designed as a centralized bridge between students,
              companies, and colleges so every internship workflow feels faster,
              clearer, and more accountable.
            </p>
          </div>

          <div className="feature-grid">
            {platformHighlights.map((item) => (
              <article className="feature-card" key={item.title}>
                <div className="feature-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <HowItWorks />

        <section className="portal-panel">
          <div className="portal-section-header">
            <div>
              <span className="eyebrow">Stakeholder Views</span>
              <h2>Three audiences, one connected workflow</h2>
            </div>
            <p>
              The portal keeps each user experience focused while still sharing
              the same trusted system of record.
            </p>
          </div>

          <div className="stakeholder-grid">
            {stakeholders.map((stakeholder) => (
              <article
                className="stakeholder-card"
                key={stakeholder.role}
                data-role={stakeholder.role}
              >
                <div className="stakeholder-icon">{stakeholder.icon}</div>
                <h3>{stakeholder.title}</h3>
                <p>{stakeholder.description}</p>
              </article>
            ))}
          </div>
        </section>

        <PopularCategories />
        <PopularCompanies />

        <section className="portal-panel">
          <div className="portal-section-header">
            <div>
              <span className="eyebrow">Portal Flow</span>
              <h2>How your internship process moves inside the platform</h2>
            </div>
            <p>
              From discovery to completion, each stage is structured so users
              always know what happens next.
            </p>
          </div>

          <div className="timeline-list">
            {timeline.map((item, index) => (
              <article className="timeline-card" key={item.title}>
                <div className="timeline-meta">
                  <span>Step {index + 1}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
