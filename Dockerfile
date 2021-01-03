FROM nginx:latest
MAINTAINER canyuegongzi
EXPOSE 10010
COPY micro-apps-web/  /usr/local/nginx/dist/
COPY nginx.conf /etc/nginx/nginx.conf
RUN echo 'build image success!!'
# docker run -d -it --restart=on-failure:3 --name microapp -p 10010:10010 244341b5bc37
# docker build -t microapp:latest .
