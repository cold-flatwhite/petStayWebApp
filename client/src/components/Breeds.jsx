import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style/breeds.css";

export default function Breeds() {
  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState(null);
  const [dogInfo, setDogInfo] = useState(null); 
  const [inputName, setInputName] = useState(""); 
  const [dogImageUrl, setDogImageUrl] = useState(null);
  const [showMore, setShowMore] = useState(false); 

  useEffect(() => {
    axios.get("https://api.thedogapi.com/v1/breeds")
      .then((response) => {
        setBreeds(response.data);
      })
      .catch((error) => {
        console.error("Error fetching dog breeds:", error);
      });
  }, []);

  useEffect(() => {
    if (selectedBreed) {
      axios.get(`https://api.thedogapi.com/v1/breeds/search?q=${selectedBreed.name}`)
        .then((response) => {
          if (response.data.length > 0) {
            setDogInfo(response.data[0]);
          } else {
            setDogInfo(null); 
          }
        })
        .catch((error) => {
          console.error("Error fetching dog info:", error);
        });
    }
  }, [selectedBreed]);

  const handleBreedSelect = (breed) => {
    setSelectedBreed(breed);
    axios.get(`https://api.thedogapi.com/v1/images/search?breed_ids=${breed.id}`)
    .then((response) => {
      if (response.data.length > 0) {
        setDogImageUrl(response.data[0].url);
      } else {
        setDogImageUrl(null); 
      }
    })
    .catch((error) => {
      console.error("Error fetching dog image:", error);
    });
  };
  

  const handleNameInputChange = (e) => {
    setInputName(e.target.value);
  };

    const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  const handleSearch = () => {
    if (inputName.trim() !== "") {
      axios.get(`https://api.thedogapi.com/v1/breeds/search?q=${inputName}`)
        .then((response) => {
          if (response.data.length > 0) {
            setSelectedBreed(response.data[0]);
          } else {
            setSelectedBreed(null); 
          }
        })
        .catch((error) => {
          console.error("Error searching for dog:", error);
        });
    }
  };

  return (
    <div className="breeds-container">
      <h2 className="breeds-heading">Dog Breeds</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter a dog's name"
          value={inputName}
          onChange={handleNameInputChange}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="breeds-list">
      {breeds.slice(0, showMore ? breeds.length : 20).map((breed) => (
          <div
            key={breed.id}
            className={`breed-item ${selectedBreed === breed ? "selected" : ""}`}
            onClick={() => handleBreedSelect(breed)}
          >
            {breed.name}
          </div>
        ))}
      </div>
      <button className="toggle-menu-button" onClick={toggleShowMore}>
          {showMore ? "Collapse" : "More..."}
        </button>
      {selectedBreed && (
        <div className="breed-details">
          <h3 className="breed-details-heading">{selectedBreed.name}</h3>
          {dogInfo && (
            <div>
              <p className="breed-description">{dogInfo.description}</p>
              <p className="breed-temperament">Temperament: {dogInfo.temperament}</p>
              <p className="breed-origin">Origin: {dogInfo.origin}</p>
              {dogImageUrl && (
          <img src={dogImageUrl} alt={selectedBreed.name} className="dog-image" />
        )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
