import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import SupplierDetail from "../components/SupplierDetail";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuthToken } from "../AuthTokenContext";

jest.mock("react-router-dom", () => ({
  useParams: jest.fn(),
}));
jest.mock("@auth0/auth0-react");
jest.mock("../AuthTokenContext");

describe("SupplierDetail Component Tests", () => {
  beforeEach(() => {
    useParams.mockReturnValue({ id: "1" });
    useAuth0.mockReturnValue({ user: { sub: "auth0|123456" } });
    useAuthToken.mockReturnValue({ accessToken: "mocked-token" });

    global.fetch = jest.fn().mockImplementation((url, options) => {
      if (url.includes(`/suppliers/details/1`) && options.method === "GET") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            name: "Supplier A",
            address: "123 Main St",
            phone: "123-456-7890",
            email: "supplier@example.com",
            rate: 100,
            experience: true,
            hasChildren: false,
            hasPetSupplies: true,
          }),
        });
      }
      if (url.includes(`/order`) && options.method === "POST") {
        return Promise.resolve({ ok: true });
      }
      return Promise.reject(new Error("not found"));
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("displays supplier details correctly", async () => {
    render(<SupplierDetail />);

    await waitFor(() => {
        expect(screen.getByText("Name👤: Supplier A")).toBeInTheDocument();
    });
  });

  test("handles booking correctly", async () => {
    render(<SupplierDetail />);

    await waitFor(() => {
      expect(screen.getByText("Book")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Book"));

    // Assert that the modal with booking confirmation is displayed
    await waitFor(() => {
      expect(screen.getByText("Booking successful!")).toBeInTheDocument();
    });
  });

});
