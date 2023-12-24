import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "../style/supplierdetail.css";
import { useAuthToken } from "../AuthTokenContext";

function SupplierDetail() {
  const { id } = useParams();
  const { user } = useAuth0();

  const supplierId = parseInt(id);
  const [supplierDetail, setSupplierDetail] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { accessToken } = useAuthToken();

  useEffect(() => {
    if (accessToken) {
      async function fetchSupplierDetail() {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/suppliers/details/${supplierId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            setSupplierDetail(data);
          } else {
            console.error("Failed to fetch supplier detail");
          }
        } catch (error) {
          console.error("An error occurred:", error);
        }
      }
      fetchSupplierDetail();
    }
  }, [accessToken]);

  const handleBookClick = () => {
    const orderData = {
      userAuth0Id: user.sub,
      supplierId: supplierId,
      orderDate: new Date().toISOString(),
      price: supplierDetail.rate,
    };
    async function sendOrderData() {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/order`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(orderData),
        });

        if (response.ok) {
          console.log("Order placed successfully");
          setShowModal(true);
          setTimeout(() => setShowModal(false), 3000);
        } else {
          console.error("Failed to place order");
        }
      } catch (error) {
        console.error("An error occurred while placing the order:", error);
      }
    }
    sendOrderData();
  };

  return (
    <div className="supplier-detail-container">
      <h1 className="title">Supplier Detail</h1>
      {supplierDetail ? (
        <div className="supplier-card">
          <p className="name">Name👤: {supplierDetail.name}</p>
          <p className="address">Address🏠: {supplierDetail.address}</p>
          <p className="contact">Contact📞: {supplierDetail.phone}</p>
          <p className="email">email✉️: {supplierDetail.email}</p>
          <p className="rate">Price(💲/day): {supplierDetail.rate}</p>
          <p className="experience">
            Experienced🧐: {supplierDetail.experience ? "✅" : "❌"}
          </p>
          <p className="hasChildren">
            hasChildren👶: {supplierDetail.hasChildren ? "✅" : "❌"}
          </p>
          <p className="hasPetSupplies">
            Pet Supplies🐾: {supplierDetail.hasPetSupplies ? "✅" : "❌"}
          </p>
          <div className="book-button-container">
            <button className="book-button" onClick={handleBookClick}>
              Book
            </button>
          </div>
          {showModal && (
            <div className="modal">
              <div className="modal-content">
                <p>Booking successful!</p>
                <button onClick={() => setShowModal(false)}>Close</button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="loading">Loading...</p>
      )}
    </div>
  );
}

export default SupplierDetail;
