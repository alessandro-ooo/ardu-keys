package automation

import (
	"github.com/go-vgo/robotgo"
)

type AutomationService struct {
}

func (a *AutomationService) Run() {
	robotgo.Type("Hello World")
}