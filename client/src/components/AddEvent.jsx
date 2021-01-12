import React, { useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import RestaurantFinder from "../apis/Finder";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays } from 'date-fns';
import EventsList from "./EventsList";

const AddEvent = () => {
    const [openHour, setOpenHour] = useState("");
    const [closeHour, setCloseHour] = useState("");
    const [name, setName] = useState("");
    const [startDate, setStartDate] = useState(addDays(new Date(), 1));
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [description, setDescription] = useState("");
    const [events, setEvents] = useState([]);
    const { id } = useParams();
    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await RestaurantFinder.get(`/restaurants/${id}`);
                setOpenHour(response.data.data.restaurant.godzina_otwarcia.substring(0, 2));
                setCloseHour(response.data.data.restaurant.godzina_zamkniecia.substring(0, 2));
                setEvents(response.data.data.events);
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, []);

    let optionsStart = [];
    optionsStart.push(<option value="" defaultValue hidden>Godzina rozpoczęcia</option>)
    for (let i = openHour; i < closeHour; i++) {
        if (i < 10 && !i.toString().startsWith('0')) {
            optionsStart.push(<option value={`0${i}:00`}>{`0${i}:00`}</option>)
        } else {
            optionsStart.push(<option value={`${i}:00`}>{`${i}:00`}</option>)
        }
    }

    let optionsEnd = [];
    if (start) {
        for (let j = start.substring(0, 2); j <= closeHour; j++) {
            if (j < 10 && !j.toString().startsWith('0')) {
                optionsEnd.push(<option value={`0${j}:00`}>{`0${j}:00`}</option>)
            } else {
                optionsEnd.push(<option value={`${j}:00`}>{`${j}:00`}</option>)
            }
        }
    }


    const handleEventSubbmit = async (e) => {
        e.preventDefault();
        var y = startDate.getFullYear();
        var m = startDate.getMonth() + 1;
        var d = startDate.getDate();
        var dateString = y + '-' + m + '-' + d;
        try {
            const response = await RestaurantFinder.post(`/restaurants/${id}/events`, {
                name,
                date: dateString,
                start,
                end,
                description
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
            <div className="mb-4">
                <form action="form-row">
                    <div className="form-row">
                        <div className="form-group col-1">

                        </div>
                        <div className="form-group col-4">
                            <label htmlFor="name">Nazwa wydarzenia</label>

                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                type="text"
                                className="form-control"
                                placeholder="Nazwa"
                            />
                            <br></br>
                            <label htmlFor="description">Opis</label>
                            <input
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                type="text"
                                className="form-control"
                                placeholder="Opis"
                            />
                        </div>
                        <div className="form-group col-3">
                            <DatePicker
                                selected={startDate}
                                onChange={date => setStartDate(date)}
                                dateFormat="Pp"
                                inline
                                minDate={addDays(new Date(), 1)}
                                dateFormat="d.MM.yyyy"
                            />
                        </div>
                        <div className="form-group col-3">
                            <label htmlFor="start">Godzina rozpoczęcia</label>
                            <select
                                value={start}
                                onChange={(e) => setStart(e.target.value)}
                                className="custom-select my-1 mr-sm-2"
                            >
                                {optionsStart}
                            </select>
                            <br></br>
                            {start && <>
                                <label htmlFor="end">Godzina zakończenia</label>
                                <select
                                    value={end}
                                    onChange={(e) => setEnd(e.target.value)}
                                    className="custom-select my-1 mr-sm-2"
                                >
                                    {optionsEnd}
                                </select> </>}

                        </div>
                        <div className="form-group col-1">

                        </div>
                        <div className="form-group col-5">
                        </div>
                        <div className="form-group col-4">
                            <button type="submit" onClick={handleEventSubbmit} className="btn btn-primary">
                                Dodaj wydarzenie
                            </button>
                        </div>
                    </div>
                </form>
            </div >
            <EventsList events={events} />
        </>
    )
}

export default AddEvent
