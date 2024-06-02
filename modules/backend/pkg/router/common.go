package router

import (
	"net/http"
	"strconv"

	"github.com/HanNguyen-dev/keeper/modules/backend/pkg/domain"
	"github.com/HanNguyen-dev/keeper/modules/backend/pkg/service"
	"github.com/gin-gonic/gin"
)

var (
	db                = make(map[string]string)
	accountingService = service.NewAccountingService()
)

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

func SetupRouter() *gin.Engine {
	// Disable Console Color
	// gin.DisableConsoleColor()
	r := gin.Default()

	// Ping test
	r.GET("/ping", func(c *gin.Context) {
		c.String(http.StatusOK, "pong")
	})

	// Get user value
	r.GET("/user/:name", func(c *gin.Context) {
		user := c.Params.ByName("name")
		value, ok := db[user]
		if ok {
			c.JSON(http.StatusOK, gin.H{"user": user, "value": value})
		} else {
			c.JSON(http.StatusOK, gin.H{"user": user, "status": "no value"})
		}
	})

	r.GET("/accounting", handleAccountApi)

	// Authorized group (uses gin.BasicAuth() middleware)
	// Same than:
	// authorized := r.Group("/")
	// authorized.Use(gin.BasicAuth(gin.Credentials{
	//	  "foo":  "bar",
	//	  "manu": "123",
	//}))
	authorized := r.Group("/", gin.BasicAuth(gin.Accounts{
		"foo":  "bar", // user:foo password:bar
		"manu": "123", // user:manu password:123
	}))

	/* example curl for /admin with basicauth header
	   Zm9vOmJhcg== is base64("foo:bar")

		curl -X POST \
	  	http://localhost:8080/admin \
	  	-H 'authorization: Basic Zm9vOmJhcg==' \
	  	-H 'content-type: application/json' \
	  	-d '{"value":"bar"}'
	*/
	authorized.POST("admin", func(c *gin.Context) {
		user := c.MustGet(gin.AuthUserKey).(string)

		// Parse JSON
		var json struct {
			Value string `json:"value" binding:"required"`
		}

		if c.Bind(&json) == nil {
			db[user] = json.Value
			c.JSON(http.StatusOK, gin.H{"status": "ok"})
		}
	})

	return r
}
