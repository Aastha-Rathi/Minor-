import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ProfileCreation from "../pages/ProfileCreation";
import Home from "../pages/Home";
import Explore from "../pages/Explore";
import CreateStory from "../pages/CreateStory";
import Profile from "../pages/Profile";
import About from "../pages/About";
import ContactUs from "../pages/ContactUs";
import Settings from "../pages/Settings";
import LiveLocation from "../pages/LiveLocation";
import TravelPlan from "../pages/TravelPlan";

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/profile-creation" element={<ProfileCreation />} />
    <Route path="/home" element={<Home />} />
    <Route path="/explore" element={<Explore />} />
    <Route path="/create-story" element={<CreateStory />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/profile/:userId" element={<Profile />} />
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<ContactUs />} />
    <Route path="/settings" element={<Settings />} />
    <Route path="/live-location" element={<LiveLocation />} />
    <Route path="/travel-plan" element={<TravelPlan />} />
    <Route path="*" element={<Navigate to="/login" />} />
  </Routes>
);

export default AppRoutes;