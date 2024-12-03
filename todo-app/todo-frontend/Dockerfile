# The first FROM is now a stage called build-stage
FROM node:20 AS build-stage

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm ci

ENV VITE_BACKEND_URL='/api'

RUN npm run build

FROM build-stage AS test

ENV NODE_ENV=test VITE_BACKEND_URL='http://localhost:3000'

RUN npm ci --include=dev

# USER node

RUN npm run test

# This is a new stage, everything before this is gone, except for the files that we want to COPY
FROM nginx:1.25-alpine AS production

# Copy built files to Nginx's HTML directory
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]