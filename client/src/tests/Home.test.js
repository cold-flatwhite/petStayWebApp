import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import Home from "../components/Home";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

jest.mock("@auth0/auth0-react");
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));


describe("Home Component Tests", () => {
  const mockLoginWithRedirect = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useAuth0.mockReturnValue({
      isAuthenticated: false,
      loginWithRedirect: mockLoginWithRedirect,
      user: { name: "Test User" },
    });
    useNavigate.mockReturnValue(mockNavigate);
  });

  test("renders without crashing and displays welcome message", () => {
    render(<Home />);
    expect(screen.getByText("Welcome to Pet Stay - Best Place for Pet Sitting!")).toBeInTheDocument();
  });

  test("displays login and signup buttons when not authenticated", () => {
    render(<Home />);
    expect(screen.getByText("Log In")).toBeInTheDocument();
    expect(screen.getByText("Create Account")).toBeInTheDocument();
    expect(screen.getByText("Log In as Visitor")).toBeInTheDocument();
  });

  test("displays Enter App button and welcome back message when authenticated", () => {
    useAuth0.mockReturnValueOnce({
      isAuthenticated: true,
      user: { name: "Test User" },
      loginWithRedirect: mockLoginWithRedirect,
    });
    render(<Home />);
    expect(screen.getByText("Enter App")).toBeInTheDocument();
    expect(screen.getByText("Welcome back!")).toBeInTheDocument();
  });

  test("Log In button triggers loginWithRedirect", () => {
    render(<Home />);
    fireEvent.click(screen.getByText("Log In"));
    expect(mockLoginWithRedirect).toHaveBeenCalled();
  });

  test("Create Account button triggers loginWithRedirect with correct parameters", () => {
    render(<Home />);
    fireEvent.click(screen.getByText("Create Account"));
    expect(mockLoginWithRedirect).toHaveBeenCalledWith({ screen_hint: "signup" });
  });

  test("Log In as Visitor button triggers navigation to /app", () => {
    render(<Home />);
    fireEvent.click(screen.getByText("Log In as Visitor"));
    expect(mockNavigate).toHaveBeenCalledWith("/app");
  });

  test("Enter App button triggers navigation when authenticated", () => {
    useAuth0.mockReturnValueOnce({
      isAuthenticated: true,
      loginWithRedirect: mockLoginWithRedirect,
      user: { name: "Test User" },
    });
    render(<Home />);
    fireEvent.click(screen.getByText("Enter App"));
    expect(mockNavigate).toHaveBeenCalledWith("/app");
  });
});
