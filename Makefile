#!make
MAKEFLAGS += --silent
include .env

NODE = node
NPM = npm

ccred=\033[0;31m
ccyellow=\033[0;33m
ccend=\033[0m

YARN = yarn

DEV_IP = 157.245.58.60
DEV_DIR_PATH = /var/www/rentus_be
DEV_DEPLOY_BRANCH = main

all: deploy_develop

deploy_develop: print_detail deploy_dev clean

print_detail:
	@echo "...${ccred}STARTING DEPLOY${ccend}..."

deploy_dev:
	@echo "...${ccyellow}Connecting DEV_IP server${ccend}..."
	@ssh root@${DEV_IP} -t "source .nvm/nvm.sh \
		&& source .profile \
		&& source .bashrc \
		&& cd ${DEV_DIR_PATH} \
		&& git pull origin ${DEV_DEPLOY_BRANCH} --no-edit \
		&& $(NPM) i -g pm2 \
		&& $(YARN) \
		&& $(YARN) run build \
		&& pm2 reload ecosystem.config.js \
		&& exit"
	@echo "...${ccred}Deploy API server done${ccend}..."
	@echo "${ccred}==============================${ccend}"

clean:
	@echo "${ccyellow}Deploy done${ccend}"