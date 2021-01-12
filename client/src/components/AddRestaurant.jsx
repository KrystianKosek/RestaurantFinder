import React, { useState, useContext } from "react";
import RestaurantFinder from "../apis/Finder";
import { RestaurantsContext } from "../context/RestaurantsContext";

const AddRestaurant = () => {
  const { addRestaurants } = useContext(RestaurantsContext);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [openHour, setOpenHour] = useState("");
  const [closeHour, setCloseHour] = useState("");
  const [tableCounter, setTableCounter] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await RestaurantFinder.post("/restaurants", {
        name,
        location,
        priceRange,
        openHour,
        closeHour,
        tableCounter
      });
      addRestaurants(response.data.data.restaurant);
    } catch (err) {
      // catching error message from response
      if (err.response.data.data.err.includes("invalid input syntax for integer")) {
        alert("Podaj poprawne dane");
      }
      else {
        alert(err.response.data.data.err);
      }
    }
  };
  return (
    <div className="mb-4">
      <form action="form-row">
        <div className="form-row">
          <div className="form-group col-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              className="form-control"
              placeholder="Nazwa"
            />
          </div>
          <div className="form-group col-4">
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="form-control"
              type="text"
              placeholder="Lokalizacja"
            />
          </div>
          <div className="form-group col-4">
            <input
              value={tableCounter}
              onChange={(e) => setTableCounter(e.target.value)}
              className="form-control"
              type="number"
              placeholder="Liczba stolików"
              min="0"
            />
          </div>
          <div className="form-group col-4">
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="custom-select my-1 mr-sm-2"
            >
              <option value="" defaultValue disabled hidden>Zakres cen</option>
              <option value="1">$</option>
              <option value="2">$$</option>
              <option value="3">$$$</option>
              <option value="4">$$$$</option>
              <option value="5">$$$$$</option>
            </select>
          </div>
          <div className="form-group col-4">
            <select
              value={openHour}
              onChange={(e) => setOpenHour(e.target.value)}
              className="custom-select my-1 mr-sm-2"
            >
              <option value="" defaultValue disabled hidden>Godzina otwarcia</option>
              <option value="08:00">08:00</option>
              <option value="09:00">09:00</option>
              <option value="10:00">10:00</option>
              <option value="11:00">11:00</option>
              <option value="12:00">12:00</option>
            </select>
          </div>
          <div className="form-group col-4">
            <select
              value={closeHour}
              onChange={(e) => setCloseHour(e.target.value)}
              className="custom-select my-1 mr-sm-2"
            >
              <option value="" defaultValue disabled hidden>Godzina zamknięcia</option>
              <option value="18:00">18:00</option>
              <option value="19:00">19:00</option>
              <option value="20:00">20:00</option>
              <option value="21:00">21:00</option>
              <option value="22:00">22:00</option>
            </select>
          </div>

          <div className="form-group col-5">
          </div>
          <button
            onClick={handleSubmit}
            type="submit"
            className="btn btn-primary btn-lg"
          >
            Dodaj restauracje
          </button>
        </div>
      </form>
    </div >
  );
};

export default AddRestaurant;