package COM

import (
	"bufio"
	"fmt"
	"strings"

	"github.com/go-vgo/robotgo"
	"go.bug.st/serial"
	"go.bug.st/serial/enumerator"
)


type COMService struct {
	port   serial.Port
	reader *bufio.Reader
	isConnectionEstablished bool

	portName string;
}

func (c *COMService) ListCOMPorts() []string {
	ports, err := enumerator.GetDetailedPortsList();

	if err != nil {
		panic("[ERROR WHILE LISTING PORTS]: " + err.Error())
	}

	returnedPorts := []string{};

	for _, port := range ports {
		returnedPorts = append(returnedPorts, port.Name)
	}

	return returnedPorts;
}

func (c *COMService) GetCurrentCOMPortName() string { return c.portName }

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

func (c *COMService) ConnectToCOM(port string) {

	// reset connection state
	c.isConnectionEstablished = false
	c.reader = nil
	c.port = nil

  mode := &serial.Mode{
       BaudRate: 250000,
  }

	serialPort, err := serial.Open(port, mode);
	c.port = serialPort;
	c.portName = port;

	if err != nil {
		fmt.Printf("Failed to open %s: %v\n", port, err)
		c.isConnectionEstablished = false;
		return;
	}

	// Data must be buffered because it's sent in chunks (data is in streams).
	reader := bufio.NewReader(serialPort)
	c.reader = reader
	c.isConnectionEstablished = true;
}

func (c *COMService) ReadData(d2, d3, d4, d5 string) {
	if c.isConnectionEstablished {
		line, _ := c.reader.ReadString('\n');
		
		hasData := len(line) > 0;

		if hasData {
			if strings.Contains(line, "D2") {
				robotgo.KeyTap(d2)
			}
			if strings.Contains(line, "D3") {
				robotgo.KeyTap(d3)
			}
			if strings.Contains(line, "D4") {
				robotgo.KeyTap(d4)
			}
			if strings.Contains(line, "D5") {
				robotgo.KeyTap(d5)
			}
		}
	}
}

func (c *COMService) CloseConnection() error {
	if c.port != nil {
		c.isConnectionEstablished = false;
		return c.port.Close()
	}
	return nil
}

func (c *COMService) IsConnectionEstablished() bool {
	return c.isConnectionEstablished;
}


