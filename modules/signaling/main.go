package main

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var (
	upgrader = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
	members = make(map[*Member]bool)
)

func handleSignaling(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)

	if err != nil {
		log.Print("Upgraded to ws failed: ", err)
		return
	}

	member := Member{
		conn: conn,
	}
	members[&member] = true
	member.initWriter()
}

func main() {
	http.HandleFunc("/signal", func(w http.ResponseWriter, r *http.Request) {
		handleSignaling(w, r)
	})
	http.ListenAndServe(":8080", nil)
}
