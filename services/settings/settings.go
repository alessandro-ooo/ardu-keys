package settings

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
)
type SettingsService struct {
	defaultSettings JSONSettings
}

type JSONSettings struct {
    D2 string `json:"D2"`
    D3 string `json:"D3"`
    D4 string `json:"D4"`
    D5 string `json:"D5"`
}

var defaultData = JSONSettings {
    D2: "0",
    D3: "0",
    D4: "0",
    D5: "0",
}

func (s* SettingsService) InitializeSettingsService() string {
	s.defaultSettings = defaultData;
	json, _ := json.Marshal(defaultData);
	return string(json);
}

func (s *SettingsService) GetSettings() string {
	homeDir, err := os.UserHomeDir();

	if err != nil {
		fmt.Println("Error getting user home directory:", err);
		return "";
	}

	dir := filepath.Join(homeDir, "Documents", "ardukeys");
	filename := filepath.Join(dir, "settings.json");
	data, err := os.ReadFile(filename)

	if err != nil {
		fmt.Println("Error reading settings file:", err);
		return "";
	}

	return string(data);
}

func (s *SettingsService) SaveSettings(data string) error {
	homeDir, err := os.UserHomeDir();
	if err != nil {
		return err;
	}

	dir := filepath.Join(homeDir, "Documents", "ardukeys");
	err = os.MkdirAll(dir, 0755);
	if err != nil {
		return err;
	}

	filename := filepath.Join(dir, "settings.json");
	return os.WriteFile(filename, []byte(data), 0644);
}

func (s *SettingsService) HasSettings() bool {
	// For whatever reason is possible that the user doesn't have the json saved in his documents.

	hasSettings := len(s.GetSettings()) > 0;
	return hasSettings;
}
