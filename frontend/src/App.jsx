import React, { useContext, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { Context } from "./main";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import Home from "./components/Home/Home";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import StudentDashboard from "./components/Dashboard/StudentDashboard";
import CompanyDashboard from "./components/Dashboard/CompanyDashboard";
import CollegeDashboard from "./components/Dashboard/CollegeDashboard";
import Internships from "./components/Internship/internships";
import InternshipDetails from "./components/Internship/internshipDetails";
import ApplyInternship from "./components/Internship/ApplyInternship";
import PostInternship from "./components/Internship/Postinternship";
import MyInternships from "./components/Internship/Myinternships";
import MyApplications from "./components/Application/MyApplications";
import CompanyApplicants from "./components/Application/companyapplicants";
import NotFound from "./components/NotFound/NotFound";

const App = () => {
  const { setIsAuthorized, setUser, authLoading, setAuthLoading } = useContext(Context);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${(import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1")}/user/me`,
          {
            withCredentials: true,
          }
        );

        setUser(response.data.user);
        setIsAuthorized(true);
      } catch (error) {
        setIsAuthorized(false);
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    fetchUser();
  }, [setAuthLoading, setIsAuthorized, setUser]);

  const ProtectedRoute = ({ children }) => {
    if (authLoading) {
      return <div className="page-shell"><div className="empty-state"><h3>Loading your account...</h3></div></div>;
    }

    return isAuthorized ? children : <Navigate to="/login" replace />;
  };

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/internships" element={<Internships />} />
          <Route path="/internships/:id" element={<InternshipDetails />} />
          <Route
            path="/internships/:id/apply"
            element={<ApplyInternship />}
          />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/applications" element={<MyApplications />} />
          <Route path="/company/dashboard" element={<CompanyDashboard />} />
          <Route
            path="/company/post-internship"
            element={<PostInternship />}
          />
          <Route
            path="/company/my-internships"
            element={<MyInternships />}
          />
          <Route path="/company/applicants" element={<CompanyApplicants />} />
          <Route path="/college/dashboard" element={<CollegeDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <Toaster position="top-right" />
      </div>
    </BrowserRouter>
  );
};

export default App;
