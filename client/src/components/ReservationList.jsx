import React from 'react'

const ReservationList = ({ reservations }) => {
    return (
        <>
        <h1 className="text-center">Rezerwacje</h1>
        <div className="row row-cols-3 mb-2">
            {reservations.map((reservation) => {
                return (
                    <div
                        key={reservation.id_rezerwacja}
                        className="card text-white bg-primary ml-auto mr-auto mb-3"
                        style={{ maxWidth: "31%" }}
                    >
                        <div className="card-header d-flex justify-content-between">
                            <span>{reservation.nazwa}</span>
                            <span>{reservation.data.substring(0,10)} {reservation.godzina}</span>
                        </div>
                        <div className="card-body">
                            <p className="card-text">{reservation.komentarz}</p>
                        </div>
                    </div>
                );
            })}
        </div>
        </>
    )
}

export default ReservationList
