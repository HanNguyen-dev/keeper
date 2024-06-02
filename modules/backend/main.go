package main

import (
	"github.com/HanNguyen-dev/keeper/modules/backend/pkg/router"
)

func main() {
	r := router.SetupRouter()
	r.Run(":8080")
}
