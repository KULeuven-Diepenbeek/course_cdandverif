---
title: '402 Constraints'
chapter: true
weight: 402
draft: false
---

# Constraints

Time for another Buzz-word lightning round: SystemVerilog supports **Constrained Random Verification**. If you simply breakdown the words, it becomes quite clear already. *Verification* should be clear. Random, after the previous section, should also ring a bell. Then there is the third word: **Constrained**. 

Generating random numbers to apply as stimuli is useful. It helps the verification engineer to touch on **corner cases** that might be missed while trying come up with all test vectors himself/herself. *Hooray for randomness*.

To be more in control of **which** random numbers are generated, it is useful to be able to lay constraints on the random number generator. These constraints can be altered during the tests or between different test scenarios.


{{% multiHcolumn %}}
{{% column %}}
{{< highlight systemverilog  >}}
class OperandsDemo;

  rand byte A;
  rand byte B;

  constraint c1 {
    A[3:0] == 4'b0;
  }

  function string ToString();
    return $sformatf("A: %08b, B: %08b", this.A, this.B);
  endfunction : ToString

endclass : OperandsDemo;


program test;
  static OperandsDemo demo;

  initial 
  begin

    for(int i=0;i<10;i++)
    begin
      demo = new();
      
      void'(demo.randomize());

      $display("%s", demo.ToString());
    end

  end

endprogram : test
{{< /highlight >}}
{{% /column %}}

{{% column %}}

In this example, the class **OperandsDemo** shows how to put a constraint on operand A. A few remarks:

* the keyword **constraint** is used, before a *human* name of the constraint
* the lines that define the constraint must be ended with a semicolon
* the definition of the constraint looks like a test. Something you could write in an if( ) statement.
* a constraint can only be declared in a class

When an object is being randomised, the constraints are checked. If the constraints hold, the simulator continues. If the constraints are violated, new values are generated until the constraints are met.

To be complete, there are a number of other requirements:

* the constraint should be of integral type (bit, int, logic, reg, ...)
* constraints only support 2-state values
* by default, constraints are **enabled**, but they can **disabled**

{{% /column %}}
{{% /multiHcolumn %}}


It is fairly clear what the constraint in the example will accomplish. The 4 least significant bits of **A** should be zero. The result of the example is shown below.

{{% multiHcolumn %}}
{{% column %}}
{{< highlight bash >}}

$ vsim -c
$ vlog -sv OperandsDemo.sv
$ vsim -voptargs="+acc" test
$ run 10 us
{{< /highlight >}}
{{% /column %}}
  
{{% column %}}

![Testing without GUI](/img/screenshot_402_example.png)
{{% /column %}}
{{% /multiHcolumn %}}


## Another example

Another intuitive example is given.

{{% multiHcolumn %}}
{{% column %}}
{{< highlight systemverilog >}}
...
  constraint c1 {
    A[3:0] == 4'b0;
  }

  constraint c2 {
    B > A;
  }
...
{{< /highlight >}}
{{% /column %}}
  
{{% column %}}
{{< highlight bash >}}
# A: 00100000, B: 01011111
# A: 10110000, B: 01011000
# A: 10010000, B: 10100001
# A: 01000000, B: 01110011
# A: 10010000, B: 11101010
# A: 10010000, B: 00000100
# A: 11010000, B: 00000110
# A: 10010000, B: 10101101
# A: 00100000, B: 00110111
# A: 00010000, B: 00101000
{{< /highlight >}}
{{% /column %}}
{{% /multiHcolumn %}}

<div class="exercise">
  <div class="header">Exercise</div>
  <div class="question">
    Have a look at the second line of the generated values. Did you expect this ?<br/>Try to fix it !!
  </div>
  <div class="solution hiddenSolution">
    SystemVerilog assumes that A and B are signed. Therefore, values with the most significant bit at '1' are negative. Fixing the constraint can be done with: <b>unsigned'(B) > unsigned'(A);</b>
  </div>
  <input value="Toggle answer" type="button" id="b302_1" onClick="toggleAnswer(this.id)"/>
</div>

A few more general remarks on constraints: 

* constraints should be of integral type (bit, reg, logic, integer, ...)
* constraints support only **2-state** values. Values or operators (e.g. ===, !==) on 4-state values are not illegal. **Beware** that you can still use a value of the type *logic* (4-state), as long as it only contains 0's and/or 1's.
* constraints can be inherited from parent classes
* constraints can use a function. This could come in handy if the desired properties are too complex to express in a single expression.

{{% multiHcolumn %}}
{{% column %}}

{{< highlight systemverilog >}}
  class SomethingFancy;
    rand integer value;
    constraint c1;
  endclass : SomethingFancy

  constraint SomethingFancy::c1 {
    value < 1000; 
  }
{{< /highlight >}}
{{% /column %}}

{{% column %}}
{{< highlight systemverilog >}}
  class SomethingFancy;
    rand integer value;
    constraint c1;
  endclass : SomethingFancy

  class SomethingFancier extends SomethingFancy;
    constraint c1 {value > 0;}
  endclass : SomethingFancier
{{< /highlight >}}
{{% /column %}}

{{% /multiHcolumn %}}

{{< highlight systemverilog >}}
function byte increment( byte x )
  return x+1;
endfunction : increment

class OperandsDemo;
  rand byte A;
  rand byte B;
  constraint c1 {
    B == increment(A)
  }
  constraint c2 {
    A[3:0] == 4'b0;
  }
endclass : OperandsDemo

{{< /highlight >}}


## Constraint ordering
{{% multiHcolumn %}}
{{% column %}}
With these two examples **c1** and **c2** not many issues could arise. However, when the complete testbench becomes much larger and more complex, generating random values that fulfil the constraints can become **processor intensive**. SystemVerilog allows the verification engineer to help, by determining the order in which the constraints should be tackled.

{{% /column %}}
{{% column %}}
{{< highlight systemverilog>}}
  constraint c1 {
    A[3:0] == 4'b0;
  }

  constraint c2 {
    unsigned'(B) > unsigned'(A);
  }

  constraint c3 {
    solve A before B;
  }
{{< /highlight >}}
{{% /column %}}
{{% /multiHcolumn %}}

## Enable/disable constraints

Similar to enabling and disabling randomisation, constraints can be enabled and disabled as well. This is done through ```demo.c2.constraint_mode(0)``` or ```demo.c1.constraint_mode(1)``` to respectively disable c2 or enable c1;

