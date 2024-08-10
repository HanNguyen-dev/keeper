package main

import (
	"log"

	"github.com/gorilla/websocket"
)

type StreamWriter interface {
	initWriter()
}

type Member struct {
	conn *websocket.Conn
}

func (m *Member) initWriter() {
	defer m.conn.Close()

	for {
		mt, message, err := m.conn.ReadMessage()
		if err != nil {
			log.Println("read failed:", err)
			break
		}

		for member := range members {
			go func() {
				if member != m {
					err = member.conn.WriteMessage(mt, message)

					if err != nil {
						log.Println("write failed:", err)
					}
				}
			}()
		}
	}
}
