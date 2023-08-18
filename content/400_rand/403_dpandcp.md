---
title: '403 DP and CP'
chapter: true
weight: 403
draft: false
---

# DP and CP


A natural tendency you might have (I know I have) is to start applying different test vectors: "Ok, my design knows 20 + 30, but does it also know 21 + 30 ?"

Randomising the **inputs** is a logical next step. Although this step is useful, it's far from sufficient.

Years ago in this study program you were introduced to hardware design. Here you learned about the **datapath (DP)** and the **control path (CP)**. The datapath is the part of your design that handles the actual data. In the example of our *processor*, this simply covered the instruction and the probed output of **reg A**. The control path is the part of your design that directs your datapath to behave correctly. In the example of our ALU, this covers: the input flags, the operation and the output flags.

It has been shown in the earlier sections of this chapter how randomisation can help us to better test a design. However, the only part that was randomised was the data path. A bold tester might even say after 10 successful tests of each operation of the ALU that the ALU works fine. (FTR: I'm not that bold :smiley:)

What if the control path would (also) be randomised ?

Imagine the following bug:

> If an **ADD** is done after a **SBC**, an incorrect **N-flag** is reported.

Because the course handles a simplified processor as DUT, this scenario might be a bit far fetched. Let's assume, nevertheless, that such a bug is there. **Would your normal testbench catch it ? Or ... would the SystemVerilog code (as it is at this point) catch it ?**

## Exercise: Taking apart the instruction

The input to the DUT now simply is 1 single byte. However, these 8 bits are a concatenation of 3 different *parameters*:

* the first two bits (roughly) signal when the ALU is targeted. This can be deduced from the **instruction set** (e.g. [here](https://clrhome.org/table/)): when the instruction starts with **"10"**, the ALU is required;
* the next three bits indicate which operation is selected (see [201](/200_increase/201_registerfile/#a-word-on-the-operation));
* the final three bits indicate the selected operand.

There is **no rule** that dictates that the instruction property in the transactions class must reflect the interface of the DUT.

{{% multicolumn %}}
{{% column %}}
{{< highlight systemverilog >}}
class transaction;
  rand byte instruction;
{{< /highlight >}}
{{% /column %}}
{{% column %}}
{{< highlight systemverilog >}}
class transaction;
  rand bit [1:0] instruction_type;
  rand bit [2:0] instruction_selection;
  rand bit [2:0] operand_selection;
{{< /highlight >}}
{{% /column %}}
{{% /multicolumn %}}

This, of course, has some minor implications on the rest of the class. 

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
        return byte'(this.instruction_type * 2**(6) + this.instruction_selection * 2**(3) + this.operand_selection);
    endfunction : toByte;

endclass : transaction;
{{< /highlight >}}

In the example above the **toString()** method has be updated to the new properties. Additionally, a **toByte()** function is added. This method will useful in the *driver*. 

{{< highlight systemverilog >}}
    this.ifc.instruction <= tra.instruction;
/* will become */
    this.ifc.instruction <= tra.instruction.toByte();
{{< /highlight >}}

## More constraints

Two more ways to constraint the randomness generation are given here.


### *inside* and *dist*

Two keywords can help you in verifying the design: **inside** and **dist**. Two examples are given below. Pay attention to the syntax !! Brackets, semicolons, curly brackets, etc. it sometimes becomes *delicate*.

{{% multicolumn %}}
{{% column %}}
### inside
With the **inside** keyword a value can be forced to lay between two different values.
{{< highlight systemverilog >}}
  constraint c1 {
    (instruction_selection inside {3'b000, 3'b001});
  }
  constraint c2 {
    (instruction_selection inside {[0:3]});
  }
  constraint c3 {
    !(instruction_selection inside {[0:3]});
  }
{{< /highlight >}}

The **c1** constraint implies that the operation must be either **ADD** or **ADC**. The possible values of *instruction_selection* are enumerated between the curly brackets. 

The **c2** constraint implies that the operation **must** be an **arithmetic operation**. The possible values of *operation* lies within the range ```3'b000``` to ```3'b011``` (with the upper-limit *inclusive*).

The **c3** constraint implies that the operation **may not** be an **arithmetic operation**. The possible values of *operation* may not lay within the range ```3'b000``` to ```3'b011```.


{{% /column %}}

{{% column %}}
### dist

With the **dist** keyword a value can be given a distribution of occurring.
{{< highlight systemverilog >}}
  constraint c1 {
    instruction_selection dist { 0 := 1, 1 := 5, 2 := 1, 3 := 5 };
  }
  constraint c2 {
    instruction_selection dist { [0:3] := 5, [4:7] := 1 };
  }
  constraint c3 {
    instruction_selection dist { [0:3] := 5, [4:7] :/ 1 };
  }
{{< /highlight >}}

The **c1** constraint implies that the operation must be an **arithmetic operation** (because only values 0, 1, 2, and 3 are enumerated). On average, operations **ADC** and **SBC** should occur **5** times more than **ADD** and **SUB**.

With ```x := y``` the relative weight of generating value *x* is set to *y*.

The **c2** constraint implies that an **arithmetic operation** occurs 5 times more than a **logical operation**.

The **c3** constraint implies that the weight of *1* is assigned to the entire range. This boils down to values 4-7 having a weight of 0.25, each.

{{% /column %}}
{{% /multicolumn %}}

{{% notice note %}}

{{% /notice %}}

### Implication

Through the use of the *implication-operator (->)* conditional relations can be installed.

{{< highlight systemverilog >}}
class OperandsDemo;
 rand byte A;
 rand byte B;
 constraint c_implication_example {
   A == 0 -> B < 12;
   A == 1 -> B > 11;
 }
{{< /highlight >}}


{{% notice tip %}}
It is pointed out that these restrictions might seem a bit far fetched for this simple example. <br/>
Hopefully these constraints give you a hint of the power of constraining randomness. By enabling/disabling such constraints the verification engineer can tune his/her test scenario to verify specific goals.
<br/>
<br/>
Also note that these keywords can also be used for constraining the randomness in the datapath.
{{% /notice %}}

There are **even more** techniques to control the randomness generation. Also, given the object-oriented nature of SystemVerilog a lot more can be achieved by making subclasses an **inheriting** randomness settings and constraints from the parent classes. Handling all these degrees of freedom, however, would take us too far in this course.

A small example on class inheritance is given below.

{{% multicolumn %}}
{{% column %}}
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
        return byte'(this.instruction_type * 2**(6) + this.instruction_selection * 2**(3) + this.operand_selection);
    endfunction : toByte;

endclass : transaction;
{{< /highlight >}}
{{% /column %}}
{{% column %}}
{{< highlight systemverilog >}}
class ALUtransaction extends transaction;

  function new();
      super.new();
      this.instruction_type.rand_mode(0);
      this.instruction_type = 2'h2;
  endfunction : new

endclass : ALUtransaction;
{{< /highlight >}}
{{% /column %}}
{{% /multicolumn %}}