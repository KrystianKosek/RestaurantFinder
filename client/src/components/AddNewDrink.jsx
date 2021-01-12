import React, { useState } from "react";
import { useHistory, useLocation, useParams } from 'react-router-dom';
import RestaurantFinder from "../apis/Finder";

const AddNewDrink = () => {
    const { id } = useParams();
    const [name, setName] = useState("");
    const [capacity, setCapacity] = useState("");
    const location = useLocation();
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await RestaurantFinder.post(`/restaurants/${id}/drink`, {
                name,
                capacity
            });
            history.push("/");
            history.push(location.pathname);
        } catch (err) {
            // catching error message from response
            if (err.response.data.data.err.includes("invalid input syntax for integer")) {
                alert("Podaj poprawne dane");
            }
            else {
                alert(err.response.data.data.err);
            }
            history.push("/");
            history.push(location.pathname);
        }
    };


    return (
        <div className="mt-4">
            <form action="form-row">
                <div className="form-row">
                    <div className="form-group col-2.5 ml-2">
                        <h2>Dodaj nowy napój</h2>
                    </div>
                    <div className="form-group col-3">
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                            className="form-control"
                            placeholder="Nazwa"
                        />
                    </div>
                    <div className="form-group col-3">
                        <input
                            value={capacity}
                            onChange={(e) => setCapacity(e.target.value)}
                            className="form-control"
                            type="text"
                            placeholder="Pojemność"
                        />
                    </div>
                    <div className="form-group col-1.5">
                        <button onClick={handleSubmit} type="submit" className="btn btn-primary">Dodaj napój</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddNewDrink
