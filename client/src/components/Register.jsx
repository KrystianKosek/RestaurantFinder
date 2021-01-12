import React, { useState } from "react";
import { useHistory, useLocation } from 'react-router-dom';
import Finder from "../apis/Finder";

const Register = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const location = useLocation();
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await Finder.post("/register", {
                name,
                email,
                password,
            });
            if (response.status === 201) {
                alert(`Utworzono klienta ${response.data.data.imie}`);
            }
            else {
                alert(response.data.data.err);
            }
            history.push("/");
            history.push(location.pathname);
        } catch (err) {
            // catching error message from response
            console.log(err.response);
            alert(err.response.data.data.err);
        }
    };

    return (
        <div className="mb-4">
            <form action="form-row">
                <div className="form-row">
                    <div className="form-group col-4">
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                            className="form-control"
                            placeholder="Nazwa"
                        />
                    </div>
                    <div className="form-group col-4">
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control"
                            type="email"
                            placeholder="Email"
                        />
                    </div>
                    <div className="form-group col-4">
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-control"
                            type="password"
                            placeholder="Hasło"
                        />
                    </div>
                    <div className="form-group col-5"></div>
                    <button
                        onClick={handleSubmit}
                        type="submit"
                        className="btn btn-primary btn-lg"
                    >
                        Dodaj klienta
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Register
