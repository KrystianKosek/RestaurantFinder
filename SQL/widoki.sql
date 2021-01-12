SET SEARCH_PATH TO projekt;

CREATE VIEW rezerwacje_klienta AS
    SELECT r.id_klient, r.id_rezerwacja, r.komentarz, res.nazwa, tr.data, tr.godzina FROM rezerwacja AS r
        LEFT JOIN restauracja AS res ON r.id_restauracja = res.id_restauracja
        LEFT JOIN termin_rezerwacji AS tr on r.id_termin = tr.id_termin
            ORDER BY r.id_klient, res.nazwa, tr.data, tr.godzina;
    
CREATE VIEW recenzje_klienta AS
    SELECT id_klient, id_recenzja, gwiazdki, ocena, restauracja.nazwa, recenzja.id_restauracja FROM recenzja
        LEFT JOIN restauracja ON recenzja.id_restauracja = restauracja.id_restauracja
            ORDER BY id_klient, id_restauracja;

CREATE VIEW klienci AS
    SELECT K.id_klient, K.nazwa, K.email, recenzje, rezerwacje FROM klient AS K
        LEFT JOIN (SELECT id_klient, COUNT(*) AS recenzje FROM recenzja AS O GROUP BY id_klient) O ON O.id_klient = K.id_klient
        LEFT JOIN (SELECT id_klient, COUNT(*) AS rezerwacje FROM rezerwacja AS R GROUP BY id_klient) R ON R.id_klient = K.id_klient
            ORDER BY K.id_klient;

CREATE VIEW desery_alergeny AS
    SELECT alergen_deser.id_deser, a.id_alergen, a.nazwa FROM alergen_deser
        INNER JOIN alergen a on a.id_alergen = alergen_deser.id_alergen INNER JOIN deser d on d.id_deser = alergen_deser.id_deser
            ORDER BY id_deser, id_alergen;

CREATE VIEW dania_alergeny AS
    SELECT alergen_danie.id_dania, a.id_alergen, a.nazwa FROM alergen_danie
        INNER JOIN alergen a on a.id_alergen = alergen_danie.id_alergen INNER JOIN danie d on d.id_dania = alergen_danie.id_dania
            ORDER BY id_dania, id_alergen;

CREATE VIEW rezerwacje AS
    SELECT r.id_restauracja, r.id_rezerwacja, r.komentarz, tr.data, tr.godzina, k.nazwa FROM rezerwacja r
        LEFT JOIN (SELECT * FROM termin_rezerwacji tr GROUP BY tr.id_termin) tr ON tr.id_termin = r.id_termin
        LEFT JOIN (SELECT k.id_klient, k.nazwa FROM klient k GROUP BY k.id_klient) k ON k.id_klient = r.id_klient
            ORDER BY r.id_restauracja, tr.data, tr.godzina;

CREATE VIEW recenzje AS
    SELECT id_restauracja, gwiazdki, ocena, klient.id_klient, klient.nazwa, klient.email FROM recenzja
        LEFT JOIN klient ON recenzja.id_klient = klient.id_klient
            ORDER BY id_restauracja;

CREATE VIEW restauracje AS
    SELECT r.id_restauracja, r.nazwa, r.lokalizacja, r.zakres_cen, r.godzina_otwarcia, r.godzina_zamkniecia, r.liczba_stolikow, srednia_opinia, count FROM restauracja AS r
        LEFT JOIN (SELECT id_restauracja, COUNT(*) AS count, TRUNC(AVG(gwiazdki),1) AS srednia_opinia FROM recenzja AS o GROUP BY id_restauracja) o ON r.id_restauracja = o.id_restauracja
            ORDER BY r.id_restauracja;