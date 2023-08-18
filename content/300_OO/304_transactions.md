---
title: '304 Transactions'
chapter: true
weight: 304
draft: false
---

# Transactions

Now we're truly going OO with this testbench. Up until this point, 2 classes (that did something useful) were added : *driver* and *monitor*. Adding more classes for **generators**, **checkers**, ... should not be too much of a challenge, from a coding point-of-view.

The structure, however, should become clear by now:

{{% multiHcolumn %}}
{{% column %}}
0. The **generator** generates a testvector
0. This testvector is sent to the **driver** and the **checker**
0. The **driver** *translates* the input to pin-wiggles
{{% /column %}}
{{% column %}}
0. The **monitor** *translates* the output pin-wiggles to something readable. 
5. The **monitor** forwards its output to the **checker**
6. The **checker** verifies the correctness
7. The **scoreboard** is updated by the **checker**'s ruling
{{% /column %}}
{{% /multiHcolumn %}}

## Transactions

To use the testbench in a generic way to enhance reusability, it is important that the generated testvectors are described in a generic form. Well ... let's use a class for that as well.

{{% multiHcolumn %}}
{{% column %}}

{{< highlight systemverilog >}}
class transaction;
  byte instruction;

  function new();
    this.instruction = 8'h8c;
  endfunction : new

  function string toString();
    return $sformatf("Instruction: %08x", this.instruction);
  endfunction : toString

endclass : transaction;
{{< /highlight >}}
{{% /column %}}
{{% column %}}
This class describes the **transaction**. It has only a single property: instruction

Upon construction, the value for this object's instruction is fixed (for now) to ```0x8C``` (aka ``ADC H```)

There is a function **toString( )** that, as the name suggests, makes a sting from the object's property values.

{{% /column %}}
{{% /multiHcolumn %}}

{{% notice note %}}
Make sure you spot the return-value type **string** in the *toString( )* method.
{{% /notice %}}


## Generator

{{% multiHcolumn %}}

{{% column %}}

The generator is the object that will create the aforementioned transactions. While making an object this class nothing else happens (for now). 

Furthermore, it has a function **run( )** which ... well ... generates a transaction and displays which instruction was generated. This is repeated for 10 times.

{{% /column %}}

{{% column %}}

{{< highlight systemverilog >}}
`include "transaction.sv"

class generator;

  function new;

  endfunction : new

  task run;
    transaction tra;

    for(int i=0; i<10; i++)
    begin
      tra = new();
      $display("%s", tra.toString());
    end
  endtask : run

endclass : generator
{{< /highlight >}}
{{% /column %}}

{{% /multiHcolumn %}}

To glue everything together, a small test is set up which creates a generator and triggers it's **run( )** function. The result is shown below.

{{% multiHcolumn %}}

{{% column %}}

{{< highlight systemverilog >}}
`include "generator.sv"

program test();

  generator gen = new();

  initial
  begin
    gen.run();
  end

endprogram : test
{{< /highlight >}}
{{% /column %}}
{{% column %}}
![Result of the code above](/img/screenshot_304.png)
{{% /column %}}
{{% /multiHcolumn %}}


Great !! Now you can generate all the testvectors that you want :smiley: Only ... they are all the same and only live within the generator. Let's fix that with *mailing* transactions around.
