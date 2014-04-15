all: compile view

compile:
	coffee -c -o app src/coffee
	coffee -c -o lib src/lib

view:
	cp -r src/views app/
