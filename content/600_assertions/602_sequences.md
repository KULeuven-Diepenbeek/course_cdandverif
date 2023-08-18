---
title: '602 Sequences'
chapter: true
weight: 602
draft: false
---

# Sequences

Next to defining immediate assertions and concurrent assertions, it is also very valuable if certain sequences can be evaluated. For example, if a condition *A* is true at a certain moment time, we want to assert that the **next clockcycle** condition *B* holds. This type of succession can be described using sequences.

Sequences can be declared in modules, programs, interfaces, ... and can be used in assertions. The example below shows a sequence that: 

{{% multiHcolumn %}}
{{% column %}}
* if **sel** is *high* at a rising edge of the clock
* and **2 clock cycles** later
* **enable** is also *high*
{{% /column %}}
{{% column %}}
{{< highlight systemverilog >}}
sequence seq1;
    @(posedge clock) sel ##2 enable;
endsequence
{{< /highlight >}}
{{% /column %}}
{{% column %}}
![Wavedrom example](/img/screenshot_62_waveformC.png)
{{% /column %}}
{{% /multiHcolumn %}}

{{% multiHcolumn %}}
{{% column %}}
![Wavedrom example](/img/screenshot_62_waveformB.png)
{{% /column %}}
{{% column %}}
![Wavedrom example](/img/screenshot_62_waveformA.png)
{{% /column %}}
{{% column %}}
![Wavedrom example](/img/screenshot_62_waveformD.png)
{{% /column %}}
{{% /multiHcolumn %}}

It is pointed out that the number that follows the **##** is not interpreted as units of time (e.g. 2 ns), but in **timescale** sampling points (e.g. `timescale \<time_unit>/\<time_prescision>). The delay-symbol ## can also be used as an **interval**, e.g. ##[1:5]; possibly with an open ending, e.g. ##\[1:$] (where $ symbolises *forever*).


### Sequences in sequences

As the subtitle indicates, sequences can be used in other sequences.

{{< highlight systemverilog >}}
sequence seq1;
    @(posedge clock) sel ##2 enable;
endsequence

sequence seq2;
    @(posedge clock) clear ##1 seq1 ##1 sel;
endsequence
{{< /highlight >}}

### Combining sequences
{{% multiHcolumn %}}
{{% column %}}
There are a number of ways on which different (parallel) sequences can be combined.
<ul>
<li> seq1 **and** seq2 (both must *start* at the same time)
<li> seq1 **or** seq2 (both must *start* at the same time)
<li> seq1 **intersect** seq2 (both must *start* and *end* at the same time)
<li> seq1 **within** seq2
</ul>
{{% /column %}}
{{% column %}}
{{< highlight systemverilog >}}
sequence seq1;
    @(posedge clock) a ##2 b;
endsequence

sequence seq2;
    @(posedge clock) c ##1 d ##1 e;
endsequence
{{< /highlight >}}
{{% /column %}}
{{% /multiHcolumn %}}


## How to incorporate in assertions

Sequences can be merged into assertions through **properties**. The idea is that you can define a property. This could require some code. This property is then used in the assertion to verify.

0. Create a boolean expression: ```sel ##2 enable```
{{< highlight systemverilog >}}
 sel ##2 enable
{{< /highlight >}}
0. Make a sequence, using the expression: 
{{< highlight systemverilog >}}
sequence my_fantastic_sequence;
    @(posedge clock) sel ##2 enable;
endsequence
{{< /highlight >}}
0. Make a property, using the sequence
{{< highlight systemverilog >}}
property my_fantastic_property;
    my_fantastic_sequence;
endproperty
{{< /highlight >}}
0. Assert the property
{{< highlight systemverilog >}}
a_bold_assertion_name_goes_here: assert property(my_fantastic_property);
{{< /highlight >}}