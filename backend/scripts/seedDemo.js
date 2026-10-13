import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import { User } from "../models/userSchema.js";
import { Internship } from "../models/InternshipSchema.js";
import { Application } from "../models/applicationSchema.js";
import { CollegeUpdate } from "../models/collegeUpdateSchema.js";

config({ path: fileURLToPath(new URL("../.env", import.meta.url)) });
const uri = process.env.DB_URL || "mongodb://127.0.0.1:27017/SIP";
const password = "DemoPass123!";

const people = [
  { name: "Aarav Mehta", email: "student1@demo.com", role: "Student", studentProfile: { college: "Northstar Institute of Technology", branch: "Computer Engineering", semester: 6, cgpa: 8.7, skills: ["React", "JavaScript", "Node.js"], projects: [{ title: "Campus Connect", description: "A student community and events app.", technologies: ["React", "Node.js", "MongoDB"] }] } },
  { name: "Diya Shah", email: "student2@demo.com", role: "Student", studentProfile: { college: "Northstar Institute of Technology", branch: "Information Technology", semester: 5, cgpa: 8.3, skills: ["Python", "Machine Learning", "SQL"] } },
  { name: "Kabir Rao", email: "student3@demo.com", role: "Student", studentProfile: { college: "Northstar Institute of Technology", branch: "Computer Engineering", semester: 7, cgpa: 9.1, skills: ["Figma", "UI/UX", "Prototyping"] } },
  { name: "Northstar Placement Office", email: "college@demo.com", role: "College", collegeProfile: { collegeName: "Northstar Institute of Technology", university: "Northstar University", address: "Pune, Maharashtra", placementCoordinator: "Northstar Placement Office", departments: ["Computer Engineering", "Information Technology", "Design"] } },
  { name: "Nexa Labs", email: "company1@demo.com", role: "Company", companyProfile: { companyName: "Nexa Labs", description: "Product engineering and cloud solutions.", website: "https://example.com", industry: "Technology", location: "Pune, India" } },
  { name: "BrightPixel Studio", email: "company2@demo.com", role: "Company", companyProfile: { companyName: "BrightPixel Studio", description: "Digital product design and experiences.", website: "https://example.com", industry: "Design", location: "Remote" } },
  { name: "DataSpring Analytics", email: "company3@demo.com", role: "Company", companyProfile: { companyName: "DataSpring Analytics", description: "Data products for growing teams.", website: "https://example.com", industry: "Analytics", location: "Bengaluru, India" } },
];

try {
  await mongoose.connect(uri);
  const users = {};
  for (const person of people) {
    let user = await User.findOne({ email: person.email });
    if (!user) user = new User({ ...person, phone: "9999999999", password });
    else {
      Object.assign(user, person);
      user.phone = "9999999999";
      user.password = password;
    }
    await user.save();
    users[person.email] = user;
  }

  const roles = [
    { title: "Frontend Developer Intern", category: "Software Development", requiredSkills: ["React", "JavaScript", "CSS"], duration: "3 months", stipend: 18000, type: "Hybrid", location: "Pune, India", postedBy: users["company1@demo.com"] },
    { title: "Backend Engineering Intern", category: "Software Development", requiredSkills: ["Node.js", "MongoDB", "REST APIs"], duration: "6 months", stipend: 22000, type: "On-site", location: "Pune, India", postedBy: users["company1@demo.com"] },
    { title: "Product Design Intern", category: "Design", requiredSkills: ["Figma", "UI/UX", "Prototyping"], duration: "3 months", stipend: 15000, type: "Remote", location: "Remote", postedBy: users["company2@demo.com"] },
    { title: "UX Research Intern", category: "Design", requiredSkills: ["User Research", "Figma", "Communication"], duration: "4 months", stipend: 14000, type: "Hybrid", location: "Mumbai, India", postedBy: users["company2@demo.com"] },
    { title: "Data Analytics Intern", category: "Data Science", requiredSkills: ["Python", "SQL", "Data Visualization"], duration: "4 months", stipend: 20000, type: "Hybrid", location: "Bengaluru, India", postedBy: users["company3@demo.com"] },
    { title: "Machine Learning Intern", category: "Data Science", requiredSkills: ["Python", "Machine Learning", "Pandas"], duration: "6 months", stipend: 25000, type: "Remote", location: "Remote", postedBy: users["company3@demo.com"] },
  ];
  const internships = [];
  for (const role of roles) {
    const internship = await Internship.findOneAndUpdate(
      { title: role.title, postedBy: role.postedBy._id },
      { $set: { ...role, description: `Work with the ${role.category.toLowerCase()} team on real projects, collaborate with mentors, and build practical experience. Applicants should be curious, reliable, and ready to learn.`, openings: 2, applicationDeadline: new Date(Date.now() + 120 * 86400000), certificateProvided: true, ppoOpportunity: true, status: "Open" } },
      { new: true, upsert: true, runValidators: true }
    );
    internships.push(internship);
  }

  const applicants = [
    ["student1@demo.com", 0, "Under Review", "Resume reviewed; technical screening in progress."],
    ["student1@demo.com", 1, "Applied", "Application received for the backend engineering team."],
    ["student2@demo.com", 4, "Shortlisted", "Strong Python and SQL foundation; invited to next round."],
    ["student2@demo.com", 5, "Interview Scheduled", "Technical interview scheduled with the data team."],
    ["student3@demo.com", 2, "Selected", "Selected for the product design internship cohort."],
    ["student3@demo.com", 3, "Applied", "Application received for UX research."],
  ];
  for (const [email, index, status, message] of applicants) {
    const internship = internships[index];
    const application = await Application.findOneAndUpdate(
      { student: users[email]._id, internship: internship._id },
      { $set: { student: users[email]._id, internship: internship._id, company: internship.postedBy, status, statusHistory: [{ status: "Applied", comment: "Demo application submitted." }, ...(status === "Applied" ? [] : [{ status, comment: "Demo progress update." }])] } },
      { new: true, upsert: true, runValidators: true }
    );
    if (status !== "Applied") {
      await CollegeUpdate.updateOne(
        { application: application._id },
        { $set: { college: users["college@demo.com"]._id, student: users[email]._id, company: internship.postedBy, internship: internship._id, message } },
        { upsert: true }
      );
    }
  }
  console.log(`Demo data is ready in ${mongoose.connection.name}. Login password for all demo accounts: ${password}`);
} catch (error) {
  console.error("Could not seed demo data:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
