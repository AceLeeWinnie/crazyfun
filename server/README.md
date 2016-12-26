## 部署

### 本地

```
cd server同级目录

tar -cf server.tar server

scp server.tar admin@106.14.61.141:/home/admin/server/target/

```


### 服务器

```
cd /home/admin/server/target

rm -rf server-bak

mv server server-bak

tar -xvf server.tar

cd server

node_modules/.bin/pm2 start bin/server.js

```
