package automation

import (
	"sync"

	hook "github.com/robotn/gohook"
)

type AutomationService struct {
}

var hookOnce sync.Once
func (a *AutomationService) HookEvents(d2, d3, d4, d5 string) {
 hookOnce.Do(func() {
        hook.Register(hook.KeyDown, []string{d2}, func(e hook.Event) {
            
        })

        hook.Register(hook.KeyDown, []string{d3}, func(e hook.Event) {
            
        })

        hook.Register(hook.KeyDown, []string{d4}, func(e hook.Event) {
            
        })

        hook.Register(hook.KeyDown, []string{d5}, func(e hook.Event) {
            
        })

        s := hook.Start()
        go func() {
            <-hook.Process(s)
        }()
    })
}