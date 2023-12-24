import React from "react";
import * as ReactDOMClient from "react-dom/client";
import Home from "./components/Home";
import AppLayout from "./components/AppLayout";
import Profile from "./components/Profile";
import Breeds from "./components/Breeds";
import VerifyUser from "./components/VerifyUser";
import NotFound from "./components/NotFound";
import AuthDebugger from "./components/AuthDebugger";
import "./style/index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Finding from "./components/Finding";
import Supplier from "./components/Supplier";
import SupplierDetail from "./components/SupplierDetail";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { AuthTokenProvider } from "./AuthTokenContext";

const container = document.getElementById("root");

const requestedScopes = ["profile", "email"];

function RequireAuth({ children }) {
  const { isAuthenticated, isLoading } = useAuth0();
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
}

const root = ReactDOMClient.createRoot(container);

root.render(
  <Auth0Provider
    domain={process.env.REACT_APP_AUTH0_DOMAIN}
    clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
    authorizationParams={{
      redirect_uri: `${window.location.origin}/verify-user`,
      audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      scope: requestedScopes.join(" "),
    }}
  >
    <AuthTokenProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/verify-user" element={<VerifyUser />} />
          <Route path="app" element={<AppLayout />}>
            <Route path="finding" element={<Finding />} />
            <Route index={true} element={<Breeds />} />
            <Route
              path="profile"
              element={
                <RequireAuth>
                  <Profile />
                </RequireAuth>
              }
            />
            <Route
              path="supplier"
              element={
                <RequireAuth>
                  <Supplier />
                </RequireAuth>
              }
            />
            <Route
              path="suppliers/details/:id"
              element={
                <RequireAuth>
                  <SupplierDetail />
                </RequireAuth>
              }
            />
            <Route
              path="debugger"
              element={
                <RequireAuth>
                  <AuthDebugger />
                </RequireAuth>
              }
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthTokenProvider>
  </Auth0Provider>
);
