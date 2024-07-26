FROM node:22.5.1-alpine3.19 AS build
RUN npm install --global pnpm
WORKDIR /build
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY interview/lib/package.json interview/lib/package.json
COPY interview/components/package.json interview/components/package.json
COPY registration/common/package.json registration/common/package.json
RUN pnpm install
COPY configs/ configs/
COPY interview/ interview/
COPY registration/ registration/
WORKDIR /build/registration/common
RUN pnpm exec tsc --build
RUN pnpm webpack


FROM nginx:1.26.0-alpine3.19
COPY configs/nginx.conf /etc/nginx/
COPY --chown=nginx:nginx --from=build /build/registration/common/dist/ /usr/share/nginx/html/
RUN chmod -R u=rwX,g=rX,o=rX /usr/share/nginx/html
