import React from "react";
import {
  HiOutlineIdentification,
  HiOutlineMagnifyingGlass,
  HiOutlineClipboardDocumentList,
  HiOutlineChartPie,
} from "react-icons/hi2";

const steps = [
  {
    icon: <HiOutlineIdentification />,
    title: "Build verified profiles",
    description:
      "Students, recruiters, and college administrators create focused profiles aligned to their role in the internship process.",
  },
  {
    icon: <HiOutlineMagnifyingGlass />,
    title: "Discover and publish opportunities",
    description:
      "Companies publish internship openings while students browse by skill, domain, location, stipend, and duration.",
  },
  {
    icon: <HiOutlineClipboardDocumentList />,
    title: "Manage applications in one place",
    description:
      "Applications, statuses, comments, and interview updates stay organized inside the same portal.",
  },
  {
    icon: <HiOutlineChartPie />,
    title: "Track outcomes and progress",
    description:
      "Colleges and companies can monitor results while students stay updated on every stage of recruitment.",
  },
];

const HowItWorks = () => {
  return (
    <section className="portal-panel">
      <div className="portal-section-header">
        <div>
          <span className="eyebrow">How It Works</span>
          <h2>A simple internship flow with better visibility</h2>
        </div>
        <p>
          The experience is intentionally streamlined so each stakeholder can
          move quickly without losing context.
        </p>
      </div>

      <div className="feature-grid">
        {steps.map((step) => (
          <article className="feature-card" key={step.title}>
            <div className="feature-icon">{step.icon}</div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
