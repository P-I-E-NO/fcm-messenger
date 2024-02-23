FROM node:19-alpine3.16

RUN addgroup auth_grp && adduser -D -S -G auth_grp auth_user

ENV PYTHONUNBUFFERED=1
RUN apk add python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install pip setuptools
RUN apk add gcc g++ make
RUN apk add coreutils

RUN npm i -g typescript
RUN npm i -g nodemon

WORKDIR /code

RUN chown auth_user /code

USER auth_user

RUN mkdir node_modules
COPY --chown=auth_user:auth_grp ./src /code/src
COPY --chown=auth_user:auth_grp ./tests /code/tests
COPY --chown=auth_user:auth_grp jest.config.js .
COPY --chown=auth_user:auth_grp package.json .
COPY --chown=auth_user:auth_grp wait-for .
COPY --chown=auth_user:auth_grp nodemon.json .
COPY --chown=auth_user:auth_grp tsconfig.json .

RUN mkdir tmp
RUN chmod +x ./wait-for
RUN npm i

ENTRYPOINT ["./wait-for", "postgres_db:5432", "--", "nodemon"] # for dev purposes only
