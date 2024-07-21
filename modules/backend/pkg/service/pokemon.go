package service

import (
	"fmt"
	"net/http"
	"os"

	"github.com/HanNguyen-dev/keeper/modules/backend/pkg/common"
	"github.com/HanNguyen-dev/keeper/modules/backend/pkg/domain"
)

var (
	POKEMON_URL = os.Getenv("POKEMON_URL")
)

type PokemonService struct {
}

type IPokemonService interface {
	GetPokemon(id string) (domain.Pokemon, error)
}

func (ns *PokemonService) GetPokemon(id string) (domain.Pokemon, error) {
	url := fmt.Sprintf("%s/%s", POKEMON_URL, id)
	fmt.Printf("Making request to: %s\n", url)
	resp, err := http.Get(url)

	var parsedBody domain.Pokemon

	if err != nil {
		fmt.Print("Http Error: ")
		fmt.Println(err)
		return parsedBody, err
	}

	defer resp.Body.Close()

	return common.ParseBody[domain.Pokemon](resp.Body)
}

func NewPokemonService() *PokemonService {
	return &PokemonService{}
}
