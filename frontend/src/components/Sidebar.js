import React from "react";
import { NavLink } from "react-router-dom";
import { HomeIcon, MagnifyingGlassIcon, PlusCircleIcon, UserIcon, InformationCircleIcon, Cog6ToothIcon, ChatBubbleLeftRightIcon, MapPinIcon } from "@heroicons/react/24/outline";
import logo from "../assets/logo.png";

const navItems = [
  { name: "Home", path: "/home", icon: HomeIcon },
  { name: "Explore", path: "/explore", icon: MagnifyingGlassIcon },
  { name: "Update Travel Plan", path: "/travel-plan", icon: MapPinIcon },
  { name: "Create", path: "/create-story", icon: PlusCircleIcon },
  { name: "Profile", path: "/profile", icon: UserIcon },
  { name: "Settings", path: "/settings", icon: Cog6ToothIcon },
  { name: "Live Location", path: "/live-location", icon: MapPinIcon },
  { name: "About", path: "/about", icon: InformationCircleIcon },
];

const Sidebar = () => (
  <aside className="w-20 md:w-64 bg-trippiko-dark text-trippiko-light flex flex-col items-center py-6 min-h-screen">
    <div className="flex items-center justify-center w-full px-4 mb-8">
      <img 
        src={logo} 
        alt="Trippiko Logo" 
        className="w-16 h-16 md:w-20 md:h-20 object-contain" 
      />
    </div>
    <nav className="flex flex-col gap-4 w-full">
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              isActive ? "bg-trippiko-accent text-trippiko-dark font-bold" : "hover:bg-trippiko-card"
            }`
          }
        >
          <item.icon className="w-6 h-6" />
          <span className="hidden md:inline">{item.name}</span>
        </NavLink>
      ))}
    </nav>
  </aside>
);

export default Sidebar;