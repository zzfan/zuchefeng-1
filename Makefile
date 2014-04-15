all: compile view

compile:
	coffee -c -o app src/coffee

view:
	cp -r src/views app/
