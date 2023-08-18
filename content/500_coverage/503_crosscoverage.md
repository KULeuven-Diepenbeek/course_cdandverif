---
title: '503 Cross coverage'
chapter: true
weight: 503
draft: false
---

# Cross coverage

{{% multiHcolumn %}}
{{% column %}}
In the next example (cg2) the covergroup has two coverpoints: **cp_ALU_instruction_type** and **cp_ALU_instruction_type**. The former looks at the type of instruction while the latter focusses on the three least significant bits, which indicated the second operand. Also note that, other than putting 2 coverpoints on a single signal, putting coverpoints is also possible.
<br/>Additionally the number of times each bin needs to be hit to achieve **a 100% goal** is also increased to 100.
{{% /column %}}
{{% column %}}
{{< highlight systemverilog >}}
  covergroup cg2 @(posedge clock);
    option.at_least = 100;

    cp_ALU_instruction_type: coverpoint gb_iface.instruction[5] iff(gb_iface.valid) {
        bins arithmetic = {0};
        bins logical = {1};
    }
    cp_ALU_second_operand: coverpoint gb_iface.instruction[2:0] iff(gb_iface.valid);
  endgroup
{{< /highlight >}}
{{% /column %}}
{{% /multiHcolumn %}}

![QuestaSim coverage example](/img/screenshot_51_coverage_cg4.png)

## Going 2D

The coverpoints can be seen as follows. A list is made with a certain number of cells (the bins). Every time when **the evaluation condition** is met, **a mark** is set in according field of the list. Although that already provides means to evaluate how much testing is done, correlating different coverpoints would provide with even further insights. This is called **cross coverage** and is also supported by SystemVerilog. Cross coverage can be done between coverpoints, signals, and combinations of both.

{{% multiHcolumn %}}
{{% column %}}
![QuestaSim coverage example](/img/503_crosscoverage.png)
{{% /column %}}
{{% column %}}
{{< highlight systemverilog >}}
  covergroup cg2 @(posedge clock);
    option.at_least = 100;

    cp_ALU_instruction_type: coverpoint gb_iface.instruction[5] iff(gb_iface.valid) {
        bins arithmetic = {0};
        bins logical = {1};
    }
    cp_ALU_second_operand: coverpoint gb_iface.instruction[2:0] iff(gb_iface.valid);

    cx: cross cp_ALU_instruction_type, cp_ALU_second_operand;
  endgroup
{{< /highlight >}}
{{% /column %}}
{{% /multiHcolumn %}}

![QuestaSim coverage example](/img/screenshot_503_crosscoverage.png)

## Making cross sections

Cross coverage bins can be selected from the coverpoints it correlates. This can be achieved by using the keyword **binsof**. Bins can even be intersected with other ranges. Also logical operators can be used to build combinations like **!**, **&&**, and **||**.

{{< highlight systemverilog >}}
    covergroup cg2 @(posedge clock);
        option.at_least = 100;

        cp_ALU_instruction_type: coverpoint gb_iface.instruction[5] iff(gb_iface.valid) {
            bins arithmetic = {0};
            bins logical = {1};
        }

        cp_ALU_second_operand: coverpoint gb_iface.instruction[2:0] iff(gb_iface.valid){
            bins regB = {0};
            bins regC = {1};
            bins regD = {2};
            bins regE = {3};
            bins regH = {4};
            bins regL = {5};
            bins regHL_ind = {6};
            bins regA = {7};
        }
    
        cx: cross cp_ALU_instruction_type, cp_ALU_second_operand {
            bins x1 = binsof(cp_ALU_instruction_type.logical) && binsof(cp_ALU_second_operand.regA);

            bins x2 = binsof(cp_ALU_instruction_type.logical) && !binsof(cp_ALU_second_operand.regB);

            bins x3 = binsof(cp_ALU_instruction_type.arithmetic) || binsof(cp_ALU_second_operand.regA);
        }
    
    endgroup
{{< /highlight >}}

Running the covergroup above can result as is shown below.

![example](/img/screenshot_504_cross_example.png)

Let's try to make out any sense of these results. The 2 coverpoints are as before, only with a more sensible naming of the bins. Intersections for the bins are made as follows:

* **x1**: how many **logical** instructions are done with **regA** as operand
* **x2**: how many **logical** instructions are done with **another operand than regB**
* **x3**: how many instructions are **arithmetic** instructions or are an instruction with **regA** as operand

With the results of the coverpoints cp_ALU_instruction_type and cp_ALU_second_operand, we can verify the correctness:

* there are 24 arithmetic operations and 21 logical operations. In total there are 45. So this makes sense :smiley:
* summing the number of bins of the second coverpoint also adds up to 45. So this makes sense :smiley:
* for x1, it is reported there are 21 logical operations of which 2 are with regA
* for x3, we know already there are 24 arithmetic operations, so the number should at least cover these. From **x1** we learned that there are 2 logical operations with reg A. This means that x3 should have a count of 24+2 = 26. So this makes sense :smiley:
* for x2, it is reported there are 16 logical operations of which the operand is **NOT** regB.
* adding this to the number of logical operations that **DO** have reg B, gives us 21. This makes sense as this covers ALL the 21 logical operations. :smiley:

