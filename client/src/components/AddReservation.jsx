import React, { useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import RestaurantFinder from "../apis/Finder";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import setHours from "date-fns/setHours";
import { addDays } from 'date-fns';
import ReservationList from "./ReservationList";

const AddReservation = () => {

    const [startDate, setStartDate] = useState(addDays(new Date(), 1));
    const [minHour, setMinHour] = useState("");
    const [maxHour, setMaxHour] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [comment, setComment] = useState("");
    const [reservations, setReservations] = useState([]);
    const location = useLocation();
    const history = useHistory();
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await RestaurantFinder.get(`/restaurants/${id}`);
                setMinHour(response.data.data.restaurant.godzina_otwarcia.substring(0,2));
                setMaxHour(response.data.data.restaurant.godzina_zamkniecia.substring(0,2));
                setReservations(response.data.data.reservations);
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, []);

    const handleSubmitReservation = async (e) => {
        e.preventDefault();
        var y = startDate.getFullYear();
        var m = startDate.getMonth() + 1;
        var d = startDate.getDate();
        var dateString = y + '-' + m + '-' + d;
        var h = startDate.getHours();
        var timeString = h + ':00';
        try {
            const response = await RestaurantFinder.post(`/restaurants/${id}/reservation`, {
                email,
                password,
                date: dateString,
                time: timeString,
                comment
            });
            console.log(response);
            // Refresh page after add review
            history.push("/");
            history.push(location.pathname);
        } catch (error) {
            console.log(error.response);
            alert(error.response.data.data.err);
            history.push("/");
            history.push(location.pathname);
        }
    };


    return (
        <>
            <div className="mb-2">
                <form action="form-row">
                    <div className="form-row">
                        <div className="form-group col-1"></div>
                        <div className="form-group col-5">
                            <label htmlFor="email">Email</label>
                            <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" id="email" placeholder="Email" className="form-control" />
                            <label htmlFor="password">Hasło</label>
                            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" id="password" placeholder="Hasło" className="form-control" />
                            <label htmlFor="comment">Komentarz</label>
                            <input value={comment} onChange={(e) => setComment(e.target.value)} type="text" id="comment" placeholder="Komentarz" className="form-control" />
                            <button type="submit" onClick={handleSubmitReservation} className="btn btn-primary">
                                Dodaj rezerwacje
                            </button>
                        </div>
                        <div className="form-group col-4">
                            <label htmlFor="date">Data</label><br></br>
                            <DatePicker
                                selected={startDate}
                                onChange={date => setStartDate(date)}
                                showTimeSelect
                                timeFormat="HH"
                                timeIntervals={60}
                                timeCaption="time"
                                dateFormat="Pp"
                                inline
                                minDate={addDays(new Date(), 1)}
                                minTime={setHours(new Date(), minHour)}
                                maxTime={setHours(new Date(), maxHour)}
                                dateFormat="HH:00 d.MM.yyyy"
                            />
                        </div>
                    </div>
                </form>
            </div>
            <ReservationList reservations={reservations}/>
        </>
    );
};

export default AddReservation
