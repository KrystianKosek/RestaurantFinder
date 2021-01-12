import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RestaurantsContext } from "../context/RestaurantsContext";
import RestaurantFinder from "../apis/Finder";
import StarRating from "../components/StarRating";
import Reviews from "../components/Reviews";
import AddReview from "../components/AddReview";
import NavBar from '../components/Navbar';

const RestaurantReviews = () => {
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
            <NavBar/>
            {selectedRestaurant && (
                <>
                    <h1 className="text-center display-1">
                        {selectedRestaurant.restaurant.nazwa}
                    </h1>
                    <div className="text-center">
                        <StarRating rating={selectedRestaurant.restaurant.srednia_opinia} />
                        <span className="text-warning ml-1">
                            {selectedRestaurant.restaurant.count
                                ? `(${selectedRestaurant.restaurant.count})`
                                : "(0)"}
                        </span>
                    </div>
                    <div className="mt-3">
                        <Reviews reviews={selectedRestaurant.reviews} />
                    </div>
                    <AddReview />
                </>
            )}
        </div>
    );
};

export default RestaurantReviews;