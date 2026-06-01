package main

import (
	"embed"
	"io/fs"
	"net/http"
)

//go:embed dist
var client embed.FS

func GetClientHandler() (http.Handler, error) {
	publicFS, err := fs.Sub(client, "dist")

	if err != nil {
		return nil, err
	}

	handler := http.FileServer(http.FS(publicFS))

	return handler, nil
}
