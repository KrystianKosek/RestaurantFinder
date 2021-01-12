import React from 'react'

const EventsList = ({ events }) => {
    return (
        <>
            <h1 className="text-center">Wydarzenia</h1>
            <div className="row row-cols-3 mb-2">
                {events.map((event) => {
                    return (
                        <div
                            key={event.id_wydarzenie}
                            className="card text-white bg-primary ml-auto mr-auto mb-3"
                            style={{ maxWidth: "31%" }}
                        >
                            <div className="card-header d-flex justify-content-between">
                                <span>{event.nazwa}</span>
                                <span>{event.termin.substring(0,10)}  {event.poczatek.substring(0,5)}-{event.koniec.substring(0,5)}</span>
                            </div>
                            <div className="card-body">
                                <p className="card-text">{event.opis}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    )
}

export default EventsList
