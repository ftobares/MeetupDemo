# Birras Meetup

# Backend

Stack utilizado:
  - ExpressJs
  - Morgan
  - Winston
  - Axios
  - Crypto-JS
  - Base de datos Postgresql

API Backend:
Documentación en swagger, se podrá ver accediendo a http://{server}:{port}/api-docs/

El modelo de base de datos se encuentra en \Backend\scripts\db.sql

## Instalación

Para poder ejecutar la aplicación se deberá proporcionar una base de datos postgresql, lo cual deberá configurarse las variables de conexión.
Estas y otras propiedades se podrán configurar desde:
\Backend\birras-service\config.

- database.config.js: Se podran configurar los datos de conexión
- properties.js: Se podrán configurar propiedades generales del proyecto. Aqui se podran verificar las variables de entorno a configurar en el servidor.
- logger.config.js: Se podrá hacer configuraciones del logger, como por ejemplo el push de datos a un servicio en particular (ejemplo AWS Cloudwatch)

Una vez hechas las configuraciones necesarias, desde el root (\Backend\birras-service) ejecutar:
```sh
npm install
```

Luego para levantar la aplicación utilizar en modo desarrollo:
```sh
npm run dev
```

Luego para levantar la aplicación utilizar en modo debug:
```sh
npm run debug
```

# Frontend

Stack utilizado:
  - React (con React Hooks)
  - Material Design

## Instalación

La aplicación, tiene preconfiguradas para el ambiente local las variables de entorno. Las mismas se encuentran en el root en el archivo .env.

En caso de requerirse la modificación de las url del backend, tiempo máximo de sesión, etc, se podrán cambiar alli mismo.

Una base descargado el repo, y configuradas las variables de entorno a gusto, acceder a Frontend\birras-meetup y ejecutar:
```sh
yarn install
```

Para levantar la app ejecutar:
```sh
yarn start
```