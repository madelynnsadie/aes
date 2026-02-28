# aes
## track your money easily

## **warning**: there is no authentication, do not expose this to the internet </3
## example compose
```yaml
services:
  aes:
    image: ghcr.io/madelynnsadie/aes:latest
    ports:
      - 127.0.0.1:4392:4392
    environment:
      - AES_DB=/aes/db.json
    volumes:
      - ./db:/aes
```