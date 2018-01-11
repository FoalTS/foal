#!/usr/bin/env bash

sudo apt-get update

# MySQL
sudo debconf-set-selections <<< 'mysql-server mysql-server/root_password password password'
sudo debconf-set-selections <<< 'mysql-server mysql-server/root_password_again password password'
sudo apt-get install -y mysql-server
echo "create database foal_sequelize_test;" | mysql -u root --password=password

# PostgreSQL
sudo apt-get install -y postgresql
echo "create database foal_sequelize_test;" | sudo -u postgres psql
echo "ALTER USER postgres WITH PASSWORD 'password';"  | sudo -u postgres psql

# Node 8 and npm
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g lerna