---
title: "QuestaSim Commanline Cheats"
date: 2020-02-07T10:07:37+01:00
weight: 2001
---

## vsim options

| Option | Description |
|---|---|
| -c | stay in command-line mode |
| -sv | enable **SystemVerilog** |


## Transcript commands

### Compiling
| Command | Argument | Description |
|---|---|---|
| vlib work | | create a library **work** |
| vcom | | compile **VHDL** source |
| vlog | | compile **Verilog** source |
| vlog | -sv | compile **SystemVerilog** source |

### Simulating
| Command | Argument | Description |
|---|---|---|
| vsim | *top* | start simulating entity **top** |
| | -voptargs=”+acc” *top* | start simulating entity **top**, and preserve the visibility of objects in the simulator |
| restart | | restart the simulation |
|  | -f | restart the simulation without the pop-up |
| run | | runs the simulator |
| | 10ns | runs the simulator for 10 ns|
| do | thisandthat.do | execute a *do* script *thisandthat.do* |
| quit | -sim | close the simulator |

### Other
| Command | Argument | Description |
|---|---|---|
| add | wave sim:inverter_tb/out | adds the **out** signal to the waveforms |
| quit | | close QuestaSim |

For info on **-voptargs=+acc**, see: http://www.pldworld.com/_hdl/2/_ref/se_html/manual_html/c_vlog19.html