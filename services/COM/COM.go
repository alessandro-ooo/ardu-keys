package COM

import (
	"bufio"

	"github.com/tarm/serial"
)

type COMService struct{}

func (c *COMService) SendData() (string, error) {
	cfg := &serial.Config{Name: "COM3", Baud: 9600}
	s, err := serial.OpenPort(cfg)
	if err != nil {
		return "", err
	}
	defer s.Close()

	reader := bufio.NewReader(s)
	line, err := reader.ReadString('\n')
	if err != nil {
		return "", err
	}

	return line, nil
}