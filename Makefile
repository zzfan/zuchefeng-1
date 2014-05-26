all: js view sass

pre:
	mkdir -p public/img/upload

js:
	if [ -a app ]; then rm -r app; fi
	mkdir app
	coffee -c -o app/models src/models
	coffee -c -o app/controllers src/controllers
	coffee -c -o lib src/lib

view:
	cp -r src/views app/

sass:
	sass src/public/sass/main.sass public/css/main.css

dev:
	NODE_ENV=development PORT=3000 node-dev app

server:
	NODE_ENV=production PORT=80  nodejs app
