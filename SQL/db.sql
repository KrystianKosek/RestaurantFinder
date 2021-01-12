CREATE SCHEMA projekt;

CREATE TABLE projekt.alergen (
                id_alergen BIGSERIAL NOT NULL,
                nazwa VARCHAR NOT NULL,
                CONSTRAINT alergen_pk PRIMARY KEY (id_alergen)
);


CREATE TABLE projekt.termin_rezerwacji (
                id_termin BIGSERIAL NOT NULL,
                data DATE NOT NULL,
                godzina TIME NOT NULL,
                CONSTRAINT termin_rezerwacji_pk PRIMARY KEY (id_termin)
);


CREATE TABLE projekt.restauracja (
                id_restauracja BIGSERIAL NOT NULL,
                lokalizacja VARCHAR NOT NULL,
                zakres_cen INTEGER NOT NULL,
                nazwa VARCHAR NOT NULL,
                godzina_otwarcia TIME NOT NULL,
                godzina_zamkniecia TIME NOT NULL,
                liczba_stolikow INTEGER NOT NULL,
                CONSTRAINT restauracja_pk PRIMARY KEY (id_restauracja)
);

CREATE TABLE projekt.wydarzenie (
                id_wydarzenie BIGSERIAL NOT NULL,
                id_restauracja INTEGER NOT NULL,
                nazwa VARCHAR NOT NULL,
                termin DATE NOT NULL,
                poczatek TIME NOT NULL,
                koniec TIME NOT NULL,
                opis VARCHAR,
                CONSTRAINT wydarzenie_pk PRIMARY KEY (id_wydarzenie)
);


CREATE TABLE projekt.deser (
                id_deser BIGSERIAL NOT NULL,
                id_restauracja INTEGER NOT NULL,
                nazwa VARCHAR NOT NULL,
                slodkosc INTEGER NOT NULL,
                CONSTRAINT deser_pk PRIMARY KEY (id_deser)
);


CREATE TABLE projekt.alergen_deser (
                id_deser INTEGER NOT NULL,
                id_alergen INTEGER NOT NULL,
                CONSTRAINT alergen_deser_pk PRIMARY KEY (id_deser, id_alergen)
);


CREATE TABLE projekt.napoj (
                id_napoju BIGSERIAL NOT NULL,
                id_restauracja INTEGER NOT NULL,
                nazwa VARCHAR NOT NULL,
                pojemnosc INTEGER NOT NULL,
                CONSTRAINT napoj_pk PRIMARY KEY (id_napoju)
);


CREATE TABLE projekt.danie (
                id_dania BIGSERIAL NOT NULL,
                id_restauracja INTEGER NOT NULL,
                nazwa VARCHAR NOT NULL,
                opis VARCHAR,
                CONSTRAINT danie_pk PRIMARY KEY (id_dania)
);


CREATE TABLE projekt.alergen_danie (
                id_dania INTEGER NOT NULL,
                id_alergen INTEGER NOT NULL,
                CONSTRAINT alergen_danie_pk PRIMARY KEY (id_dania, id_alergen)
);


CREATE TABLE projekt.klient (
                id_klient BIGSERIAL NOT NULL,
                nazwa VARCHAR NOT NULL,
                haslo VARCHAR NOT NULL,
                email VARCHAR NOT NULL,
                CONSTRAINT klient_pk PRIMARY KEY (id_klient)
);


CREATE TABLE projekt.rezerwacja (
                id_rezerwacja BIGSERIAL NOT NULL,
                id_termin INTEGER NOT NULL,
                id_restauracja INTEGER NOT NULL,
                id_klient INTEGER NOT NULL,
                komentarz VARCHAR NOT NULL,
                CONSTRAINT rezerwacja_pk PRIMARY KEY (id_rezerwacja)
);


CREATE TABLE projekt.recenzja (
                id_recenzja BIGSERIAL NOT NULL,
                id_restauracja INTEGER NOT NULL,
                id_klient INTEGER NOT NULL,
                gwiazdki INTEGER NOT NULL,
                ocena VARCHAR,
                CONSTRAINT recenzja_pk PRIMARY KEY (id_recenzja)
);


ALTER TABLE projekt.alergen_danie ADD CONSTRAINT alergen_alergen_danie_fk
FOREIGN KEY (id_alergen)
REFERENCES projekt.alergen (id_alergen)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE projekt.alergen_deser ADD CONSTRAINT alergen_alergen_deser_fk
FOREIGN KEY (id_alergen)
REFERENCES projekt.alergen (id_alergen)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE projekt.rezerwacja ADD CONSTRAINT godzina_rezerwacji_rezerwacja_fk
FOREIGN KEY (id_termin)
REFERENCES projekt.termin_rezerwacji (id_termin)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE projekt.rezerwacja ADD CONSTRAINT restauracja_rezerwacja_fk
FOREIGN KEY (id_restauracja)
REFERENCES projekt.restauracja (id_restauracja)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE projekt.recenzja ADD CONSTRAINT restauracja_ocena_fk
FOREIGN KEY (id_restauracja)
REFERENCES projekt.restauracja (id_restauracja)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE projekt.danie ADD CONSTRAINT restauracja_danie_fk
FOREIGN KEY (id_restauracja)
REFERENCES projekt.restauracja (id_restauracja)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE projekt.napoj ADD CONSTRAINT restauracja_napoje_fk
FOREIGN KEY (id_restauracja)
REFERENCES projekt.restauracja (id_restauracja)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE projekt.deser ADD CONSTRAINT restauracja_deser_fk
FOREIGN KEY (id_restauracja)
REFERENCES projekt.restauracja (id_restauracja)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;


ALTER TABLE projekt.wydarzenie ADD CONSTRAINT restauracja_wydarzenie_fk
FOREIGN KEY (id_restauracja)
REFERENCES projekt.restauracja (id_restauracja)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;


ALTER TABLE projekt.alergen_deser ADD CONSTRAINT deser_alergen_deser_fk
FOREIGN KEY (id_deser)
REFERENCES projekt.deser (id_deser)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE projekt.alergen_danie ADD CONSTRAINT danie_alergen_danie_fk
FOREIGN KEY (id_dania)
REFERENCES projekt.danie (id_dania)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE projekt.recenzja ADD CONSTRAINT klient_ocena_fk
FOREIGN KEY (id_klient)
REFERENCES projekt.klient (id_klient)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE projekt.rezerwacja ADD CONSTRAINT klient_rezerwacja_fk
FOREIGN KEY (id_klient)
REFERENCES projekt.klient (id_klient)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;