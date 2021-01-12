import React from 'react'
import UpdateRestaurant from '../components/UpdateRestaurant'
import Navbar from '../components/Navbar';
const UpdatePage = () => {
    return (
        <div>
            <Navbar/>
            <h1 className="text-center">Uaktualnij dane restauracji</h1>
            <UpdateRestaurant/>
        </div>
    )
}

export default UpdatePage
