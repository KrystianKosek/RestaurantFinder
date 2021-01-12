import React from "react";


const RestaurantDrinks = ({ drinks }) => {
    return (
        <div>
            <h1 className="text-center">Napoje</h1>
            <div className="row row-cols-1 mb-1">
                {drinks.map((drink) => {
                    return (
                        <div
                            className="card text-white bg-primary ml-5"
                            style={{ maxWidth: "15%" }}
                            key={drink.id_napoju}
                        >
                            <div className="card-header d-flex justify-content-between">
                                <span>{drink.nazwa} {drink.pojemnosc}ml</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default RestaurantDrinks
