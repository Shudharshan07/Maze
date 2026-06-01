package main

import (
	"context"
	"fmt"
	"maze/maze"
	"net"
	"net/http"
	"os/exec"
	"runtime"
	"strconv"
	"time"
)

var server = &http.Server{}

// make this better
func health(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Hello"))
}

func ToRange(a int) uint {
	if a < 0 {
		return 39
	} else if a >= 50 {
		return 49
	}

	return uint(a)
}

func GetMaze(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	query := r.URL.Query()

	width := query.Get("w")
	height := query.Get("h")

	if width == "" || height == "" || len(width) > 2 || len(height) > 2 {
		http.Error(w, "Bad request width or height is not mentioned", http.StatusBadRequest)
		return
	}

	a, err := strconv.Atoi(width)
	if err != nil {
		http.Error(w, "Bad request width is not a proper value", http.StatusBadRequest)
		return
	}

	b, err := strconv.Atoi(height)
	if err != nil {
		http.Error(w, "Bad request height is not a proper value", http.StatusBadRequest)
		return
	}

	maze := maze.NewMaze(ToRange(a), ToRange(b))

	w.Write(maze.ToJson())
}

func OpenInBrowser(url string) {
	if runtime.GOOS == "windows" {
		err := exec.Command("start", url).Run()
		if err != nil {
			err = exec.Command("cmd", "/c", "start", "", url).Run()

			if err != nil {
				fmt.Print(err)
			}
		}
	}
}

func ToHyperLink(text string) string {
	return fmt.Sprintf("\x1b]8;;%s\x1b\\%s\x1b]8;;\x1b\\", text, text)
}

func Close(w http.ResponseWriter, r *http.Request) {
	ctx, stop := context.WithTimeout(context.Background(), 200*time.Millisecond)
	defer stop()

	fmt.Println("1. Attempting shutdown...")
	err := server.Shutdown(ctx)
	if err != nil {
		fmt.Println("Shutdown error:", err)
	}
	fmt.Println("2. Shutdown finished!")

	w.WriteHeader(200)
}

func main() {
	client, err := GetClientHandler()
	if err != nil {
		fmt.Print(err)
		return
	}

	conn, err := net.Listen("tcp", ":0")
	if err != nil {
		fmt.Print(err)
		return
	}
	defer conn.Close()

	port := conn.Addr().(*net.TCPAddr).Port
	url := fmt.Sprintf("http://localhost:%d/", port)

	mux := http.NewServeMux()
	mux.Handle("GET /", client)
	mux.HandleFunc("GET /maze", GetMaze)
	mux.HandleFunc("POST /close", Close)

	server.Handler = mux

	fmt.Println("\x1b[32mServer Started at\x1b[0m", ToHyperLink(url))
	OpenInBrowser(url)
	server.Serve(conn)
}
