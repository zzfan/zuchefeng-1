all: compile view uploaddir

compile:
	coffee -c -o app src/coffee
	coffee -c -o lib src/lib

view:
	cp -r src/views app/

uploaddir:
	mkdir -p public/img/upload
	mkdir -p public/img/thumbnail/128x128
	mkdir -p public/img/thumbnail/256x256

dev:
	node-dev app

server:
	NODE_ENV=production PORT=80  nodejs app
