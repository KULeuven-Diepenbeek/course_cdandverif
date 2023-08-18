---
title: '404 Assignment 3'
chapter: true
weight: 404
draft: false
---

# Assignment 3

The third assignment focuses on the **Transaction**-class, but effects most components on the [functional layer](../../200_oo/201_layered_testbench/). As a reminder, objects of the transaction class are generated in the generator and are sent to the Driver and the Checker. The class must have the **class members** as stated below. The **new** and **ToString** methods should remain **unmodified**.

{{< highlight systemverilog >}}

class transaction;

  rand bit [1:0] instruction_type;
  rand bit [2:0] instruction_selection;
  rand bit [2:0] operand_selection;

  function new();
    this.instruction_type = 2'h0;
    this.instruction_selection = 3'h0;
    this.operand_selection = 3'h0;
  endfunction : new

  function string toString();
    return $sformatf("Instruction: %02x %02x %02x (%02x) ", this.instruction_type, this.instruction_selection, this.operand_selection, this.toByte);
  endfunction : toString

  function byte toByte();
    return byte'(this.instruction_type * 2**(6-1) + this.instruction_selection * 2**(3-1) + this.operand_selection);
  endfunction : toByte;

endclass : transaction


program assignment3();
    transaction tra;

    initial
    begin

      /* COMPLETE THIS CODE */

    end


endprogram : assignment3


{{< /highlight >}}

For this assignment the program **assignment3** should generate:

* **Test 1:** 100 tests random operands for each operation (ADD, ADC, SUB, SBC, AND, XOR, OR, CP) specifically (totalling on 800 tests)
* **Test 2:** 100 tests with random operands for operations that start with an A (ADD, ADC or AND)
* **Test 3:** 100 tests with random operands and random operations. After a SUB operation, the next operation **MUST** be XOR
* **Test 4:** 1'000 tests with random operands. Roughly 20% of the tests should be the CP operation. Print a summary of these tests to show the constrained is met.

Note that:

* a *random operand* implies: one of the 8 registers
* you can ADD everything you want to the transaction class
* below are some example screenshots of the expected results of the 4 tests

{{% multicolumn %}}
{{% column %}}
![Example output](/img/screenshot_a3_1.png)
{{% /column %}}
{{% column %}}
![Example output](/img/screenshot_a3_2.png)
{{% /column %}}
{{% column %}}
![Example output](/img/screenshot_a3_3.png)
{{% /column %}}
{{% column %}}
![Example output](/img/screenshot_a3_4.png)
{{% /column %}}
{{% /multicolumn %}}