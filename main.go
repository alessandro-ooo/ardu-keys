package main

import (
	"ardu-keys/services/COM"
	"ardu-keys/services/automation"
	"ardu-keys/services/settings"
	"embed"
	_ "embed"
	"fmt"
	"log"

	hook "github.com/robotn/gohook"
	"github.com/wailsapp/wails/v3/pkg/application"
)

// Wails uses Go's `embed` package to embed the frontend files into the binary.
// Any files in the frontend/dist folder will be embedded into the binary and
// made available to the frontend.
// See https://pkg.go.dev/embed for more information.

//go:embed all:frontend/dist
var assets embed.FS

func init() {
	// Register a custom event whose associated data type is string.
	// This is not required, but the binding generator will pick up registered events
	// and provide a strongly typed JS/TS API for them.
	application.RegisterEvent[string]("time")
}

// main function serves as the application's entry point. It initializes the application, creates a window,
// and starts a goroutine that emits a time-based event every second. It subsequently runs the application and
// logs any error that might occur.

func startHook() {
    fmt.Println("starting hook...")

    hook.Register(hook.KeyDown, []string{"q", "ctrl", "shift"}, func(e hook.Event) {
        fmt.Println("ctrl-shift-q")
        hook.End()
    })

    hook.Register(hook.KeyDown, []string{"w"}, func(e hook.Event) {
        fmt.Println("w")
    })

    s := hook.Start()
    <-hook.Process(s)
}

func main() {

	comService := &COM.COMService{};
	automationService := &automation.AutomationService{};
	// Create a new Wails application by providing the necessary options.
	// Variables 'Name' and 'Description' are for application metadata.
	// 'Assets' configures the asset server with the 'FS' variable pointing to the frontend files.
	// 'Bind' is a list of Go struct instances. The frontend has access to the methods of these instances.
	// 'Mac' options tailor the application when running an macOS.
	app := application.New(application.Options{
		Name:        "ardu-keys",
		Description: "A demo of using raw HTML & CSS",
		Services: []application.Service{
			application.NewService(comService),
			application.NewService(automationService),
		},

		Assets: application.AssetOptions{
			Handler: application.AssetFileServerFS(assets),
		},
		Mac: application.MacOptions{
			ApplicationShouldTerminateAfterLastWindowClosed: true,
		},
	})

	// Create a new window with the necessary options.
	// 'Title' is the title of the window.
	// 'Mac' options tailor the window when running on macOS.
	// 'BackgroundColour' is the background colour of the window.
	// 'URL' is the URL that will be loaded into the webview.
	app.Window.NewWithOptions(application.WebviewWindowOptions{
		Title: "Window 1",
		Mac: application.MacWindow{
			InvisibleTitleBarHeight: 50,
			Backdrop:                application.MacBackdropTranslucent,
			TitleBar:                application.MacTitleBarHiddenInset,
		},
		BackgroundColour: application.NewRGB(27, 38, 54),
		URL:              "/",
	})

	// Create a goroutine that emits an event containing the current time every second.
	// The frontend can listen to this event and update the UI accordingly.

	settingsService := &settings.SettingsService{};

	defaultSettings := settingsService.InitializeSettingsService();
	hasSettings := settingsService.HasSettings();

	fmt.Printf("HAS SETTINGS: %v", hasSettings)

	if !hasSettings {
		settingsService.SaveSettings(defaultSettings);
	}

	port, _ := comService.FindCOMPortAutomatically();

	fmt.Print("PORT FOUND")

	comService.ConnectToCOM(port);

	fmt.Print("CONNECTED")

	// TODO: THIS IS BLOCKING!
	// settings, settingsErr := settingsService.GetSettings();

	// fmt.Printf("SEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE loaded: %v", settings)

	// if settingsErr == nil {

		go func() {
			for {
				comService.ReadData("enter", "enter", "enter", "enter");
			}
		}()
	// }

	// automationService.HookEvents(settings.D2, settings.D3, settings.D4, settings.D5);

	// Run the application. This blocks until the application has been exited.
	err := app.Run()

	// If an error occurred while running the application, log it and exit.
	if err != nil {
		log.Fatal(err)
	}
}
