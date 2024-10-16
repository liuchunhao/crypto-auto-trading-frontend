#!/bin/sh

APP_PATH=$(cd `dirname $0`; pwd)
cd $APP_PATH

pwd

pid=$(ps -ef | grep npm | grep dev | grep -v grep | awk '{print $2}')
echo pid=$pid

ps -ef | grep npm  | grep dev | grep -v grep | awk '{print $2}' | xargs kill -9 
ps -ef | grep node | grep -v grep | awk '{print $2}' | xargs kill -9 

ps -ef | grep npm | grep dev | grep -v grep 
ps -ef | grep node | grep dev | grep -v grep 