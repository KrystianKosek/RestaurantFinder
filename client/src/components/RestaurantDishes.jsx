import React, { useState } from "react";
import { useHistory, useLocation, useParams } from 'react-router-dom';
import RestaurantFinder from "../apis/Finder";

const RestaurantDishes = ({ dishes }) => {

    const [allergens, setAllergens] = useState([]);
    const [newAllergen, setNewAllergen] = useState("");
    const [dishId, setDishId] = useState("");
    const history = useHistory();
    const location = useLocation();

    const { id } = useParams();

    const handleDishSelect = function (dish) {
        const fetchData = async () => {
            try {
                const response = await RestaurantFinder.get(`/restaurants/${id}/dishes/${dish}`);
                console.log(response.data.data.allergens);
                setAllergens(response.data.data.allergens);
                setDishId(dish);
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    };

    const handleSubmitAlergen = async (e) => {
        e.preventDefault();
        console.log(newAllergen);
        try {
            await RestaurantFinder.post(`/restaurants/${id}/dishes/${dishId}`, {
                allergen: newAllergen
            });
            // Refresh page after add review
            history.push("/");
            history.push(location.pathname);
        } catch (error) {
            alert(error.response.data.data.err);
            history.push("/");
            history.push(location.pathname);
        }
    };

    return (
        <div style={{ display: 'flex' }}>
            <div style={{ flex: '1' }}>
                <h1 className="text-center" >Dania główne</h1>
                <div className="row row-cols-1 mb-2">
                    {dishes.map((dish) => {
                        return (
                            <div
                                key={dish.id_dania}
                                className="card text-white bg-primary ml-auto mr-auto mb-3"
                                style={{ maxWidth: "80%" }}
                                onClick={() => handleDishSelect(dish.id_dania)}
                            >
                                <div className="card-header d-flex justify-content-between">
                                    <h3>{dish.nazwa}</h3>
                                </div>
                                <div className="card-body">
                                    <p className="card-text">{dish.opis}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div style={{ flex: '1' }}>
                <h1 className="text-center">Alergeny</h1>
                <ul>
                    {allergens && allergens.map((allergen) => {
                        return (
                            <li key={allergen.id_alergen}>
                                {allergen.nazwa}
                            </li>
                        )
                    })}
                </ul>
                {dishId &&
                    <div className="mb-2">
                        <form action="form-row">
                            <div className="form-row">
                                <div className="form-group col-5">
                                    <label htmlFor="newAllergen">Dodaj nowy alergen</label>
                                    <input value={newAllergen} onChange={(e) => setNewAllergen(e.target.value)} type="text" id="newAllergen" placeholder="alergen" className="form-control" />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary" onClick={handleSubmitAlergen}>Dodaj alergen</button>
                        </form>
                    </div>}
            </div>
        </div>
    );
};
export default RestaurantDishes;