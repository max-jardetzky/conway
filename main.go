package main

import (
	"fmt"
	"math/rand"
	"net/http"
	"time"
)

var srv *http.Server

func main() {
	port := ":8081"
	rand.Seed(time.Now().UnixNano())
	srv = &http.Server{Addr: port}

	http.HandleFunc("/conway/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "index.html")
	})

	fmt.Println("Server up!")

	http.Handle("/conway/static/", http.StripPrefix("/conway/static/", http.FileServer(http.Dir("static"))))
	if err := srv.ListenAndServe(); err != nil {
		fmt.Println(err)
	}
}
