FROM nginx:1.15.0
MAINTAINER canyuegongzi
EXPOSE 10010
COPY default.conf /etc/nginx/conf.d/
COPY ./build  /usr/share/nginx/html
RUN echo 'build image success!!'
# docker run -d -it --restart=on-failure:3 --name microapp -p 10010:10010 244341b5bc37
# docker build -t microapp:latest .
