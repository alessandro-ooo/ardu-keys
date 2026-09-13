# Ardu keys

## Overview
This is a low-cost(*) macro keyboard made with an Arduino Uno R3, four mechanical switches on a printed PCB and a 3D printed case, then handled by a software made with wails where it's possible to change what the physical key will trigger. Under no circumstances has to be considered a "final" product and its only purpose is to recycle an unused Arduino board and experiment with something new. For more information consult the LICENSE.md.

(*) prices may vary from your region and/or if you have the board already, if you own or not a 3D printer, and the local prices for everything.

### Table of contents
1. [Software](#software)
2. Electronics
3. 3D Printed case/container

## 1. Software

<p align="center">
   <kbd><img src="https://i.imgur.com/8AdMxWA.png" alt="SW"></kbd>
</p>

The software is pretty much focused on this page, with a slight difference when editing the mapping of your keys. The bulb on the top left, indicates you if it's connected to the COM, or not. GREEN is connected, RED is disconnected. The way the software works, is that it automatically detects if the board is connected or not upon launching the software; if not, you can connect it into "edit mapping".

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
The circuit uses the Arduino Uno R3 Pin header connector, specifically the d2, d3, d4, d6 and GND pins, that are connected with the board through a female socket wired with jumper wire.

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

### 2.2 PCB Layout

The PCB layout is four mechanical switches lined up to the center and the female connector to the side. The switches have enough space to install standard keycaps on them without having spacing issues.
The switches use the `SW_Cherry_MX_1.00u_PCB`  footprint, and the socket uses `PinSocket_1x05_P2.54mm_Vertical` footprint. They're all soldered THT.

<p align="center">
   <kbd><img src="https://i.imgur.com/2hteqgB.png" alt="SW"></kbd>
</p>

Each switch has a track for the GND; which I later found out it's possible to make it in a better way. The layout is 41.55x95.55mm with 2 layers.

## 3. Keyboard case/container
This project also contains a first attempt to CAD designing and 3D printing (outsourced to a local business) to contain both boards. The container itself is designed to hold and protect the boards, no quirky design intended.


<p align="center">
   <kbd><img src="https://i.imgur.com/16qlJk6.png" alt="SW"></kbd>
</p>

### 3.1 Base
To the left, there is the base that holds both boards. It's a simple 127mm x 122mm and 15mm tall with holding holes for both boards. Note: For the R3 board I've used M3 holes, for the printed PCB M2 holes, but after the printing I had to use M2.6 and M1.4 screws. Base without boards for reference:

<p align="center">
   <kbd><img src="https://i.imgur.com/38ffohM.png" alt="SW"></kbd>
</p>

The outer holes are to hold the two printed pieces together.

### 3.2 Top

To the right there is the "top" of the case/container. The shape is made this way to allow space for the jumper wires to be inserted without causing "pressure" to the circuit and eventually damage the wiring or the components. For reference:

<p align="center">
   <kbd><img src="https://i.imgur.com/jsnFz86.png" alt="SW"></kbd>
</p>

The hole to the side is to allow the R3's USB to be used, it's how the board is alimented. 

### 3.3 What it should look like while mounting

<p align="center">
   <kbd><img src="https://i.imgur.com/QrSCdYj.jpeg" alt="SW"></kbd>
</p>

This is how the boards look when screwed to the base

<p align="center">
   <kbd><img src="https://i.imgur.com/Qy4sp7N.png" alt="SW"></kbd>
</p>

This is how it should be looking when the top is on the base (at the moment of the photo, not screwed to the base).

## 4.Project Architecture

```
Hardware 
   │
   │ Serial communication 
   ↓ 
Arduino Firmware 
   │ 
   │ Switch event 
   ↓ 
Wails Backend 
   │ 
   │ "Listens" to the serial monitor 
   ↓ 
Virtual Keyboard Input based on the serial monitor's message
   ↑ 
   │ 
Frontend 
   │ 
   │ 
Configuration 
   └──────────────→ Key Mappings
```

## 5. Bill of Materials and files to send for printing.
In [the release page](https://github.com/alessandro-ooo/ardu-keys/releases) you can find a Bill of Materials, the PCB layout files and the .obj to use in the 3D printer (or give it to whoever will 3D print it for you).

I've used [PCBWay](pcbway.com) to print the PCB, all you have to do is send them the `BOM.xmls` and the `Ardukeys PCB.zip`, and to print the case you will have to use `AK-CASE FINAL.obj`. Note that the project is made using millimeters, and if you're outsourcing the printing it's a good thing if you let them know to avoid printing errors such as converting 120mm to centimeters (1,2m).

## 6. Personal considerations
Through the development and design of the project I have learnt-by-doing the schematics and the PCB layout, and being a project to recycle an unused arduino board, I had to adapt everything to it. Clearly the PCB could have been better (for example, the GND could have been handled way different), but what's important is that I have learned new skills.
