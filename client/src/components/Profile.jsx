import React, { useState, useEffect } from "react";
import "../style/profile.css";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuthToken } from "../AuthTokenContext";

export default function Profile() {
  const { accessToken } = useAuthToken();
  const [userInfo, setUserInfo] = useState({
    name: "",
    address: "",
    contact: "",
  });
  const [orders, setOrders] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const { user } = useAuth0();
  const userAuth0Id = user.sub;

  async function getUserInfo() {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/user/${userAuth0Id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.ok) {
      const todo = await response.json();
      return todo;
    } else {
      return null;
    }
  }

  async function updateUerInfo() {
    const userInfoToUpdate = {
      name: userInfo.name,
      contact: userInfo.contact,
      address: userInfo.address,
    };
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/user/${userAuth0Id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(userInfoToUpdate),
        }
      );
      if (response.ok) {
        console.log("User information updated successfully");
      } else {
        console.error("Failed to update user information");
      }
    } catch (error) {
      console.error("Error updating user information:", error);
    }
  }

  async function handleCompleteOrder(orderId) {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/orders/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.ok) {
        console.log("Order marked as completed");
        setOrders(
          orders.map((order) => {
            if (order.id === orderId) {
              return { ...order, completed: true };
            }
            return order;
          })
        );
      } else {
        console.error("Failed to mark order as completed");
      }
    } catch (error) {
      console.error("Error completing order:", error);
    }
  }

  async function getUserOrders() {
    if (!userAuth0Id) return;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/orders/${userAuth0Id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (e) {
      console.error("Failed to fetch user orders:", e);
      return null;
    }
  }

  async function handleDeleteOrder(orderId) {
    console.log("yea");
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/orders/${orderId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.ok) {
        console.log("Order deleted successfully");
        setOrders(orders.filter((order) => order.id !== orderId));
      } else {
        console.error("Failed to delete order");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  }

  useEffect(() => {
    if (accessToken) {
      getUserInfo().then((data) => {
        if (data) {
          setUserInfo({
            name: data.name || "",
            address: data.address || "",
            contact: data.contact || "",
          });
        }
      });
      getUserOrders().then((orders) => {
        if (orders) {
          setOrders(orders);
        }
      });
    }
  }, [accessToken]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setEditMode(false);
    updateUerInfo();
  };

  return (
    <div className="profile-container">
      <div className="user-info">
        <h2>My Profile</h2>
        {!editMode ? (
          <div>
            <p>Username👤: {userInfo.name}</p>
            <p>Address🏠: {userInfo.address}</p>
            <p>Contact📞: {userInfo.contact}</p>
            <button className="profile-button" onClick={handleEdit}>
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={userInfo.name}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={userInfo.address}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="contact"
              placeholder="Contact"
              value={userInfo.contact}
              onChange={handleInputChange}
            />
            <button type="submit">Update Profile</button>
            <button type="profile-button" onClick={handleCancel}>
              Cancel
            </button>
          </form>
        )}
      </div>
      <div className="orders">
        <h2>My Orders</h2>
        <div className="order-list">
          {orders.map((order) => (
            <div key={order.id} className="order-item">
              <div className="order-header">
                <h3>Order ID: {order.id}</h3>
                <span
                  className={`status ${
                    order.completed ? "completed" : "pending"
                  }`}
                >
                  {order.completed ? "Completed" : "Pending"}
                </span>
              </div>
              <div className="order-details">
                <p>Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                <p>Price: ${order.price.toFixed(2)}</p>
              </div>
              <div className="order-actions">
                {!order.completed && (
                  <button onClick={() => handleDeleteOrder(order.id)}>
                    Cancel Order
                  </button>
                )}
                {!order.completed && (
                  <button onClick={() => handleCompleteOrder(order.id)}>
                    Mark as Completed
                  </button>
                )}{" "}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
