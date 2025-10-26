# First stage - build with Node.js
FROM node:alpine as build-stage
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
# RUN npm install @vitejs/plugin-react --save-dev

# Second stage - serve with NGINX
FROM nginx:alpine
COPY --from=build-stage /app/dist /usr/share/nginx/html