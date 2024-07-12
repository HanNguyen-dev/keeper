package service

type AccountingService struct {
}

type IAccountingService interface {
	CalculateNPV(cost float32, rate float32, payoff float32) float32
	CalculateAnnuity(cost float32, rate float32, payoff float32) float32
}

func (as *AccountingService) CalculateNPV(cost float32, rate float32, payoff float32) float32 {
	return payoff/(1+rate) - cost
}

func (as *AccountingService) CalculateAnnuity(cost float32, rate float32, payoff float32) float32 {
	return -1
}

func NewAccountingService() *AccountingService {
	return &AccountingService{}
}
