## Goal

```
+==================================+
|  +-----------+                   |    +=========+
|  | epFront   |   +--------------+|    | front:  |
|  | -------   |   | front service|---->|  nginx  |
|  |  Path:/   >-->+--------------+|    +=========+
|  |  Path:/api>-->+--------------+|    +=========+    +=========+
|  +-----------+   | svr service  |--+->| svr:    |-+->| db:     |
|traefik           +--------------+| |  |  nodejs | |  |  redis  |
+==================================+ |  +=========+ |  +=========+
docker network                       |              |
- - - - - - - - - - - - - - - - - - \|/ - - - - - - | - - - - - -
developer machine              +=========+          |
                               | svr(lc) |----------+
                               |  nodejs |
                               +=========+
```

Autodetect and decide - when `svr` container is down - route to `svr(lc)`.

## current state of the repo

It is relaying on `file` provider, and apply changes manualy
(docker provider not utilized)

To change between `svr` and `svr(lc)` developer has to update 
`bus/config/dynamic.http.yaml`

from:
```yaml
    svr:
      loadBalancer:
        servers:
          - url: http://svr:3000
          #- url: http://host.docker.internal:3000
```

to:
```yaml
    svr:
      loadBalancer:
        servers:
          #- url: http://svr:3000
          - url: http://host.docker.internal:3000
```

## the challange

We're looking for a setup in which developer should only stop the `svr` container 
to have `traefik` fallback to the `svr(lc)` running on developer machine,
and start the container to have `traefik` ignore developer machine.

## Build

The only thing you have to build is the `svr` container.

Build `svr` container

```
cd svr && npm i && npm run dockerize
```

## run
```
docker-compose up -d
```
