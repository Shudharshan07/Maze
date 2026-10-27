
build:
	@npm --prefix ./frontend run build -- --outDir ../backend/dist
	@GOOS=windows go -C backend build -ldflags="-H=windowsgui" -o ../bin/app.exe .
	@bin/app.exe

win:
	@bin/app.exe
	

# python3 -m http.server --directory .