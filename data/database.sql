-- Role: super
-- DROP ROLE IF EXISTS super;
CREATE ROLE super WITH
    LOGIN
    SUPERUSER
    INHERIT
    NOCREATEDB
    NOCREATEROLE
    NOREPLICATION
    ENCRYPTED PASSWORD 'md56bd0f683d28c07fe4d9b1773b698a4e1';
-- password 1


-- Database: test_db
-- DROP DATABASE IF EXISTS test_db;
CREATE DATABASE test_db
    WITH
    OWNER = super
    ENCODING = 'UTF8'
    LC_COLLATE = 'ru_RU.UTF-8'
    LC_CTYPE = 'ru_RU.UTF-8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;


-- SEQUENCE: public.user_table_user_id_seq
-- DROP SEQUENCE IF EXISTS public.user_table_user_id_seq;
CREATE SEQUENCE IF NOT EXISTS public.user_table_user_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1
    OWNED BY user_table.user_id;

ALTER SEQUENCE public.user_table_user_id_seq
    OWNER TO super;


-- Table: public.user_table
-- DROP TABLE IF EXISTS public.user_table;
CREATE TABLE IF NOT EXISTS public.user_table
(
    user_id integer NOT NULL DEFAULT nextval('user_table_user_id_seq'::regclass),
    user_name character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT user_table_pkey PRIMARY KEY (user_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.user_table
    OWNER to super;


-- данные
INSERT INTO user_table (user_id, user_name)
VALUES
('1', 'строка 1'),
('2', 'строка 2'),
('3', 'abcd'),
('4', 'asdf'),
('5', 'edited5');
