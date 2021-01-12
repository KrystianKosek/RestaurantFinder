SET SEARCH_PATH TO projekt;

CREATE OR REPLACE FUNCTION walidacja_nowej_restauracji ()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    AS $$
    BEGIN
    IF LENGTH(NEW.nazwa) = 0 THEN
        RAISE EXCEPTION 'Nazwa restauracji nie może być pusta.';
    ELSEIF LENGTH(NEW.lokalizacja) = 0 THEN
        RAISE EXCEPTION 'Lokalizacja restauracji nie może być pusta.';
    ELSEIF NEW.liczba_stolikow < 5 THEN
        RAISE EXCEPTION 'Liczba stolikow nie moze byc mniejsza od 5.';
    ELSEIF NEW.zakres_cen < 1 THEN
        RAISE EXCEPTION 'Zakres cen nie moze byc mniejszy od 1.';
    ELSEIF NEW.zakres_cen > 5 THEN
        RAISE EXCEPTION 'Zakres cen nie moze byc większy od 5.';
    ELSEIF NEW.godzina_otwarcia < '08:00' THEN
        RAISE EXCEPTION 'Godzina otwarcia nie moze byc wcześniejsza od 8.';
    ELSEIF NEW.godzina_otwarcia > '12:00' THEN
        RAISE EXCEPTION 'Godzina otwarcia nie moze byc późniejsza od 12.';
    ELSEIF NEW.godzina_zamkniecia < '18:00' THEN
        RAISE EXCEPTION 'Godzina zamknięcia nie moze byc wcześniejsza od 18.';
    ELSEIF NEW.godzina_zamkniecia > '22:00' THEN
        RAISE EXCEPTION 'Godzina zamknięcia nie moze byc późniejsza od 22.';
    ELSEIF NEW.lokalizacja IS NOT NULL THEN
        NEW.lokalizacja := initcap(NEW.lokalizacja);
    END IF;

    RETURN NEW;
    END;
    $$;

CREATE TRIGGER restauracja_wyzwalacz
    BEFORE INSERT OR UPDATE ON restauracja
    FOR EACH ROW EXECUTE PROCEDURE walidacja_nowej_restauracji();


CREATE OR REPLACE FUNCTION walidacja_klienta ()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    AS $$
    BEGIN
    IF (SELECT exists(SELECT * FROM klient WHERE klient.email = NEW.email)) THEN
        RAISE EXCEPTION 'Klient o takim emailu już istnieje!';
    ELSEIF LENGTH(NEW.nazwa) = 0 THEN
        RAISE EXCEPTION 'Nazwa klienta nie może być pusta.';
    ELSEIF LENGTH(NEW.email) = 0 THEN
        RAISE EXCEPTION 'Pole email nie może być puste.';
    ELSEIF NEW.email NOT LIKE '%_@_%._%' THEN
        RAISE EXCEPTION 'Niepoprawny adres email.';
    ELSEIF LENGTH(NEW.haslo) < 3 THEN
        RAISE EXCEPTION 'Haslo musi mieć conajmniej 3 znaki';
    END IF;

    RETURN NEW;
    END;
    $$;

CREATE TRIGGER klient_wyzwalacz
    BEFORE INSERT OR UPDATE ON klient
    FOR EACH ROW EXECUTE PROCEDURE walidacja_klienta();


CREATE OR REPLACE FUNCTION walidacja_recenzji ()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    AS $$
    BEGIN
    IF NEW.gwiazdki < 1 THEN
        RAISE EXCEPTION 'Minimalna ocena to 1.';
    ELSEIF NEW.gwiazdki > 5 THEN
        RAISE EXCEPTION 'Maksymalna ocena to 5.';
    END IF;

    RETURN NEW;
    END;
    $$;

CREATE TRIGGER recenzja_wyzwalacz
    BEFORE INSERT OR UPDATE ON recenzja
    FOR EACH ROW EXECUTE PROCEDURE walidacja_recenzji();


CREATE OR REPLACE FUNCTION walidacja_napoj ()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    AS $$
    BEGIN
    IF LENGTH(NEW.nazwa) = 0 THEN
        RAISE EXCEPTION 'Podaj nazwe napoju';
    ELSEIF NEW.pojemnosc < 1 THEN
        RAISE EXCEPTION 'Nieprawidłowa pojemność napoju';
    END IF;

    RETURN NEW;
    END;
    $$;

CREATE TRIGGER napoj_wyzwalacz
    BEFORE INSERT OR UPDATE ON napoj
    FOR EACH ROW EXECUTE PROCEDURE walidacja_napoj();


CREATE OR REPLACE FUNCTION walidacja_danie ()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    AS $$
    BEGIN
    IF LENGTH(NEW.nazwa) = 0 THEN
        RAISE EXCEPTION 'Podaj nazwe dania';
    END IF;

    RETURN NEW;
    END;
    $$;

CREATE TRIGGER danie_wyzwalacz
    BEFORE INSERT OR UPDATE ON danie
    FOR EACH ROW EXECUTE PROCEDURE walidacja_danie();


CREATE OR REPLACE FUNCTION walidacja_deser ()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    AS $$
    BEGIN
    IF LENGTH(NEW.nazwa) = 0 THEN
        RAISE EXCEPTION 'Podaj nazwe deseru';
    ELSEIF NEW.slodkosc < 1 THEN
        RAISE EXCEPTION 'Zbyt niski poziom słodkości';
    ELSEIF NEW.slodkosc > 5 THEN
        RAISE EXCEPTION 'Zbyt wysoki poziom słodkości';
    END IF;

    RETURN NEW;
    END;
    $$;

CREATE TRIGGER deser_wyzwalacz
    BEFORE INSERT OR UPDATE ON deser
    FOR EACH ROW EXECUTE PROCEDURE walidacja_deser();

CREATE OR REPLACE FUNCTION walidacja_alergen ()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    AS $$
    BEGIN
    IF LENGTH(NEW.nazwa) = 0 THEN
        RAISE EXCEPTION 'Podaj nazwe alergenu';
    END IF;

    RETURN NEW;
    END;
    $$;

CREATE TRIGGER alergen_wyzwalacz
    BEFORE INSERT OR UPDATE ON alergen
    FOR EACH ROW EXECUTE PROCEDURE walidacja_alergen();


CREATE OR REPLACE FUNCTION usuwanie_restauracji ()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    AS $$
    BEGIN
    IF TG_OP = 'DELETE' THEN
        DELETE FROM wydarzenie WHERE id_restauracja = OLD.id_restauracja;
        DELETE FROM napoj WHERE id_restauracja = OLD.id_restauracja;
        DELETE FROM alergen_danie WHERE id_dania IN (SELECT id_dania FROM danie WHERE id_restauracja = OLD.id_restauracja);
        DELETE FROM danie WHERE id_restauracja = OLD.id_restauracja;
        DELETE FROM alergen_deser WHERE id_deser IN (SELECT id_deser FROM deser WHERE id_restauracja = OLD.id_restauracja);
        DELETE FROM deser WHERE id_restauracja = OLD.id_restauracja;
        DELETE FROM recenzja WHERE id_restauracja = OLD.id_restauracja;
        DELETE FROM rezerwacja WHERE id_restauracja = OLD.id_restauracja;
    END IF;

    RETURN OLD;
    END;
    $$;

CREATE TRIGGER usuwanie_restauracji_wyzwalacz
    BEFORE DELETE ON restauracja
    FOR EACH ROW EXECUTE PROCEDURE usuwanie_restauracji();

CREATE OR REPLACE FUNCTION walidacja_rezerwacji ()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    AS $$
    BEGIN
        IF (SELECT liczba_stolikow FROM restauracja WHERE id_restauracja = NEW.id_restauracja) > (SELECT COUNT(*) FROM rezerwacja JOIN termin_rezerwacji tr on rezerwacja.id_termin = tr.id_termin WHERE id_restauracja = NEW.id_restauracja AND data = (SELECT data FROM termin_rezerwacji WHERE id_termin = NEW.id_termin) AND godzina = (SELECT godzina FROM termin_rezerwacji WHERE id_termin = NEW.id_termin)) THEN
            RETURN NEW;
        ELSE
            RAISE EXCEPTION 'Wszystkie stoliki na tę godzine są zajete';
        end if;
    END;
    $$;

CREATE TRIGGER rezerwacja_wyzwalacz
    BEFORE INSERT ON rezerwacja
    FOR EACH ROW EXECUTE PROCEDURE walidacja_rezerwacji();


CREATE OR REPLACE FUNCTION walidacja_wydarzenia ()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    AS $$
    BEGIN
    IF LENGTH(NEW.nazwa) = 0 THEN
        RAISE EXCEPTION 'Nazwa wydarzenia nie moze byc pusta.';
    ELSEIF NEW.poczatek > NEW.koniec THEN
        RAISE EXCEPTION 'Zakonczenie wydarzenia nie moze byc przed rozpoczeciem.';
    ELSEIF NEW.termin <= current_date THEN
        RAISE EXCEPTION 'Niepoprawny termin.';
    ELSEIF NEW.poczatek < (SELECT godzina_otwarcia FROM restauracja WHERE id_restauracja = NEW.id_restauracja) THEN
        RAISE EXCEPTION 'Niepoprawna godzina rozpoczecia wydarzenia.';
    ELSEIF NEW.koniec > (SELECT godzina_zamkniecia FROM restauracja WHERE id_restauracja = NEW.id_restauracja) THEN
        RAISE EXCEPTION 'Niepoprawna godzina zakonczenia wydarzenia.';
    END IF;

    RETURN NEW;
    END;
    $$;

CREATE TRIGGER wydarzenie_wyzwalacz
    BEFORE INSERT OR UPDATE ON wydarzenie
    FOR EACH ROW EXECUTE PROCEDURE walidacja_wydarzenia();