import React from 'react'
import { useHistory } from "react-router-dom";

const Navbar = () => {
    let history = useHistory();

    const handleHomePage = () => {
        history.push("/");
    };

    const handleRegisterPage = () => {
        history.push("/register");
    };

    const handleClientsListPage = () => {
        history.push("/clients");
    };
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <button className="btn" type="submit" onClick={handleHomePage}>Strona główna</button>
                        </li>
                        <li className="nav-item">
                            <button className="btn" type="submit" onClick={handleRegisterPage}>Rejestracja</button>
                        </li>
                        <li className="nav-item">
                            <button className="btn" type="submit" onClick={handleClientsListPage}>Lista klientów</button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
