import React from 'react'
import Register from '../components/Register';
import Navbar from '../components/Navbar';

const RegisterPage = () => {
    return (
        <div>
            <Navbar/>
            <h1 className="text-center">Rejestracja</h1>
            <br></br>
            <Register/>
        </div>
    )
}

export default RegisterPage
