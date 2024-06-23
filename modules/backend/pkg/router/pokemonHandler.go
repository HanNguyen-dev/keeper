package router

import (
	"net/http"

	"github.com/HanNguyen-dev/keeper/modules/backend/pkg/service"
	"github.com/gin-gonic/gin"
)

var (
	nameService = service.NewPokemonService()
)

func handlePokemonApi(c *gin.Context) {
	id := c.Params.ByName("id")

	resp, err := nameService.GetPokemon(id)

	if err != nil {
		c.String(http.StatusBadRequest, "Error processing your request")
		return
	}

	c.JSON(http.StatusOK, gin.H{"name": resp.Name})

}
