import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RestaurantsContext } from "../context/RestaurantsContext";
import RestaurantFinder from "../apis/Finder";
import Navbar from '../components/Navbar'
import AddEvent from "../components/AddEvent";

const RestaurantEvents = () => {
    const { id } = useParams();
    const { selectedRestaurant, setSelectedRestaurant } = useContext(
        RestaurantsContext
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await RestaurantFinder.get(`/restaurants/${id}`);
                console.log(response);

                setSelectedRestaurant(response.data.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <Navbar/>
            {selectedRestaurant && (
                <>
                    <h1 className="text-center display-1">
                        {selectedRestaurant.restaurant.nazwa}
                    </h1>
                    <AddEvent />
                </>
            )}
        </div>
    )
}

export default RestaurantEvents
