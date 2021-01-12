import React from "react";

const SweetnessRating = ({ rating }) => {
    const sweet = [];
    for (let i = 1; i <= rating; i++) {
        sweet.push(<i key={i}  className="fas fa-candy-cane"></i>);
    }
    return <>{sweet}</>;
};
export default SweetnessRating;