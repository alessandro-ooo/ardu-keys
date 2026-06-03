package automation

import (
	"ardu-keys/services/settings"
	"fmt"

	hook "github.com/robotn/gohook"
)

type AutomationService struct {
}

// func (a *AutomationService) Run() {
//   robotgo.KeyTap("f13")
// }

func (a *AutomationService) LoadSettings() bool {
  settingsService := &settings.SettingsService{};
  _, err := settingsService.GetSettings();

  if err != nil {
    return false;
  }
  return true;
}

func (a *AutomationService) HookEvents(d2, d3, d4, d5 string) {

        hook.Register(hook.KeyDown, []string{d2}, func(e hook.Event) {
            fmt.Println("Pressed d2")
        })

        hook.Register(hook.KeyDown, []string{d3}, func(e hook.Event) {
            fmt.Println("Pressed d3")
        })

        hook.Register(hook.KeyDown, []string{d4}, func(e hook.Event) {
            fmt.Println("Pressed d4")
        })

        hook.Register(hook.KeyDown, []string{d5}, func(e hook.Event) {
            fmt.Println("Pressed d5")
        })

        s := hook.Start()
        go func() {
            <-hook.Process(s)
        }()
    
}