import React, { useContext, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { RestaurantsContext } from "../context/RestaurantsContext";
import RestaurantFinder from "../apis/Finder";
import StarRating from "./StarRating";

const RestaurantDetails = () => {
    const { id } = useParams();
    const { selectedRestaurant, setSelectedRestaurant } = useContext(
        RestaurantsContext
    );

    let history = useHistory();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await RestaurantFinder.get(`/restaurants/${id}`);
                setSelectedRestaurant(response.data.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, []);

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

    return (
        <div>
            {selectedRestaurant && (
                <>
                    <h1 className="text-center display-1">
                        {selectedRestaurant.restaurant.nazwa}
                    </h1>
                    <div className="list-group">
                        <table className="table table-hover table-dark">
                            <thead>
                                <tr className="bg-primary">
                                    <th className="text-center" scope="col">Lokalizacja</th>
                                    <th className="text-center" scope="col">Zakres cen</th>
                                    <th className="text-center" scope="col">Recenzje</th>
                                    <th className="text-center" scope="col">Stoliki</th>
                                    <th className="text-center" scope="col">Otwarcie</th>
                                    <th className="text-center" scope="col">Zamknięcie</th>
                                    <th className="text-center" scope="col">Recenzje</th>
                                    <th className="text-center" scope="col">Reserwacje</th>
                                    <th className="text-center" scope="col">Wydarzenia</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="text-center" >{selectedRestaurant.restaurant.lokalizacja}</td>
                                    <td className="text-center" >{"$".repeat(selectedRestaurant.restaurant.zakres_cen)}</td>
                                    <td className="text-center" >{renderRating(selectedRestaurant.restaurant)}</td>
                                    <td className="text-center" >{selectedRestaurant.restaurant.liczba_stolikow}</td>
                                    <td className="text-center" >{selectedRestaurant.restaurant.godzina_otwarcia.substring(0, 5)}</td>
                                    <td className="text-center" >{selectedRestaurant.restaurant.godzina_zamkniecia.substring(0, 5)}</td>
                                    <td className="text-center" >
                                        <button
                                            onClick={(e) => handleReviews(e, selectedRestaurant.restaurant.id_restauracja)}
                                            className="btn btn-info"
                                        >
                                            Recenzje
                                        </button>
                                    </td>
                                    <td className="text-center" >
                                        <button
                                            onClick={(e) => handleReservation(e, selectedRestaurant.restaurant.id_restauracja)}
                                            className="btn btn-primary"
                                        >
                                            Rezerwacje
                                        </button>
                                    </td>
                                    <td className="text-center" >
                                        <button
                                            onClick={(e) => handleEvent(e, selectedRestaurant.restaurant.id_restauracja)}
                                            className="btn btn-primary"
                                        >
                                            Wydarzenia
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    )
}

export default RestaurantDetails
