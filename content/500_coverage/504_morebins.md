---
title: '504 More on bins'
chapter: true
weight: 504
draft: false
---

# More on bins

The configuration of the bins has a huge influence on the coverage. This makes constraining the bins a delicate job. SystemVerilog therefore offers quite some flexibility to define the bins. Below, a couple of features/techniques are highlighted.


## Explicit bins

{{% multiHcolumn %}}
{{% column %}}
{{< highlight systemverilog >}}
bins a = {1, 2}; 
{{< /highlight >}}
{{% /column %}}
{{% column %}}
Bin *a* is hit when the value is 1 or 2.
{{% /column %}}
{{% /multiHcolumn %}}

{{% multiHcolumn %}}
{{% column %}}
{{< highlight systemverilog >}}
bins b[3] = {1, 2, 3,    4, 5, 6,     7, 8, 9};
{{< /highlight >}}
{{% /column %}}
{{% column %}}
Bin *b* is an array of width **3**. As the enumeration shows more than 3 values, SystemVerilog dictates an equal distribution of the values to the number of elements in the array:<br/> b[0] <= 1, 2, 3; b[1] <= 4, 5, 6; and b[2] <= 7, 8, 9; 
{{% /column %}}
{{% /multiHcolumn %}}

{{% multiHcolumn %}}
{{% column %}}
{{< highlight systemverilog >}}
bins c[3] = {1, 2, 3,    4, 5, 6,     7, 8, 9,     10};
{{< /highlight >}}
{{% /column %}}
{{% column %}}
In case of an indivisible number of elements, the final bin takes the remainder:<br/> c[0] <= 1, 2, 3; c[1] <= 4, 5, 6; and c[2] <= 7, 8, 9, **10**;
{{% /column %}}
{{% /multiHcolumn %}}

{{% multiHcolumn %}}
{{% column %}}
{{< highlight systemverilog >}}
bins d[] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
{{< /highlight >}}
{{% /column %}}
{{% column %}}
When an array is NOT given a size, 1 bin is made for every value in the list.
{{% /column %}}
{{% /multiHcolumn %}}

Luckily you don't have to be very explicit. Ranges can be written with a shorter notation.
{{% multiHcolumn %}}
{{% column %}}
{{< highlight systemverilog >}}
bins e[] = {1, 2, 3, 4, 5};
{{< /highlight >}}
{{% /column %}}
{{% column %}}
<div style="text-align: center">is equivalent to</div>
{{% /column %}}
{{% column %}}
{{< highlight systemverilog >}}
bins e[] = { [1:5] };
{{< /highlight >}}
{{% /column %}}
{{% /multiHcolumn %}}

## Bins for transitions

All the bins that were shown up until this point were targeted at certain values (or ranges of values). Next to these options, also transitions can be tallied. The question they aim to answer is: **How many times was value X seen, being followed by a value Y ?**

{{% multiHcolumn %}}
{{% column %}}
{{< highlight systemverilog >}}
    covergroup cg3 @(posedge clock);
        cp_ALU_instruction_type: coverpoint gb_iface.instruction[5] iff(gb_iface.valid) {
            bins arithmetic = {0};
            bins logical = {1};

            bins arithmetic_after_logical = ( 1=>0 );
            bins logical_after_arithmetic = ( 0=>1 );
            bins logical_after_logical = ( 0=>0 );
            bins arithmetic_after_arithmetic = ( 1=>1 );
        }
    endgroup
{{< /highlight >}}
{{% /column %}}
{{% column %}}
![QuestaSim coverage example](/img/screenshot_504_transition.png)
{{% /column %}}
{{% /multiHcolumn %}}

In the example above, coverpoint **cg3** again monitors the type of instruction that is being executed in the first two bins **arithmetic** and **logical**. The next 4 bins count how often one type of operation is followed by a certain type of operation.

{{% notice note %}}
Note that the sum of all types of operations is **45**, but the sum of transitions is only **44**. 
{{% /notice %}}

Bins for transitions can also be defined in a number of ways.

{{% multiHcolumn %}}
{{% column %}}
{{< highlight systemverilog >}}
    covergroup cg4 @(posedge clock);
        cp_ALU_instruction_type: coverpoint gb_iface.instruction[5:3] iff(gb_iface.valid) {
            bins add = {0};
            bins adc = {1};
            bins sub = {2};
            bins sbc = {3};
            bins dna = {4};   /* note the name ! */
            bins rox = {5};   /* note the name ! */
            bins ro = {6};    /* note the name ! */
            bins pc = {7};    /* note the name ! */

            bins f = ( 2 => 0 => 1);
        }
    endgroup
{{< /highlight >}}
{{% /column %}}
{{% column %}}
Bin **f** adds another transition: it counts the number of times a **SUB** is followed by an **ADD** which is then followed by an **ADC**.
{{% /column %}}
{{% /multiHcolumn %}}

{{% multiHcolumn %}}
{{% column %}}
Bin **g** combines ranges with transitions. It counts how often an **arithmetic** operation is followed by a **logical** operation.
{{% /column %}}
{{% column %}}
{{< highlight systemverilog >}}
bins g = ([0:3] => [4:7]);
{{< /highlight >}}
{{% /column %}}
{{% /multiHcolumn %}}

In the next example a shorter way of description is shown.
{{% multiHcolumn %}}
{{% column %}}
{{< highlight systemverilog >}}
bins h[] = (3=>3=>3=>3=>3);
{{< /highlight >}}
{{% /column %}}
{{% column %}}
<div style="text-align: center">is equivalent to</div>
{{% /column %}}
{{% column %}}
{{< highlight systemverilog >}}
bins h[] = (3[*5]));
{{< /highlight >}}
{{% /column %}}
{{% /multiHcolumn %}}

## No ordinary headache

{{% multiHcolumn %}}
{{% column %}}
{{< highlight systemverilog >}}
bins i = (3[* 3:5]);
{{< /highlight >}}
{{% /column %}}
{{% column %}}
Bin **i** is hit when value 3 is followed more threes, but only when the total is 3, 4, or 5: **3=>3=>3** or **3=>3=>3=>3** or **3=>3=>3=>3=>3** are ok
{{% /column %}}
{{% /multiHcolumn %}}

{{% multiHcolumn %}}
{{% column %}}
Bin **j** is hit when value 3 is followed two more times but there might be other values within.
{{% /column %}}
{{% column %}}
{{< highlight systemverilog >}}
bins j = (3[->2]);
{{< /highlight >}}
{{% /column %}}
{{% /multiHcolumn %}}

## Final word

Given the simple DUT that is used for these examples, some of them seem a little overkill. Please, keep in mind that this is purely for educational purpose. To illustrate these concepts it sometimes is easier to simplify too much, but the actual implementations/functionality looses its sense :wink: