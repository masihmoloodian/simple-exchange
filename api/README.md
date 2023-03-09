## Requirements

-   docker
-   docker compose
-   node
-   npm

## Run the application (development, production)
- Application running at port `3000`   
- Swagger running at `/api/doc` path 

### Run the application for development environment

-   method 1:
    Run mysql by `docker` and run application by `npm`

```
cd services/dev
docker compose up -d
cd ../..
npm run start (npm run start:dev for watch-mode)
```

-   method 2:
    Run mysql and application with `docker`

```
docker compose -f docker-compose-dev.yml up -d
```

### Run the application for production environment

Run mysql and application with `docker stack` (replicated-mode, secrets)  
Before get start, inital docker swarm with `docker swarm init ` and join workers if you want (in this example we skip labeling the nodes but its better to lable the nodes and then add the lables to docker-compose file)

Note: Change private registry at both files(`docker-compose-build.yml` and `docker-compose-prod.yml`)

-   1: Set ENV variables as docker secrets:  
    `echo "changeme" | docker secret create mysql_user_secret -`  
    `echo "changeme" | docker secret create mysql_password_secret -`  
    `echo "changeme" | docker secret create mysql_db_secret -`  
    `echo "718ea0f83db84e84002b9f2b51d337a6b0daf366e200ff0a1d08aa60d55ba7e9" | docker secret create crypto_compare_secret -`

-   2: Create Overlay network: `docker network create -d overlay mynet`
-   3: Login to private registry like docker registry `docker login`
-   4: Build image `docker compose -f docker-compose-build.yml build`
-   5: Push image to registry`docker compose -f docker-compose-build.yml push`
-   6: Deploy to cluster `docker stack deploy --with-registry-auth --compose-file docker-compose-prod.yml PROD-exchange-api`

## Run Tests

-   Unit test `npm run test`
-   e2e test `npm run test:e2e`
