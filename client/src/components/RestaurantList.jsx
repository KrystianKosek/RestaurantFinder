import React, { useEffect, useContext } from "react";
import RestaurantFinder from "../apis/Finder";
import { RestaurantsContext } from "../context/RestaurantsContext";
import { useHistory } from "react-router-dom";
import StarRating from "./StarRating";

const RestaurantList = () => {
  const { restaurants, setRestaurants } = useContext(RestaurantsContext);
  let history = useHistory();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await RestaurantFinder.get("/restaurants");
        console.log(response);
        setRestaurants(response.data.data.restaurants);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await RestaurantFinder.delete(`/restaurants/${id}`);
      setRestaurants(
        restaurants.filter((restaurant) => {
          return restaurant.id_restauracja !== id;
        })
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = (e, id) => {
    e.stopPropagation();
    history.push(`/restaurants/${id}/update`);
  };

  const handleRestaurantSelect = (id) => {
    history.push(`/restaurants/${id}`);
  };

  const handleReviews = (e, id) => {
    e.stopPropagation();
    history.push(`/restaurants/${id}/reviews`);
  };

  const handleReservation = (e, id) => {
    e.stopPropagation();
    history.push(`/restaurants/${id}/reservation`);
  }

  const handleEvent = (e, id) => {
    e.stopPropagation();
    history.push(`/restaurants/${id}/events`);
  }

  const renderRating = (restaurant) => {
    if (!restaurant.count) {
      return <span className="text-warning">Brak recenzji</span>;
    }
    return (
      <>
        <StarRating rating={restaurant.srednia_opinia} />
        <span className="text-warning ml-1">({restaurant.count})</span>
      </>
    );
  };
  return (
    <div className="list-group">
      <table className="table table-hover table-dark">
        <thead>
          <tr className="bg-primary">
            <th className="text-center" scope="col">Restauracja</th>
            <th className="text-center" scope="col">Lokalizacja</th>
            <th className="text-center" scope="col">Zakres cen</th>
            <th className="text-center" scope="col">Recenzje</th>
            <th className="text-center" scope="col">Edytuj</th>
            <th className="text-center" scope="col">Usuń</th>
            <th className="text-center" scope="col">Recenzje</th>
            <th className="text-center" scope="col">Rezerwacje</th>
            <th className="text-center" scope="col">Wydarzenia</th>
          </tr>
        </thead>
        <tbody>
          {restaurants &&
            restaurants.map((restaurant) => {
              return (
                <tr
                  onClick={() => handleRestaurantSelect(restaurant.id_restauracja)}
                  key={restaurant.id_restauracja}
                >
                  <td className="text-center" >{restaurant.nazwa}</td>
                  <td className="text-center" >{restaurant.lokalizacja}</td>
                  <td className="text-center" >{"$".repeat(restaurant.zakres_cen)}</td>
                  <td className="text-center" >{renderRating(restaurant)}</td>
                  <td className="text-center" >
                    <button
                      onClick={(e) => handleUpdate(e, restaurant.id_restauracja)}
                      className="btn btn-warning"
                    >
                      Edytuj
                    </button>
                  </td>
                  <td className="text-center" >
                    <button
                      onClick={(e) => handleDelete(e, restaurant.id_restauracja)}
                      className="btn btn-danger"
                    >
                      Usuń
                    </button>
                  </td>
                  <td className="text-center" >
                    <button
                      onClick={(e) => handleReviews(e, restaurant.id_restauracja)}
                      className="btn btn-info"
                    >
                      Recenzje
                    </button>
                  </td>
                  <td className="text-center" >
                    <button
                      onClick={(e) => handleReservation(e, restaurant.id_restauracja)}
                      className="btn btn-primary"
                    >
                      Rezerwacje
                    </button>
                  </td>
                  <td className="text-center" >
                    <button
                      onClick={(e) => handleEvent(e, restaurant.id_restauracja)}
                      className="btn btn-primary"
                    >
                      Wydarzenia
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};
export default RestaurantList;