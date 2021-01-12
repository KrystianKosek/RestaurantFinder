import React from 'react'
import AddRestaurant from '../components/AddRestaurant';
import Header from '../components/Header';
import RestaurantList from '../components/RestaurantList';
import NavBar from '../components/Navbar';

const Home = () => {
    return (
        <div>
            <NavBar/>
            <Header/>
            <AddRestaurant/>
            <RestaurantList/>
        </div>
    );
};

export default Home
