import React, { useState, useEffect } from "react";
import { useParams, useHistory, useLocation } from "react-router-dom";
import RestaurantFinder from "../apis/Finder";

const UpdateRestaurant = () => {
  const { id } = useParams();
  let history = useHistory();
  const locat = useLocation();

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [openHour, setOpenHour] = useState("");
  const [closeHour, setCloseHour] = useState("");
  const [tableCounter, setTableCounter] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await RestaurantFinder.get(`/restaurants/${id}`);
      console.log(response.data.data);
      setName(response.data.data.restaurant.nazwa);
      setLocation(response.data.data.restaurant.lokalizacja);
      setPriceRange(response.data.data.restaurant.zakres_cen);
      setOpenHour(response.data.data.restaurant.godzina_otwarcia.substring(0,5));
      setCloseHour(response.data.data.restaurant.godzina_zamkniecia.substring(0,5));
      setTableCounter(response.data.data.restaurant.liczba_stolikow);
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await RestaurantFinder.put(`/restaurants/${id}`, {
        name,
        location,
        priceRange,
        openHour,
        closeHour,
        tableCounter,
      });
      history.push("/");
      history.push(locat.pathname);
    } catch (err) {
      alert(err.response.data.data.err);
      history.push("/");
      history.push(locat.pathname);
    }

  };

  return (
    <div className="mb-4">
      <form action="form-row">
        <div className="form-row">
          <div className="form-group col-4">
            <label htmlFor="name">Nazwa</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              id="name"
              className="form-control"
              type="text"
            />
          </div>

          <div className="form-group col-4">
            <label htmlFor="location">Lokalizacja</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              id="location"
              className="form-control"
              type="text"
            />
          </div>
          <div className="form-group col-4">
            <label htmlFor="name">Liczba stolików</label>
            <input
              value={tableCounter}
              onChange={(e) => setTableCounter(e.target.value)}
              className="form-control"
              id="tableCounter"
              type="number"
              placeholder="tables"
            />
          </div>
          <div className="form-group col-4">
            <label htmlFor="name">Zakres cen</label>

            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="custom-select my-1 mr-sm-2"
            >
              <option value="1">$</option>
              <option value="2">$$</option>
              <option value="3">$$$</option>
              <option value="4">$$$$</option>
              <option value="5">$$$$$</option>
            </select>
          </div>
          <div className="form-group col-4">
            <label htmlFor="name">Godzina otwarcia</label>
            <select
              value={openHour}
              onChange={(e) => setOpenHour(e.target.value)}
              className="custom-select my-1 mr-sm-2"
            >
              <option value="08:00">08:00</option>
              <option value="09:00">09:00</option>
              <option value="10:00">10:00</option>
              <option value="11:00">11:00</option>
              <option value="12:00">12:00</option>
            </select>
          </div>
          <div className="form-group col-4">
          <label htmlFor="name">Godzina zamknięcia</label>
            <select
              value={closeHour}
              onChange={(e) => setCloseHour(e.target.value)}
              className="custom-select my-1 mr-sm-2"
            >
              <option value="18:00">18:00</option>
              <option value="19:00">19:00</option>
              <option value="20:00">20:00</option>
              <option value="21:00">21:00</option>
              <option value="22:00">22:00</option>
            </select>
          </div>
          <button
            type="submit"
            onClick={handleSubmit}
            className="btn btn-primary"
          >
            Aktualizuj
        </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateRestaurant;