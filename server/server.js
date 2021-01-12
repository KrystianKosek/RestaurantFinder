require("dotenv").config();
const express = require("express")
const cors = require("cors")
const db = require("./db");
const morgan = require("morgan");
const app = express();

app.use(morgan("dev"));
app.disable('etag');

app.use(cors());

// Attached body to req from post methods
app.use(express.json());

// Get all Restaurants
app.get("/api/v1/restaurants", async (req, res) => {
    try {
        const restaurantRatingsData = await db.query(
            "SELECT * FROM restauracje;"
        );
        res.status(200).json({
            status: "success",
            results: restaurantRatingsData.rowCount,
            data: {
                restaurants: restaurantRatingsData.rows
            }
        });
    } catch (error) {
        console.log(error);
    }
});

// Get a Restaurant
app.get("/api/v1/restaurants/:id", async (req, res) => {
    try {
        const restaurant = await db.query(
            "SELECT * FROM restauracje WHERE id_restauracja = $1;",
            [req.params.id]
        );

        const reviews = await db.query(
            "SELECT * FROM recenzje WHERE id_restauracja = $1;",
            [req.params.id]
        );

        const dishes = await db.query(
            "SELECT d.id_dania, d.nazwa, d.opis FROM danie d WHERE d.id_restauracja = $1;", [req.params.id]
        );

        const desserts = await db.query(
            "SELECT d.id_deser, d.nazwa, d.slodkosc FROM deser d WHERE d.id_restauracja = $1;", [req.params.id]
        );

        const drinks = await db.query(
            "SELECT n.id_napoju, n.nazwa, n.pojemnosc FROM napoj n WHERE n.id_restauracja = $1;", [req.params.id]
        );

        const reservations = await db.query(
            "SELECT * FROM rezerwacje WHERE id_restauracja = $1;",
            [req.params.id]
        );

        const events = await db.query(
            "SELECT id_wydarzenie, nazwa, termin, poczatek, koniec, opis FROM wydarzenie WHERE id_restauracja = $1 ORDER BY termin, poczatek;",
            [req.params.id]
        );

        for (i = 0; i < reservations.rowCount; i++) {
            reservations.rows[i].data = reservations.rows[i].data.toLocaleString();
        }

        res.status(200).json({
            status: "success",
            data: {
                restaurant: restaurant.rows[0],
                reviews: reviews.rows,
                dishes: dishes.rows,
                desserts: desserts.rows,
                drinks: drinks.rows,
                reservations: reservations.rows,
                events: events.rows
            }
        });
    } catch (error) {
        console.log(error);
        res.status(404).json({
            status: "unsuccess",
            data: {
                err: error.toString()
            },
        });
    }
});

// Get all allergens from dish
app.get("/api/v1/restaurants/:id/dishes/:dishId", async (req, res) => {
    try {
        const allergens = await db.query(
            "SELECT * FROM dania_alergeny WHERE id_dania = $1",
            [req.params.dishId]
        );
        res.status(200).json({
            status: "success",
            data: {
                allergens: allergens.rows
            }
        });
    } catch (error) {
        console.log(error);
        res.status(404).json({
            status: "unsuccess",
            data: {
                err: error.toString()
            },
        });
    }
});

// Get all allergens from dessert
app.get("/api/v1/restaurants/:id/desserts/:dishId", async (req, res) => {
    try {
        const allergens = await db.query(
            "SELECT * FROM desery_alergeny WHERE id_deser = $1",
            [req.params.dishId]
        );
        res.status(200).json({
            status: "success",
            data: {
                allergens: allergens.rows
            }
        });
    } catch (error) {
        console.log(error);
        res.status(404).json({
            status: "unsuccess",
            data: {
                err: error.toString()
            },
        });
    }
});

// Create a new dish
app.post("/api/v1/restaurants/:id/dishes", async (req, res) => {
    try {
        const results = await db.query(
            "INSERT INTO danie (id_restauracja, nazwa, opis) VALUES ($1, $2, $3) RETURNING *",
            [req.params.id, req.body.name, req.body.description]
        );
        res.status(201).json({
            status: "success",
            data: {
                dish: results.rows[0],
            },
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            status: "unsuccess",
            data: {
                err: err.toString()
            },
        });
    }
});

// Create a new dessert
app.post("/api/v1/restaurants/:id/desserts", async (req, res) => {
    try {
        const results = await db.query(
            "INSERT INTO deser (id_restauracja, nazwa, slodkosc) VALUES ($1, $2, $3) RETURNING *",
            [req.params.id, req.body.name, req.body.sweetness]
        );
        res.status(201).json({
            status: "success",
            data: {
                dish: results.rows[0],
            },
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            status: "unsuccess",
            data: {
                err: err.toString()
            },
        });
    }
});


// Create a new drink
app.post("/api/v1/restaurants/:id/drink", async (req, res) => {
    try {
        const results = await db.query(
            "INSERT INTO napoj (id_restauracja, nazwa, pojemnosc) VALUES ($1, $2, $3) RETURNING *",
            [req.params.id, req.body.name, req.body.capacity]
        );
        res.status(201).json({
            status: "success",
            data: {
                drink: results.rows[0],
            },
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            status: "unsuccess",
            data: {
                err: err.toString()
            },
        });
    }
});

// Create a new event
app.post("/api/v1/restaurants/:id/events", async (req, res) => {
    try {
        const result = await db.query(
            "INSERT INTO wydarzenie (id_restauracja, nazwa, termin, poczatek, koniec, opis) VALUES ($1, $2, $3, $4, $5, $6);",
            [req.params.id, req.body.name, req.body.date, req.body.start, req.body.end, req.body.description]
        );
        res.status(201).json({
            status: "success",
            data: {
                event: result.rows[0],
            },
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            status: "unsuccess",
            data: {
                err: err.toString()
            },
        });
    }
});

// Add new allergen for dish
app.post("/api/v1/restaurants/:id/dishes/:dishId", async (req, res) => {
    try {
        const existClient = await db.query("SELECT exists(SELECT * FROM alergen WHERE nazwa = $1);", [req.body.allergen]);
        var newAllergen = null;
        if (!existClient.rows[0].exists) {
            newAllergen = await db.query(
                "INSERT INTO alergen (nazwa) VALUES ($1) RETURNING *",
                [req.body.allergen]
            );
        } else {
            newAllergen = await db.query("SELECT * FROM alergen WHERE nazwa = $1;", [req.body.allergen]);
        }
        const newAllergenDish = await db.query(
            "INSERT INTO alergen_danie (id_dania, id_alergen) VALUES ($1, $2) RETURNING *",
            [req.params.dishId, newAllergen.rows[0].id_alergen]
        )
        res.status(201).json({
            status: "success",
            data: {
                newAllergen: newAllergen.rows[0]
            }
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: "unsuccess",
            data: {
                err: error.toString()
            },
        });
    }
});

// Add new allergen for dessert
app.post("/api/v1/restaurants/:id/desserts/:dessertId", async (req, res) => {
    try {
        const existClient = await db.query("SELECT exists(SELECT * FROM alergen WHERE nazwa = $1);", [req.body.allergen]);
        var newAllergen = null;
        if (!existClient.rows[0].exists) {
            newAllergen = await db.query(
                "INSERT INTO alergen (nazwa) VALUES ($1) RETURNING *",
                [req.body.allergen]
            );
        } else {
            newAllergen = await db.query("SELECT * FROM alergen WHERE nazwa = $1;", [req.body.allergen]);
        }
        const newAllergenDessert = await db.query(
            "INSERT INTO alergen_deser (id_deser, id_alergen) VALUES ($1, $2) RETURNING *",
            [req.params.dessertId, newAllergen.rows[0].id_alergen]
        )
        res.status(201).json({
            status: "success",
            data: {
                newAllergen: newAllergen.rows[0]
            }
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: "unsuccess",
            data: {
                err: error.toString()
            },
        });
    }
});


// Create a new Restaurant
app.post("/api/v1/restaurants", async (req, res) => {
    try {
        const results = await db.query(
            "INSERT INTO restauracja (nazwa, lokalizacja, zakres_cen, godzina_otwarcia, godzina_zamkniecia, liczba_stolikow) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [req.body.name, req.body.location, req.body.priceRange, req.body.openHour, req.body.closeHour, req.body.tableCounter]
        );
        res.status(201).json({
            status: "success",
            data: {
                restaurant: results.rows[0],
            },
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            status: "unsuccess",
            data: {
                err: err.toString()
            },
        });
    }
});

// Update a Restaurant
app.put("/api/v1/restaurants/:id", async (req, res) => {
    try {
        const results = await db.query(
            "UPDATE restauracja SET nazwa = $1, lokalizacja = $2, zakres_cen = $3, godzina_otwarcia = $4, godzina_zamkniecia = $5, liczba_stolikow = $6 WHERE id_restauracja = $7 RETURNING *",
            [req.body.name, req.body.location, req.body.priceRange, req.body.openHour, req.body.closeHour, req.body.tableCounter, req.params.id]
        );
        res.status(200).json({
            status: "success",
            data: {
                retaurant: results.rows[0],
            },
        });
    } catch (err) {
        res.status(404).json({
            status: "unsuccess",
            data: {
                err: err.toString()
            },
        });
    }
});

// Delete a Restaurant
app.delete("/api/v1/restaurants/:id", async (req, res) => {
    try {
        const deleteRestaurant = await db.query("DELETE FROM restauracja WHERE id_restauracja = $1;", [
            req.params.id,
        ]);
        res.status(204).json({
            status: "success",
        });
    } catch (err) {
        console.log(err);
        res.status(401).json({
            status: "unsuccess",
            data: {
                err: err.toString()
            },
        });
    }
});

// Add a review
app.post("/api/v1/restaurants/:id/addReview", async (req, res) => {
    try {
        const existClient = await db.query("SELECT exists(SELECT * FROM klient WHERE klient.email = $1 AND klient.haslo = $2);", [req.body.email, req.body.password]);
        var client = null;
        if (existClient.rows[0].exists) {
            client = await db.query("SELECT id_klient FROM klient WHERE email = $1 AND haslo = $2", [req.body.email, req.body.password]);
            const newReview = await db.query("INSERT INTO recenzja (id_restauracja, id_klient, ocena, gwiazdki) VALUES ($1, $2, $3, $4) returning *;",
                [req.params.id, client.rows[0].id_klient, req.body.review, req.body.rating]);
            res.status(201).json({
                status: "success",
                data: {
                    review: newReview.rows[0]
                }
            });
        }
        else {
            res.status(400).json({
                status: "unsuccess",
                data: {
                    err: "Niepoprawne haslo bądź email"
                }
            })
        }
    } catch (error) {
        console.log(error);
    }
});

// Add a new client
app.post("/api/v1/register", async (req, res) => {
    try {
        const newClient = await db.query("INSERT INTO klient (nazwa, email, haslo) VALUES ($1, $2, $3) RETURNING *;", [req.body.name, req.body.email, req.body.password]);
        res.status(201).json({
            status: "success",
            data: {
                imie: newClient.rows[0].nazwa
            }
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: "unsuccess",
            data: {
                err: error.toString()
            }
        });
    }
});

// Get all clients
app.get("/api/v1/clients", async (req, res) => {
    try {
        const clientsList = await db.query("SELECT * FROM klienci;");
        res.status(200).json({
            status: "success",
            results: clientsList.rowCount,
            data: {
                clients: clientsList.rows
            }
        });
    } catch (error) {
        console.log(error);
    }
});

// Get client reviews
app.get("/api/v1/clients/:id_klient/reviews", async (req, res) => {
    try {
        const reviews = await db.query("SELECT * FROM recenzje_klienta WHERE id_klient = $1;",
            [req.params.id_klient]
        );
        res.status(200).json({
            status: "success",
            results: reviews.rowCount,
            data: {
                reviews: reviews.rows
            }
        });
    } catch (error) {
        console.log(error);
        res.status(404).json({
            status: "unsuccess",
            data: {
                err: error.toString()
            }
        });
    }
});

// Get client reservations
app.get("/api/v1/clients/:id_klient/reservations", async (req, res) => {
    try {
        const reservations = await db.query("SELECT * FROM rezerwacje_klienta WHERE id_klient = $1;",
            [req.params.id_klient]
        );

        for (i = 0; i < reservations.rowCount; i++) {
            reservations.rows[i].data = reservations.rows[i].data.toLocaleString();
        }

        res.status(200).json({
            status: "success",
            results: reservations.rowCount,
            data: {
                reservations: reservations.rows
            }
        });
    } catch (error) {
        console.log(error);
        res.status(404).json({
            status: "unsuccess",
            data: {
                err: error.toString()
            }
        });
    }
});



// Add a new reservation
app.post("/api/v1/restaurants/:id/reservation", async (req, res) => {
    try {
        const existClient = await db.query("SELECT exists(SELECT * FROM klient WHERE klient.email = $1 AND klient.haslo = $2);", [req.body.email, req.body.password]);
        var client = null;
        if (existClient.rows[0].exists) {
            client = await db.query("SELECT id_klient FROM klient WHERE email = $1 AND haslo = $2", [req.body.email, req.body.password]);

            const existTimeDate = await db.query("SELECT exists(SELECT * FROM termin_rezerwacji WHERE data = $1 AND godzina = $2);",
                [req.body.date, req.body.time]);

            var timeDate = null;
            if (existTimeDate.rows[0].exists) {
                timeDate = await db.query("SELECT id_termin FROM termin_rezerwacji WHERE data = $1 AND godzina = $2;",
                    [req.body.date, req.body.time]);
            } else {
                timeDate = await db.query("INSERT INTO termin_rezerwacji (data, godzina) VALUES ($1, $2) RETURNING *;",
                    [req.body.date, req.body.time]);
            }
            try {
                const newReservation = await db.query("INSERT INTO rezerwacja (id_termin, id_restauracja, id_klient, komentarz) VALUES ($1, $2, $3, $4) RETURNING *;",
                    [timeDate.rows[0].id_termin, req.params.id, client.rows[0].id_klient, req.body.comment]);

                res.status(201).json({
                    status: "success",
                    data: {
                        reservation: newReservation.rows[0]
                    }
                });
            } catch (error) {
                res.status(400).json({
                    status: "unsuccess",
                    data: {
                        err: error.toString()
                    }
                })
            }
        }
        else {
            throw "Niepoprawne haslo bądź email";
        }
    } catch (error) {
        console.log(error);
        res.status(404).json({
            status: "unsuccess",
            data: {
                err: error.toString()
            }
        })
    }
});


const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server is up and listening on port ${port}`);
});