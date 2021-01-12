import React, { useState } from "react";
import { useHistory, useLocation, useParams } from 'react-router-dom';
import RestaurantFinder from "../apis/Finder";
import SweetnessRating from "./SweetnessRating";

const RestaurantDesserts = ({ desserts }) => {
    const [allergens, setAllergens] = useState([]);
    const [newAllergen, setNewAllergen] = useState("");
    const [dessertId, setIdDessert] = useState("");

    const history = useHistory();
    const location = useLocation();

    const { id } = useParams();

    const handleDishSelect = function (id_dessert) {
        const fetchData = async () => {
            try {
                console.log(id_dessert);
                const response = await RestaurantFinder.get(`/restaurants/${id}/desserts/${id_dessert}`);
                console.log(response.data.data.allergens);
                setAllergens(response.data.data.allergens);
                setIdDessert(id_dessert);
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
            await RestaurantFinder.post(`/restaurants/${id}/desserts/${dessertId}`, {
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
                <h1 className="text-center" >Desery</h1>
                <div className="row row-cols-1 mb-2 mr-2">
                    {desserts.map((dessert) => {
                        return (
                            <div
                                key={dessert.id_deser}
                                className="card text-white bg-primary ml-auto mr-auto mb-3"
                                style={{ maxWidth: "45%" }}
                                onClick={() => handleDishSelect(dessert.id_deser)}
                            >
                                <div className="card-header d-flex justify-content-between">
                                    <h4>{dessert.nazwa}</h4>
                                    <p className="card-text"><SweetnessRating rating={dessert.slodkosc} /></p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div style={{ flex: '1' }}>
                <h1 className="text-center" >Alergeny</h1>
                <ul>

                    {allergens && allergens.map((allergen) => {
                        return (
                            <li key={allergen.id_alergen}>
                                {allergen.nazwa}
                            </li>
                        )
                    })}
                </ul>
                {dessertId &&
                    <div className="mb-2">
                        <form action="form-row">
                            <div className="form-row">
                                <div className="form-group col-5">
                                    <label htmlFor="newAllergen">Dodaj nowy alergen</label>
                                    <input value={newAllergen} onChange={(e) => setNewAllergen(e.target.value)} type="text" id="newAllergen" placeholder="alergen" className="form-control" />
                                    <br/>
                                    <button type="submit" className="btn btn-primary" onClick={handleSubmitAlergen}>Dodaj alergen</button>
                                </div>
                            </div>
                        </form>
                    </div>}
            </div>
        </div>
    );
}

export default RestaurantDesserts
