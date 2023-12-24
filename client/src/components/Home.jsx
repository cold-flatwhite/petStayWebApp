import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/home.css";
import { useAuth0 } from "@auth0/auth0-react";

function App() {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const navigate = useNavigate();
  const signUp = () => loginWithRedirect({ screen_hint: "signup" });
  const loginAsVisitor = () => {
    navigate("/app");
  };

  return (
    <div className="home-page">
      <div className="home-header">
        <h1>PET STAY</h1>
      </div>
      <div className="home-content">
        <p>Welcome to Pet Stay - Best Place for Pet Sitting!</p>
        <p>
          {isAuthenticated
            ? `Welcome back!`
            : "To access all features, please log in or create an account."}
        </p>
        <div className="buttons">
          {!isAuthenticated && (
            <div>
              <button className="home-btn" onClick={loginWithRedirect}>
                Log In
              </button>
              <button className="home-btn" onClick={signUp}>
                Create Account
              </button>
              <button className="home-btn" onClick={loginAsVisitor}>
                Log In as Visitor
              </button>
            </div>
          )}
          {isAuthenticated && (
            <button className="btn-primary" onClick={() => navigate("/app")}>
              Enter App
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
