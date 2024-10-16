#!/bin/sh

APP_PATH=$(cd `dirname $0`; pwd)
cd $APP_PATH

npm install 
npm run dev 
# nohup npm run dev &
