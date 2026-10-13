import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { HiOutlineAcademicCap, HiOutlineBars3, HiOutlineXMark } from "react-icons/hi2";
import { Context } from "../../main";

const publicLinks = [
  { to: "/", label: "Home" },
  { to: "/internships", label: "Internships" },
  { to: "/register", label: "Get Started", cta: true },
];

const roleLinks = {
  Student: [
    { to: "/student/dashboard", label: "Dashboard" },
    { to: "/internships", label: "Explore" },
    { to: "/student/applications", label: "Applications" },
  ],
  Company: [
    { to: "/company/dashboard", label: "Dashboard" },
    { to: "/company/post-internship", label: "Post Internship" },
    { to: "/company/my-internships", label: "My Roles" },
    { to: "/company/applicants", label: "Applicants" },
  ],
  College: [
    { to: "/college/dashboard", label: "Dashboard" },
    { to: "/internships", label: "Marketplace" },
  ],
};

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { isAuthorized, setIsAuthorized, user, setUser } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

  const links = isAuthorized ? roleLinks[user?.role] || publicLinks : publicLinks;

  const closeMenu = () => setShowMenu(false);

  const handleLogout = async () => {
    try {
      await axios.get(`${API_URL}/user/logout`, {
        withCredentials: true,
      });
      toast.success("Logged out successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed.");
    } finally {
      setUser(null);
      setIsAuthorized(false);
      closeMenu();
      navigate("/");
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand" onClick={closeMenu}>
          <div className="brand-mark">
            <HiOutlineAcademicCap />
          </div>
          <div className="brand-copy">
            <strong>InternBridge</strong>
            <span>Student Internship Portal</span>
          </div>
        </Link>

        <button
          type="button"
          className="menu-toggle"
          onClick={() => setShowMenu((value) => !value)}
          aria-label="Toggle navigation"
        >
          {showMenu ? <HiOutlineXMark /> : <HiOutlineBars3 />}
        </button>

        <nav>
          <ul className={`nav-links ${showMenu ? "open" : ""}`}>
            {links.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={link.cta ? "nav-cta" : ""}
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              </li>
            ))}

            {isAuthorized ? (
              <>
                <li className="nav-user">
                  {user?.name || user?.role || "Account"}
                </li>
                <li>
                  <button type="button" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              location.pathname !== "/login" && (
                <li>
                  <Link to="/login" onClick={closeMenu}>
                    Login
                  </Link>
                </li>
              )
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
