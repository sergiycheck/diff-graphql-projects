#!/bin/sh

docker run --name redis-for-cache -p 6382:6379 -d redis 
