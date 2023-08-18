---
title: '103 Interfaces'
chapter: true
weight: 103
---

# Interfaces

Well, all of the above sounds very nice and understandable, but if you think it through questions will arise (and will keep arising ever more :wink:). 

The first question that needs answering before we can go to an example is: **"How do you connect this software to the hardware ?"**. The answer is very short, but way from simple: **interfaces**.

Let's take a look at the entity of ALU and try if we can figure this out.

{{% multiHcolumn %}}
{{% column %}}
{{< highlight vhdl >}}
entity ALU is
  port (
    A : in STD_LOGIC_VECTOR(7 downto 0);
    B : in STD_LOGIC_VECTOR(7 downto 0);
    flags_in : in STD_LOGIC_VECTOR(3 downto 0);
    Z : out STD_LOGIC_VECTOR(7 downto 0);
    flags_out : out STD_LOGIC_VECTOR(3 downto 0);
    operation: in STD_LOGIC_VECTOR(2 downto 0)
  );
end ALU;
{{< /highlight >}}
{{% /column %}}

{{% column %}}
There are 4 inputs to the ALU and 2 outputs. The inputs need to be driven by the testing environment, and (off course) the outputs need to be evaluated by the testing environment. With an interface, a sort of **plug** is described. This *plug* can be inserted into the DUT and into the software-based testing environment.

Although, in essence, this is correct, an *interface* can provide much more features.
{{% /column %}}
{{% /multiHcolumn %}}


{{% multiHcolumn %}}

{{% column %}}
The alongside code shows a simple interface. Instead of defining a module, an **interface** is defined: **ALU_iface**. The interface in the example has one input: the clock. Although a clock is common, it is not mandatory.

Next, there is a definition for every signal or bus inside the interface. **Note** that there is no direction specified. 

Another remark on the signals is the *type*. Further down, this is elaborated on.

Finally, the C-programmers might recognise the *'ifndef*, *'define*, and *'endif* directives. These work in a similar way. With including source files, this construction prevents multiple iterations over the same code.
{{% /column %}}

{{% column %}}
{{< highlight systemverilog >}}
`ifndef SV_IFC_ALU
`define SV_IFC_ALU

interface ALU_iface ( 
  input logic clock
);

  logic [7:0] data_a;
  logic [7:0] data_b;
  logic [7:0] data_z;

  logic [3:0] flags_in;
  logic [3:0] flags_out;
  logic [2:0] operation;

endinterface

`endif
{{< /highlight >}}

{{% /column %}}

{{% /multiHcolumn %}}


## Use logic rather than wire or reg

One of the big stumbling stones in Verilog is the difference between *wire* and *reg*. SystemVerilog has made things easier with defining a new data type: **logic**. Also, Verilog and VHDL natively have types that support *four* basic states:

<div class="multiHcolumn column_highlight">
0 1 X Z
</div>

## Datatypes

As we are discussing data types, this might the place to add a list on the different data types. SystemVerilog has a number of data types that have only two states:

<div class="multiHcolumn column_highlight">
0 1
</div>

In simulation it makes less sense to keep four-state values. 

{{% multiHcolumn %}}
{{% column %}}
#### Two-state datatypes
* **bit:** 1 bit
* **byte:** 8 bits (similar to char in C)
* **shortint:** 16 bits (similar to short in C)
* **int:** 32 bits (similar to int in C)
* **longint:** 64 bits (similar to longlong C)
{{% /column %}}
{{% column %}}
#### Four-state datatypes
* **logic**: 1 bit (similar to reg/wire in Verilog)
* **integer**: 32 bits
{{% /column %}}
{{% /multiHcolumn %}}

It is important to understand that at some level a switch is made between a 2-state and a 4-state data type. The table below shows how this *translation* is done.

<table id="typestates">
  <tr class="header"><td>Two-state</td><td><-></td><td>Four-state</td></tr>
  <tr><td>1</td><td>&nbsp;</td><td>1</td></tr>
  <tr><td>0</td><td>&nbsp;</td><td>0</td></tr>
  <tr><td>0</td><td>&nbsp;</td><td>X</td></tr>
  <tr><td>0</td><td>&nbsp;</td><td>Z</td></tr>
</table>



### Strings
SystemVerilog adds the typical *string* datatype to the language, eg. ```string foo = "bar";```. It haves mostly like in any other software language you have seen: There is comparison, replication, concatenation, ... Also, there a number of functions/tasks that can help in manipulating strings: [chipverify.com](https://www.chipverify.com/systemverilog/systemverilog-strings "bla").
