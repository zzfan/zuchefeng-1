# zuchefeng

http://go.codeschool.com/RzioeA

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

2.6.0 32-bit linux:
http://pan.baidu.com/s/1o62n5Ia

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

## TODO


### 服务器端



#### 邮件服务器
* 邮件激活
* 发邮件验证change password

#### 用户验证功能
* 验证码
* phone number check validation
* views中用到数据的地方要加验证，避免出错
* 品牌验证



#### 稳定，安全
* 数据库访问权限，备份


### 图片服务器



#### 图片上传代码
* 自动创建128x128等目录
* util中easyimage的两个疑点：异步？， img不能用，还要再fs.read一遍
* 前端把尺寸改一下，避免造成服务器压力大
* 文件上传的进度条
* 从预设中选择图片

#### 图片存储和访问架构
* 图像文件的位置，存的有点混乱，规划一下
* 查查cdn的使用
* 可以传很多很多图片，查一下应该存放在什么位置
* ftp上传，并可加入到商品描述中

### 卖家操作
* 编辑器
* 注册淘宝卖家体验
* 卖家统计信息


### 流程， UI

#### 用户操作、体验

* 排序
* 筛选
* 用户可以收藏车，也可以收藏店铺
* 根据IP自动获取地理位置信息
* 面包屑导航，可以点击每一层，进而抛弃其后面的信息
* 设置常用地址

#### UI
* 加入车的详情，包括展示页面和创建页面，更新页面
* detail 要功能丰富, 一个单独页面
* 首页大小不统一
* 首页加上夜脚
* pagenation


#### 流程
* 选择城市补充完整
* 预定流程设计
* index页面的logo，文化，入门指导

### 纯coding

* views存放方式整理一下，以防改在app文件夹里
* 全部coffee化
* 把jade的indent统一调整到2



### 模型设计，数据设计

* 加入价格和车牌号的前段检查，可以使用¥这种格式
* 顾客的model中，增加常用地址们
* 车的模型加上地理位置信息。
* 加上车辆有无保险
* 加上车辆行驶里程数

### 内容
* 图片
* logo
* 优势
* 条款
* 帮助
* 宣传片
