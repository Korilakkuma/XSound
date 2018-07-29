FROM nginx

LABEL maintainer "Korilakkuma<rilakkuma.san.xjapan@gmail.com>"

COPY . /usr/share/nginx/html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
