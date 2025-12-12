FROM node:latest AS front-build

WORKDIR /app

COPY package*.json ./

RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the built React App with Nginx
FROM nginx:latest

RUN rm /etc/nginx/conf.d/default.conf

COPY --from=front-build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]