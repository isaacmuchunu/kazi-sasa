import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import LoadingScreen from "./components/LoadingScreen";
import ProtectedRoute from "./components/ProtectedRoute";

// Auth pages
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

// Main pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Home = lazy(() => import("./pages/Home"));
const Jobs = lazy(() => import("./pages/Jobs"));
const JobDetails = lazy(() => import("./pages/JobDetails"));
const Companies = lazy(() => import("./pages/Companies"));
const CompanyDetails = lazy(() => import("./pages/CompanyDetails"));
const Candidates = lazy(() => import("./pages/Candidates"));
const CandidateDetails = lazy(() => import("./pages/CandidateDetails"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogDetails = lazy(() => import("./pages/BlogDetails"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Help = lazy(() => import("./pages/Help"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Settings = lazy(() => import("./pages/Settings"));
const Pricing = lazy(() => import("./pages/Pricing"));
const TermsConditions = lazy(() => import("./pages/TermsConditions"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Cookies = lazy(() => import("./pages/Cookies"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Dashboard sub-pages
const Applications = lazy(() => import("./pages/dashboard/candidate/Applications"));
const SavedJobs = lazy(() => import("./pages/dashboard/candidate/SavedJobs"));
const CandidateProfile = lazy(() => import("./pages/dashboard/candidate/Profile"));
const EmployerJobs = lazy(() => import("./pages/dashboard/employer/EmployerJobs"));
const EmployerApplications = lazy(() => import("./pages/dashboard/employer/EmployerApplications"));

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Auth routes (guest only) */}
          <Route path="/login" element={
            <ProtectedRoute requireAuth={false}>
              <Layout>
                <Login />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/register" element={
            <ProtectedRoute requireAuth={false}>
              <Layout>
                <Register />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Dashboard sub-pages */}
          <Route path="/applications" element={
            <ProtectedRoute>
              <Layout>
                <Applications />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/saved-jobs" element={
            <ProtectedRoute>
              <Layout>
                <SavedJobs />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/profile" element={
            <ProtectedRoute>
              <Layout>
                <CandidateProfile />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/employer/jobs" element={
            <ProtectedRoute>
              <Layout>
                <EmployerJobs />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/employer/applications" element={
            <ProtectedRoute>
              <Layout>
                <EmployerApplications />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Protected routes for user pages */}
          <Route path="/notifications" element={
            <ProtectedRoute>
              <Layout>
                <Notifications />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Layout>
                <Settings />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Public routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="jobs/:id" element={<JobDetails />} />
            <Route path="companies" element={<Companies />} />
            <Route path="companies/:id" element={<CompanyDetails />} />
            <Route path="candidates" element={<Candidates />} />
            <Route path="candidates/:username" element={<CandidateDetails />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:slug" element={<BlogDetails />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="help" element={<Help />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="terms" element={<TermsConditions />} />
            <Route path="privacy" element={<PrivacyPolicy />} />
            <Route path="cookies" element={<Cookies />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
