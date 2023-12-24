import React from "react";
import { Outlet, Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "../style/appLayout.css";

export default function AppLayout() {
  const { isLoading, logout } = useAuth0();

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      <div className="app-title">
        <h1>PET STAY</h1>
      </div>
      <div className="header">
        <nav className="menu">
          <ul className="menu-list">
            <li>
              <Link to="/app/finding">Finding a Pet Sitter</Link>
            </li>
            <li>
              <Link to="/app/supplier">Become a Pet Sitter</Link>
            </li>
            <li>
              <Link to="/app/breeds">Dog Breed Information</Link>
            </li>
            <li>
              <Link to="/app/profile">Your Profile</Link>
            </li>
            <li>
              <Link to="/app/debugger">Auth Debugger</Link>
            </li>
            <li>
              <button
                className="exit-button"
                onClick={() => logout({ returnTo: window.location.origin })}
              >
                LogOut
              </button>
            </li>
          </ul>
        </nav>
        <div>Welcome</div>
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}
