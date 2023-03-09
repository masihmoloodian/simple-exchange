## Requirements

-   docker
-   docker compose
-   node
-   npm

## Run the application for development environment

-   method 1:
- Run with npm
```
npm i
npm start
```

-   method 2:
    Run with `docker`

```
docker compose -f up
```

### Run the application for production environment

```
npm i
npm run build
```
After build the application use webserver link `nginx` to serv the application  
or use `docker`