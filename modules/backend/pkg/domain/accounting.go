package domain

type Accounting struct {
	Cost   string `form:"cost"`
	Rate   string `form:"rate"`
	Payoff string `form:"payoff"`
}
