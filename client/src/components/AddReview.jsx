import React, { useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import RestaurantFinder from '../apis/Finder';

const AddReview = () => {
    const { id } = useParams();
    const location = useLocation();
    const history = useHistory();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [review, setReview] = useState("");
    const [rating, setRating] = useState("");

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        try {
            await RestaurantFinder.post(`/restaurants/${id}/addReview`, {
                email,
                password,
                review,
                rating,
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
        <div className="mb-2">
            <form action="form-row">
                <div className="form-row">
                    <div className="form-group col-5">
                        <label htmlFor="email">Email</label>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" id="email" placeholder="Email" className="form-control" />
                    </div>
                    <div className="form-group col-5">
                        <label htmlFor="password">Hasło</label>
                        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" id="password" placeholder="Hasło" className="form-control" />
                    </div>
                    <div className="form-group col-2">
                        <label htmlFor="rating">Ocena</label>
                        <select value={rating} onChange={(e) => setRating(e.target.value)} id="rating" className="custom-select">
                            <option value="" defaultValue disabled>Ocena</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="Review">Opinia</label>
                    <textarea value={review} onChange={(e) => setReview(e.target.value)} id="Review" className="form-control"></textarea>
                </div>
                <button type="submit" onClick={handleSubmitReview} className="btn btn-primary">
                    Dodaj recenzje
                </button>
            </form>

        </div>
    )
}

export default AddReview
