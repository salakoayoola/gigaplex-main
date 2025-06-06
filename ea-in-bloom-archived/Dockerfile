# First stage - build with Node.js
FROM node:alpine as build-stage
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .
RUN npm run build

# Second stage - serve with NGINX
FROM nginx:alpine
# Copy the built app
COPY --from=build-stage /app/dist /usr/share/nginx/html
# No need to copy nginx.conf here as we'll mount it as a volume

# Expose port 80
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]

