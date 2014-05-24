all: compile view uploaddir sass

compile:
	rm -r app
	# cp -r src/app app # incase some js source file
	coffee -c -o app src/app
	coffee -c -o lib src/lib

view:
	cp -r src/views app/

uploaddir:
	mkdir -p public/img/upload
	mkdir -p public/img/cache

sass:
	sass src/public/sass/main.sass public/css/main.css

dev:
	NODE_ENV=development PORT=3000 node-dev app

server:
	NODE_ENV=production PORT=80  nodejs app
