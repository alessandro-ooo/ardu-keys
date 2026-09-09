# Ardu keys

## Overview
This is a low-cost(*) macro keyboard made with an Arduino Uno R3, four mechanical switches on a printed PCB and a 3D printed case, then handled by a software made with wails where it's possible to change what the physical key will trigger. Under no circumstances has to be considered a "final" product and its only purpose is to recycle an unused Arduino board and experiment with something new. For more information consult the LICENSE.md.

(*) prices may vary from your region and/or if you have the board already, if you own or not a 3D printer, and the local prices for everything.

### Table of contents
1. Software
2. Electronics


## 1. Software

<p align="center">
   <kbd><img src="https://i.imgur.com/8AdMxWA.png" alt="SW"></kbd>
</p>

The software is pretty much focused on this page, with a slight difference when editing the mapping of your keys. The bulb on the top left, indicates you if it's connected to the COM, or not. GREEN is connected, RED is disconnected. The way the software works, is that it automatically detects if the board is connected or not upon launching the software; if not, you can connect it into "edit mapping". To know why it works this way, check FOR_DEVELOPERS.md.

<p align="center">
   <kbd><img src="https://i.imgur.com/vbj7n7o.png" alt="SW"></kbd>
</p>

By clicking "edit mapping", the keycaps will be highlighted and the COM will be selectable; discard changes will not save any changes you made, save changes will save and apply them. If you changed the COM, the software will connect to it unless it's "busy".

<p align="center">
   <kbd><img src="https://i.imgur.com/OCum08H.png" alt="SW"></kbd>
</p>

If you click on a keycap, you'll be prompted to select which key it has to trigger. You can find a complete list at LIST_OF_KEYS.md

### Note
Some softwares may NOT detect the key pressed because of missing administrator privileges, so it's advised to always run it as administrator. Others instead, even if all the keys are considered as valid might decide to not detect keys over F12 (from F13 to F24) OR detect them and consider it as cheating, but it's a rare thing and most just decide to ignore the input.
Known softwares where it's required to run as administrator: teamspeak3.

## 2. Electronics
The circuit uses the Arduino Uno R3 Pin header connector, specifically the d2, d3, d4, d6 and GND pins, that are connected with the board through a female socket wired with jumper wire (CLICK HERE TO CHECK THE WIRING).

### 2.1 Schematic 
The PCB makes use of four switches and a female 01_05 connector, four for the digital inputs and one for the ground. A note: The ground could have been handled differently, but this is a first time and self-taught project with PCBs and mistakes are totally allowed.

<p align="center">
   <kbd><img src="https://i.imgur.com/2BZTXVE.png" alt="SW"></kbd>
</p>

The wiring is basically this:

```
Arduino Uno D2 ──[internal pull-up]── PCB D2 ── SW1 ── GND
Arduino Uno D3 ──[internal pull-up]── PCB D3 ── SW2 ── GND
Arduino Uno D4 ──[internal pull-up]── PCB D4 ── SW3 ── GND
Arduino Uno D5 ──[internal pull-up]── PCB D5 ── SW4 ── GND
```
