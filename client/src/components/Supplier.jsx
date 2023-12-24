import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "../style/supplier.css";
import { useAuthToken } from "../AuthTokenContext";

function Supplier() {
  const { user } = useAuth0();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    rate: "",
    address: "",
    experience: false,
    hasChildren: false,
    hasPetSupplies: false,
    userAuth0Id: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { accessToken } = useAuthToken();
  const userAuth0Id = user.sub;


  const checkRegistration = async () => {
    try {
        const supplierResponse = await fetch(
          `${process.env.REACT_APP_API_URL}/suppliers/byAuth0Id/${userAuth0Id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (!supplierResponse.ok) {
          throw new Error(`HTTP error! status: ${supplierResponse.status}`);
        }
        const supplierData = await supplierResponse.json();
        if (supplierData) {
          setFormData({
            ...formData,
            name: supplierData.name,
            phone: supplierData.phone,
            email: supplierData.email,
            rate: supplierData.rate,
            address: supplierData.address,
            experience: supplierData.experience,
            hasChildren: supplierData.hasChildren,
            hasPetSupplies: supplierData.hasPetSupplies,
            userAuth0Id: userAuth0Id,
          });
          setIsSubmitted(true);
        }
      }
     catch (error) {
      console.error("Error during registration check:", error);
    }
  };

  useEffect(() => {
    if (accessToken) {
      setFormData({
        ...formData,
        userAuth0Id : userAuth0Id
      })
      checkRegistration();
    }
  }, [accessToken]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/supplier`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(formData),
        }
      );
      // const updateUserResponse = await fetch(
      //   `${process.env.REACT_APP_API_URL}/user/substatus/${userAuth0Id}`,
      //   {
      //     method: "PUT",
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${accessToken}`,
      //     },
      //     body: JSON.stringify({ supplyReg: true }),
      //   }
      // );
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };

  return (
    <div className="supplier-container">
      {isSubmitted ? (
        <div>
          <h1>Thank You for Registering!</h1>
          <div className="information-section">
            <h2>Information</h2>
            <ul>
              <li>Name: {formData.name}</li>
              <li>Phone Number: {formData.phone}</li>
              <li>Email: {formData.email}</li>
              <li>Rate: {formData.rate}</li>
              <li>Address: {formData.address}</li>
              <li>
                Experience in Pet Sitting: {formData.experience ? "Yes" : "No"}
              </li>
              <li>
                Has Children at Home: {formData.hasChildren ? "Yes" : "No"}
              </li>
              <li>
                Has Pet Supplies: {formData.hasPetSupplies ? "Yes" : "No"}
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div>
          <h1>Register as a Pet Sitter</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Phone Number:</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Rate (per day):</label>
              <input
                type="text"
                name="rate"
                value={formData.rate}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Address:</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="experience"
                  checked={formData.experience}
                  onChange={handleChange}
                />
                Previous Pet Sitting Experience
              </label>
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="hasChildren"
                  checked={formData.hasChildren}
                  onChange={handleChange}
                />
                Have Children at Home
              </label>
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="hasPetSupplies"
                  checked={formData.hasPetSupplies}
                  onChange={handleChange}
                />
                Have Pet Supplies
              </label>
            </div>
            <button id="register" type="submit">
              Register
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Supplier;
