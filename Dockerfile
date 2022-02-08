FROM nginx

COPY . /usr/share/nginx/html

WORKDIR /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
