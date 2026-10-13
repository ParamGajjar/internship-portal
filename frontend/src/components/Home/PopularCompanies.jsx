import React from "react";

const companies = [
  {
    name: "TCS Digital Labs",
    badge: "TD",
    description: "Enterprise software, engineering, and digital transformation internships.",
  },
  {
    name: "Infosys Springboard",
    badge: "IS",
    description: "Technology, analytics, and training-led early career programs.",
  },
  {
    name: "Accenture Studio",
    badge: "AS",
    description: "Consulting, product strategy, design, and innovation internship tracks.",
  },
  {
    name: "Deloitte LaunchPad",
    badge: "DL",
    description: "Business operations, cyber, and advisory opportunities for students.",
  },
  {
    name: "Startup Forge",
    badge: "SF",
    description: "Fast-paced internships for builders across product, tech, and growth.",
  },
  {
    name: "CloudNest Systems",
    badge: "CN",
    description: "Cloud, DevOps, automation, and platform engineering roles.",
  },
];

const PopularCompanies = () => {
  return (
    <section className="portal-panel">
      <div className="portal-section-header">
        <div>
          <span className="eyebrow">Hiring Partners</span>
          <h2>Example organizations students can connect with</h2>
        </div>
        <p>
          A strong portal should make it easy for established employers and
          growing startups to recruit from the same student talent network.
        </p>
      </div>

      <div className="companiesGrid">
        {companies.map((company) => (
          <article className="company-card" key={company.name}>
            <div className="company-badge">{company.badge}</div>
            <div>
              <h3>{company.name}</h3>
              <p>{company.description}</p>
            </div>
            <div className="company-status">
              <span className="status-dot" />
              Hiring internships now
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default PopularCompanies;
