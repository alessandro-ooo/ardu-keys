package COM

import (
	"bufio"
	"fmt"

	"go.bug.st/serial"
	"go.bug.st/serial/enumerator"
)

type COMService struct {
	port   serial.Port
	reader *bufio.Reader
}

func (c *COMService) FindCOMPortAutomatically() (string, error) {
	// This function will attempt to find the COM port that the Elegoo Uno R3 is connected to by checking the VID and PID of the connected devices.
	// TODO: This is panicking if the COM port is not found. Must not panic and return a message to prompt the user to:
	// 	1. Connect the device
	// 	2. Manually select the COM port.

	ports, err := enumerator.GetDetailedPortsList();

	if err != nil {
		panic("[ERROR WHILE LISTING PORTS]: " + err.Error())
	}

	for _, port := range ports {
		if port.IsUSB {

			// VID and PID for Elegoo Uno R3, which is a clone of Arduino Uno R3. This is used to identify the correct COM port to connect to.
			isElegooUnoR3 := port.VID == "2341" && port.PID == "0043"
			if (isElegooUnoR3) {
				return port.Name, nil
			}
		}
	}
	return "", nil
}

func (c *COMService) ConnectToCOM(port string) bool {
  mode := &serial.Mode{
       BaudRate: 250000,
  }

	serialPort, err := serial.Open(port, mode);
	c.port = serialPort;

	if err != nil {
		fmt.Printf("Failed to open %s: %v\n", port, err)
		return false;
	}

	// Data must be buffered because it's sent in chunks (data is in streams).
	reader := bufio.NewReader(serialPort)
	c.reader = reader
	return true
}

func (c *COMService) ReadData() (string) {
	line, _ := c.reader.ReadString('\n')
	return line
}

func (c *COMService) Close() error {
	if c.port != nil {
		return c.port.Close()
	}
	return nil
}