import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import RestaurantFinder from "../apis/Finder";
import NavBar from '../components/Navbar';
import RestaurantDetails from '../components/RestaurantDetails';
import RestaurantDishes from '../components/RestaurantDishes';
import AddNewDish from '../components/AddNewDish';
import RestaurantDrinks from '../components/RestaurantDrinks';
import AddNewDrink from '../components/AddNewDrink';
import RestaurantDesserts from '../components/RestaurantDesserts';
import AddNewDessert from '../components/AddNewDessert';

const RestaurantDetailPage = () => {
    const { id } = useParams();

    const [dishesList, setDishesList] = useState([]);
    const [dessertsList, setDessertsList] = useState([]);
    const [drinksList, setDrinksList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await RestaurantFinder.get(`/restaurants/${id}`);
                console.log(response);
                setDishesList(response.data.data.dishes);
                setDrinksList(response.data.data.drinks);
                setDessertsList(response.data.data.desserts);
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <NavBar />
            <RestaurantDetails />
            <RestaurantDishes dishes = {dishesList}/>
            <AddNewDish/>
            <RestaurantDesserts desserts = {dessertsList}/>
            <AddNewDessert/>
            <RestaurantDrinks drinks = {drinksList}/>
            <AddNewDrink/>
        </div>
    )
}

export default RestaurantDetailPage
