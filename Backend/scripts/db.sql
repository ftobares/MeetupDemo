/*  DROPS */
--  DROP TABLE IF EXISTS public.user;
--  DROP TABLE IF EXISTS public.user_preferences;
--  DROP TABLE IF EXISTS public.user_meetup;
--  DROP TABLE IF EXISTS public.meetup_category;
--  DROP TABLE IF EXISTS public.categories;
--  DROP TABLE IF EXISTS public.meetups;

/* CREATIONS */

/* MAIN TABLES */
CREATE TABLE public.users (
    user_id                 BIGSERIAL NOT NULL,
    user_email              VARCHAR(100) NOT NULL,
    user_pass               VARCHAR(4000) NOT NULL,
    user_name               VARCHAR(50) NOT NULL,
    user_surname            VARCHAR(50) NOT NULL,
    user_country            BIGINT NOT NULL,
    user_city               BIGINT NOT NULL,
    user_job                BIGINT,
    creation_date           TIMESTAMP DEFAULT now(),
    modification_date       TIMESTAMP,
    PRIMARY KEY (user_id)
);

CREATE TABLE public.meetups (
    meetup_id               BIGSERIAL NOT NULL,
    meetup_owner            BIGINT NOT NULL,
    meetup_title            VARCHAR(100) NOT NULL,
    meetup_date             TIMESTAMP NOT NULL,
    meetup_description      VARCHAR(2000),    
    creation_date           TIMESTAMP DEFAULT now(),
    modification_date       TIMESTAMP
);

CREATE TABLE public.categories (
    category_id             BIGSERIAL NOT NULL,
    category_title          VARCHAR(100) NOT NULL,
    category_hashtag        VARCHAR(50) NOT NULL,
    category_description    VARCHAR(100),
    PRIMARY KEY (category_id)
);

CREATE TABLE public.user_preferences (
    category_id             BIGINT NOT NULL,
    user_id                 BIGINT NOT NULL
    PRIMARY_KEY(category_id, user_id)
);

CREATE TABLE public.app_credentials (
    app_id                  BIGSERIAL NOT NULL,
    app_client              VARCHAR(100) NOT NULL,
    app_secret              VARCHAR(4000) NOT NULL,
    app_name                vARHCAR(50) NOT NULL,
    access_level            INTEGER,
    creation_date           TIMESTAMP DEFAULT now(),
    modification_date       TIMESTAMP,
    PRIMARY KEY (api_id)
);

CREATE TABLE cities (
	city_id 		    SERIAL NOT NULL,
	name 				VARCHAR(100),
	state_id 		    BIGINT,
    latitud             VARCHAR(10),
    longuitud           VARCHAR(10),
	PRIMARY KEY(city_id)
);

CREATE TABLE states (
	state_id 		    SERIAL NOT NULL,
	name 				VARCHAR(100),
	country_id 			BIGINT,
	PRIMARY KEY(state_id)
);

CREATE TABLE countries (
	country_id 		SERIAL NOT NULL,
	name 			VARCHAR(100),
	PRIMARY KEY(country_id)
);

/* RELATION MANY TO MANY TABLES */

CREATE TABLE public.user_meetup (
    user_id                 BIGINT NOT NULL,
    meetup_id               BIGINT NOT NULL,
    attended                BOOLEAN,
    PRIMARY KEY (user_id, meetup_id)
);

CREATE TABLE public.meetup_category (
    meetup_id               BIGINT NOT NULL,
    category_id             BIGINT NOT NULL,
    PRIMARY KEY (meetup_id, category_id)
);

/* INSERT DATOS DE CONFIGURACION BASICA */

INSERT INTO categories (category_title, category_hashtag, category_description) VALUES ('Java', 'JAVA', 'Java version 8 o superior');
INSERT INTO categories (category_title, category_hashtag, category_description) VALUES ('Vinilos', 'VINILOS', 'Vinilos, musica y colecciones');
INSERT INTO categories (category_title, category_hashtag, category_description) VALUES ('Criptomonedas', 'BLOCKCHAIN', 'Bitcoin, Etherum, Litecoin y otras criptos');
INSERT INTO categories (category_title, category_hashtag, category_description) VALUES ('Deportes', 'SPORTS', 'Futbol, Basquet, Handball, Hockey');
INSERT INTO categories (category_title, category_hashtag, category_description) VALUES ('Rock Nacional', 'MUSICANACIONAL', 'Divididos, Los Fabulosos Cadillacs, Los Piojos');

-- Paises
insert into countries (name) values ('Argentina');
-- Provincias
insert into states (name, country_id) values ('Chaco',1);
insert into states (name, country_id) values ('Chubut',1);
insert into states (name, country_id) values ('Córdoba',1);
insert into states (name, country_id) values ('Corrientes',1);
insert into states (name, country_id) values ('Entre Ríos',1);
insert into states (name, country_id) values ('Formosa',1);
insert into states (name, country_id) values ('Jujuy',1);
insert into states (name, country_id) values ('La Pampa',1);
insert into states (name, country_id) values ('La Rioja',1);
insert into states (name, country_id) values ('Mendoza',1);
insert into states (name, country_id) values ('Misiones',1);
insert into states (name, country_id) values ('Neuquén',1);
insert into states (name, country_id) values ('Río Negro',1);
insert into states (name, country_id) values ('Salta',1);
insert into states (name, country_id) values ('San Juan',1);
insert into states (name, country_id) values ('San Luis',1);
insert into states (name, country_id) values ('Santa Cruz',1);
insert into states (name, country_id) values ('Santa Fe',1);
insert into states (name, country_id) values ('Santiago del Estero',1);
insert into states (name, country_id) values ('Tierra del Fuego',1);
insert into states (name, country_id) values ('Tucumán',1);
-- Ciudades / Localidades
insert into cities (name, state_id, latitud, longuitud) values ('La Plata',1,'-34.901909', '-57.951130');
insert into cities (name, state_id, latitud, longuitud) values ('CABA',2,'-34.614500', '-58.446180');
insert into cities (name, state_id, latitud, longuitud) values ('San Fernando del Valle de Catamarca',3,'-28.466829', '-65.772667');
insert into cities (name, state_id, latitud, longuitud) values ('Resistencia',4,'-27.46056', '-58.983886');
insert into cities (name, state_id, latitud, longuitud) values ('Rawson',5,'-43.300158', '-65.10228');
insert into cities (name, state_id, latitud, longuitud) values ('Córdoba',6,'-31.4167', '-64.1833');
insert into cities (name, state_id, latitud, longuitud) values ('Corrientes',7,'-27.4833', '-58.8167');
insert into cities (name, state_id, latitud, longuitud) values ('Paraná',8,'-31.7444', '-60.5175');
insert into cities (name, state_id, latitud, longuitud) values ('Formosa',9,'-26.1847', '-58.1758');
insert into cities (name, state_id, latitud, longuitud) values ('San Salvador de Jujuy',10,'-24.1856', '-65.2994');
insert into cities (name, state_id, latitud, longuitud) values ('Santa Rosa',11,'-36.6203', '-64.2906');
insert into cities (name, state_id, latitud, longuitud) values ('La Rioja',12,'-29.4131', '-66.8558');
insert into cities (name, state_id, latitud, longuitud) values ('Mendoza',13,'-32.8833', '-68.8333');
insert into cities (name, state_id, latitud, longuitud) values ('Posadas',14,'-27.3667', '-55.8969');
insert into cities (name, state_id, latitud, longuitud) values ('Neuquén',15,'-38.9573', '-68.0455');
insert into cities (name, state_id, latitud, longuitud) values ('Viedma',16,'-40.8', '-63');
insert into cities (name, state_id, latitud, longuitud) values ('Salta',17,'-24.7883', '-65.4106');
insert into cities (name, state_id, latitud, longuitud) values ('San Juan',18,'-31.5375', '-68.5364');
insert into cities (name, state_id, latitud, longuitud) values ('San Luis',19,'-33.2994', '-66.3392');
insert into cities (name, state_id, latitud, longuitud) values ('Río Gallegos',20,'-51.6333', '-69.2333');
insert into cities (name, state_id, latitud, longuitud) values ('Santa Fe',21,'-31.6333', '-60.7');
insert into cities (name, state_id, latitud, longuitud) values ('Santiago del Estero',22,'-27.7844', '-64.2669');
insert into cities (name, state_id, latitud, longuitud) values ('Ushuaia',23,'-54.8072', '-68.3044');
insert into cities (name, state_id, latitud, longuitud) values ('San Miguel de Tucumán',24,'-43.3', '-65.1');