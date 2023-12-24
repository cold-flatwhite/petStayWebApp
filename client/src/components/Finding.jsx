import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import axios from "axios";
import "../style/finding.css";
import { Link } from "react-router-dom";
import { useAuthToken } from "../AuthTokenContext";

function Finding() {
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [formData, setFormData] = useState({
    address: "",
  });
  const [center, setCenter] = useState({ lat: 49.280643, lng: -123.1156906 });
  const { accessToken } = useAuthToken();

  const SupplierMarker = ({ supplier }) => (
    <div
      className="supplier-marker"
      onClick={() => setSelectedSupplier(supplier)}
    >
      <div style={{ marginRight: "5px" }}>🏠</div>
      <div>${supplier.rate}</div>
    </div>
  );

  const HomeMarker = () => (
    <div className="home-marker">
      <div style={{ marginRight: "5px" }}>🏠</div>
      <div>HOME</div>
    </div>
  );

  useEffect(() => {
    if (accessToken) {
      fetchSuppliers().then((suppliersData) => {
        const geocodingPromises = suppliersData.map((supplier) =>
          geocodeAddress(supplier.address).then((location) => ({
            ...supplier,
            lat: location.lat,
            lng: location.lng,
          }))
        );
        Promise.all(geocodingPromises).then((suppliersWithLocation) => {
          console.log("Suppliers with location:", suppliersWithLocation);
          setSuppliers(suppliersWithLocation);
        });
      });
    }
  },[accessToken]);

  const geocodeAddress = (address) => {
    return new Promise((resolve, reject) => {
      const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
      const geocodingApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${apiKey}`;
      axios
        .get(geocodingApiUrl)
        .then((response) => {
          if (response.data.results.length > 0) {
            const location = response.data.results[0].geometry.location;
            resolve(location);
          } else {
            reject("No geocoding result for address");
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  async function fetchSuppliers() {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/suppliers`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch suppliers");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const { address } = formData;
    const geocodingApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`;
    axios
      .get(geocodingApiUrl)
      .then((response) => {
        if (response.data.results.length > 0) {
          const location = response.data.results[0].geometry.location;
          setCenter(location);
        } else {
          console.error("No geocoding result for the address");
        }
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
    setFormData({ address: "" });
  };

  return (
    <div className="finding-container">
      <div className="map-section">
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              placeholder="Enter an address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>
          <button className="finding-button" type="submit">
            Finding a Pet Sitter
          </button>
        </form>
        <div style={{ height: "400px", width: "100%" }}>
          <GoogleMapReact
            bootstrapURLKeys={{
              key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
            }}
            center={center}
            defaultZoom={14}
          >
            <HomeMarker lat={center.lat} lng={center.lng} />

            {suppliers.map((supplier, index) => (
              <SupplierMarker
                supplier={supplier}
                key={index}
                id={supplier.id}
                lat={supplier.lat}
                lng={supplier.lng}
              />
            ))}
          </GoogleMapReact>
        </div>
      </div>
      <div className="supplier-list-section">
        <h2>These are the pets sitters near YOU:</h2>
        {suppliers.map((supplier, index) => (
          <Link
            to={`/app/suppliers/details/${supplier.id}`}
            key={index}
            className="link-no-decoration"
          >
            <div
              key={index}
              className={`supplier-item ${
                selectedSupplier && selectedSupplier.id === supplier.id
                  ? "highlighted"
                  : ""
              }`}
            >
              <div className="supplier-header">
                <h3 className="supplier-name">🏠 {supplier.name}</h3>
                <h4 className="supplier-rate">Price: ${supplier.rate}</h4>
              </div>
              <div
                className={
                  supplier.experience ? "badge badge-green" : "badge badge-red"
                }
              >
                {supplier.experience ? "Experienced" : "No Experience"}
              </div>
              <div
                className={
                  supplier.hasChildren ? "badge badge-red" : "badge badge-green"
                }
              >
                {supplier.hasChildren ? "Has Children" : "No Children"}
              </div>
              <div
                className={
                  supplier.hasPetSupplies
                    ? "badge badge-green"
                    : "badge badge-red"
                }
              >
                {supplier.hasPetSupplies ? "Pet Supplies" : "No Pet Supplies"}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Finding;
