import React, { useEffect, useState } from "react";
import Finder from "../apis/Finder";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import StarRating from './StarRating';

import "bootstrap/dist/css/bootstrap.min.css";

const GetAllClients = (props) => {
    const [clients, setClients] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [reservations, setReservations] = useState([]);

    const [showReviews, setShowReviews] = useState(false);
    const [showReservations, setShowReservations] = useState(false);

    const handleCloseReviewsModal = () => setShowReviews(false);
    const handleCloseReservationModal = () => setShowReservations(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Finder.get("/clients");
                console.log(response);
                setClients(response.data.data.clients);
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, []);

    const handleReviews = async (id_klient) => {
        console.log(id_klient);
        try {
            const response = await Finder.get(`/clients/${id_klient}/reviews`);
            setReviews(response.data.data.reviews);
            setShowReviews(true);
        } catch (err) {
            console.log(err);
        }
    };

    const handleReservations = async (id_klient) => {
        console.log(id_klient);
        try {
            const response = await Finder.get(`/clients/${id_klient}/reservations`);
            setReservations(response.data.data.reservations);
            setShowReservations(true);
        } catch (err) {
            console.log(err);
        }
    };


    return (
        <div>
            <h1 className="text-center display-1">Lista klientów</h1>
            <div className="list-group">
                <table className="table table-hover table-dark">
                    <thead>
                        <tr className="bg-primary text-center">
                            <th scope="col" style={{ width: 150 }}>Nazwa</th>
                            <th scope="col" style={{ width: 200 }}>Email</th>
                            <th scope="col" style={{ width: 50 }}>Recenzje</th>
                            <th scope="col" style={{ width: 50 }}>Rezerwacje</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients &&
                            clients.map((client) => {
                                return (
                                    <tr key={client.id_klient}>
                                        <td className="text-center" style={{ width: 100 }}>{client.nazwa}</td>
                                        <td className="text-center" style={{ width: 200 }}>{client.email}</td>
                                        <td className="text-center" >
                                            <button type="button" className="btn btn-secondary" onClick={() => handleReviews(client.id_klient)} style={{ width: 100 }}>{client.recenzje != null ? client.recenzje : "0"}</button>
                                        </td>
                                        <td className="text-center" >
                                            <button type="button" className="btn btn-secondary" onClick={() => handleReservations(client.id_klient)} style={{ width: 100 }}>{client.rezerwacje != null ? client.rezerwacje : "0"}</button>
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>
            {showReviews && <>
                <div
                    className="d-flex align-items-center justify-content-center"
                    style={{ height: "100vh" }}
                >
                </div>
                <Modal show={true}>
                    <Modal.Header>
                        <Modal.Title>Recenzje</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {reviews.map((review) => {
                            return (
                                <div
                                    key={review.id_opinia}
                                    className="card text-white bg-primary ml-auto mr-auto mb-3"
                                    style={{ maxWidth: "60%" }}
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
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseReviewsModal}>Zamknij okno</Button>
                    </Modal.Footer>
                </Modal>
            </>}
            {showReservations && <>
                <div
                    className="d-flex align-items-center justify-content-center"
                    style={{ height: "100vh" }}
                >
                </div>
                <Modal show={true}>
                    <Modal.Header>
                        <Modal.Title>Rezerwacje</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {reservations.map((reservation) => {
                            return (
                                <div
                                    key={reservation.id_rezerwacja}
                                    className="card text-white bg-primary ml-auto mr-auto mb-3"
                                    style={{ maxWidth: "60%" }}
                                >
                                    <div className="card-header d-flex justify-content-between">
                                        <span>{reservation.nazwa}</span>
                                        <span>{reservation.data.substring(0, 10)} {reservation.godzina}</span>
                                    </div>
                                    <div className="card-body">
                                        <p className="card-text">{reservation.komentarz}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseReservationModal}>Zamknij okno</Button>
                    </Modal.Footer>
                </Modal>
            </>}
        </div>
    )
}

export default GetAllClients
