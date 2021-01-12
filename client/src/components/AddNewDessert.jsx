import React, { useState } from "react";
import { useHistory, useLocation, useParams } from 'react-router-dom';
import RestaurantFinder from "../apis/Finder";


const AddNewDessert = () => {
    const { id } = useParams();
    const [name, setName] = useState("");
    const [sweetness, setSweetness] = useState("");
    const location = useLocation();
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await RestaurantFinder.post(`/restaurants/${id}/desserts`, {
                name,
                sweetness
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
                        <h2>Dodaj nowy deser</h2>
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
                    <div className="form-group col-2">
                        <select
                            value={sweetness}
                            onChange={(e) => setSweetness(e.target.value)}
                            className="custom-select my-1 mr-sm-2"
                        >
                            <option value="" defaultValue disabled hidden>Słodkość</option>
                            <option value="1">Gorzki</option>
                            <option value="2">Gorzko słodki</option>
                            <option value="3">Słodki</option>
                            <option value="4">Bardzo słodko</option>
                            <option value="5">Okropnie słodki</option>
                        </select>
                    </div>
                    <div className="form-group col-1.5">
                        <button onClick={handleSubmit} type="submit" className="btn btn-primary">Dodaj deser</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddNewDessert
