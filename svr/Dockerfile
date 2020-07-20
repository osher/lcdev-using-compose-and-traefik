FROM node:12-alpine
ENV WEB_PORT 7001
EXPOSE ${WEB_PORT}
WORKDIR /app
COPY index.js ./
COPY node_modules node_modules
ENTRYPOINT ["node", "index.js"]

