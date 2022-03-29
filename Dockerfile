FROM fnwharbor.enncloud.cn/fnw/nginx-brotli:latest
ADD default_NEW_PRO_ONLINE.conf /etc/nginx/conf.d/
ADD default_DEV.conf /etc/nginx/conf.d/
ADD dist/. /usr/share/nginx/html/

#RUN ["touch","/usr/share/nginx/html/env_config.js"]
CMD ["sh","-c", "cat /etc/nginx/conf.d/default_$ENV.conf > /etc/nginx/conf.d/default.conf; nginx -g \"daemon off;\""]
# cat /usr/share/nginx/html/env/.env_\"$ENV\".js) >> /usr/share/nginx/html/env_config.js;
