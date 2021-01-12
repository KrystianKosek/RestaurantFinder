import React from "react";
import StarRating from "./StarRating";

const Reviews = ({ reviews }) => {
    return (
        <div className="row row-cols-3 mb-2">
            {reviews.map((review) => {
                return (
                    <div
                        key={review.id_opinia}
                        className="card text-white bg-primary ml-auto mr-auto mb-3"
                        style={{ maxWidth: "32%" }}
                    >
                        <div className="card-header d-flex justify-content-between">
                            <span>{review.nazwa}</span>
                            <span>
                                <StarRating rating={review.gwiazdki} />
                            </span>
                        </div>
                        <div className="card-body">
                            <p className="card-text">{review.ocena}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Reviews;