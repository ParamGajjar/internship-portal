import React from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineCodeBracketSquare,
  HiOutlineCircleStack,
  HiOutlineCpuChip,
  HiOutlinePresentationChartLine,
  HiOutlineDevicePhoneMobile,
  HiOutlinePaintBrush,
  HiOutlineShieldCheck,
  HiOutlineCloud,
} from "react-icons/hi2";

const categories = [
  { name: "Web Development", icon: <HiOutlineCodeBracketSquare /> },
  { name: "Data Science", icon: <HiOutlineCircleStack /> },
  { name: "AI and Machine Learning", icon: <HiOutlineCpuChip /> },
  { name: "Business Analytics", icon: <HiOutlinePresentationChartLine /> },
  { name: "Mobile Development", icon: <HiOutlineDevicePhoneMobile /> },
  { name: "UI and UX Design", icon: <HiOutlinePaintBrush /> },
  { name: "Cyber Security", icon: <HiOutlineShieldCheck /> },
  { name: "Cloud Engineering", icon: <HiOutlineCloud /> },
];

const PopularCategories = () => {
  return (
    <section className="portal-panel">
      <div className="portal-section-header">
        <div>
          <span className="eyebrow">Opportunity Areas</span>
          <h2>Explore internships by emerging career path</h2>
        </div>
        <p>
          Students can quickly move into relevant domains while companies get
          more qualified applications for specialized roles.
        </p>
      </div>

      <div className="categoriesGrid">
        {categories.map((category) => (
          <Link
            key={category.name}
            to={`/internships?category=${encodeURIComponent(category.name)}`}
            className="categoryCard"
          >
            <div className="categoryIcon">{category.icon}</div>
            <h3>{category.name}</h3>
            <span>View matching roles</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default PopularCategories;
