package router

import (
	"net/http"
	"strconv"

	"github.com/HanNguyen-dev/keeper/modules/backend/pkg/domain"
	"github.com/HanNguyen-dev/keeper/modules/backend/pkg/service"
	"github.com/gin-gonic/gin"
)

var (
	accountingService = service.NewAccountingService()
)

func (router *router) AccountRoute() *router {
	router.R.GET("/accounting", handleAccountApi)
	return router
}

func handleAccountApi(c *gin.Context) {
	var accountParams domain.Accounting

	if c.ShouldBind(&accountParams) == nil {
		cost, costErr := strconv.ParseFloat(accountParams.Cost, 32)
		rate, rateErr := strconv.ParseFloat(accountParams.Rate, 32)
		payoff, payoffErr := strconv.ParseFloat(accountParams.Payoff, 32)

		if costErr != nil || rateErr != nil || payoffErr != nil {
			c.String(http.StatusBadRequest, "Error processing your request")
			return
		}

		c.JSON(
			http.StatusOK,
			gin.H{"npv": accountingService.CalculateNPV(float32(cost), float32(rate), float32(payoff))},
		)
		return
	}
	c.String(http.StatusBadRequest, "Error processing your request")
}
