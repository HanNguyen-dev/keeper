package main

import (
	"github.com/HanNguyen-dev/keeper/modules/backend/pkg/router"
)

func main() {
	r := router.SetupRouter().AccountRoute().PokemonRoute()
	r.R.Run(":8080")
}
