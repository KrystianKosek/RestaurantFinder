import React, { useState } from "react";
import { useHistory, useLocation, useParams } from 'react-router-dom';
import RestaurantFinder from "../apis/Finder";

const AddNewDish = () => {
    const { id } = useParams();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const location = useLocation();
    const history = useHistory();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await RestaurantFinder.post(`/restaurants/${id}/dishes`, {
                name,
                description
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
        <div>
            <form action="form-row">
                <div className="form-row">
                    <div className="form-group col-2.5 ml-3">
                        <h2>Dodaj nowe danie</h2>
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
                    <div className="form-group col-4">
                        <input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="form-control"
                            type="text"
                            placeholder="Opis"
                        />
                    </div>
                    <div className="form-group col-1.5">
                        <button onClick={handleSubmit} type="submit" className="btn btn-primary">Dodaj danie</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddNewDish
