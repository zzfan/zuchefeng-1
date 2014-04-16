# zuchefeng

## Install

### Nodejs & npm
http://nodejs.org/

If you use ubuntu, just follow these steps:
```
sudo apt-get install nodejs
sudo apt-get install npm
```

### MongoDB
https://www.mongodb.org/

For Ubuntu:
```
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
sudo apt-get update
sudo apt-get install mongodb-org
sudo service mongos start
sudo chkconfig mongod on # start at reboot
```
The repo is rather slow, so can just download from official site.

#### rockmongo

##### apache

```
apt-get install apache2
apt-get install php5 libapache2-mod-php5
service apache2 status
/etc/init.d/apache2 status
```

##### php
may need to enable php in apache2.conf

##### php-mongo driver

`apt-get install php5-mongo`

##### download
http://rockmongo.com/

untar it and put it into /var/www

##### configure

in rockmongo/config.php, change password

### imagemagick

apt-get install imagemagick

### Repo

```
git clone http://github.com/lihebi/zuchefeng
cd zuchefeng
npm install
npm install -g coffee-script
make
make dev
```
