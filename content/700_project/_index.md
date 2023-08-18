---
title: '7 Project'
chapter: true
weight: 700
draft: false
---

# Project

The final push in these lab sessions is to apply what has been seen in previous weeks. The examples started on the ALU only and not for long the registerfile of the processor was added. For the project, the DUT is extended again. The added feature is that the load operations are now (almost completely) supported .

**For the project, this implementation has to be verified.**

<u>The criteria on what has to be checked, how these are to be checked, and how thoroughly, ... it's all up to you!! </u>

## The extended functionality

Roughly 25% of all the available 8-bit instructions are load-instructions. These instructions have 8 target: regA, regB, regC, regD, regE, regH, regL, and the indirectly addresses position on address HL. Because every target can be loaded with the value of any other target, this gives 8*(8-1) = 56 load instructions. Additionally, there is an option for directly loading an 8-bit value into a target. With these additional 8 instructions, there are 64 load operations.

**REDO IMAGE**
![instr](/img/instruction.png)


## A few tips and shortcuts

* The actual GameBoy processor only has 1 bus interface. This bus provides both instructions and data. For the project we'll be cheating there and assume that (if required) the 8-bit data is present **simultaneously** with the instruction on a different input.
* As 16-bit operations were not considered, **16-bit load instructions are also neglected**.
* The indirect addressing of (HL) is ignored. If the value is used to be copied into another register, a hard-coded value of **8'h00** is used.
* Any other indirect addressing is **ignored** (eg. (BC), (DE), (nn))