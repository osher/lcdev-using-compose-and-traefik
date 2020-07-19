FROM node:12-alpine
EXPOSE 3030
WORKDIR /app
COPY index.js ./
COPY node_modules node_modules
ENTRYPOINT ["node", "index.js"]

