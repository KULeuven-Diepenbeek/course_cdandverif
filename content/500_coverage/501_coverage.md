---
title: '501 Coverage'
chapter: true
weight: 501
draft: false
---

# Coverage

By now, hopefully, you are starting to see the potential of SystemVerilog. Up until this point a lot of concepts were introduced and code has already been written, but take a look at the amount of tests that were done. In the final assignment a total of **2'000 different testvectors** were applied to the DUT.

A question that now might arise is: **How much verification is enough ?**

To address this question, the next topic in these labs is **coverage**. 
There are two types of coverage in SystemVerilog: 

* Code coverage
* Functional coverage

Code coverage is simple, in contrast to functional verification, which is extremely complex and requires a lorry-load of experience.

## Code coverage

Code coverage is done automatically by the simulator. However, by default it is *disabled*. The purpose of code coverage is to check whether or not every line of the code is reached.

To enable the use of code coverage, an additional argument has to be given to the compiler. For example:

{{% multiHcolumn %}}
{{% column %}}

Indicate, during **compilation**, that coverage statistics are needed.

> vlog -sv ALU_iface.sv -cover bcestf

* **b** collect branch statistics
* **c** collect condition statistics
* **e** collect expression statistics
* **s** collect statement statistics
* **t** collect toggle statistics
* **f** collect toggle statistics

{{% /column %}}

{{% column %}}

Indicate, during **simulation**, that that coverage statistics is needed.

> vsim -voptargs="+acc" -coverage top

{{% /column %}}
{{% /multiHcolumn %}}

With these additional arguments set, the simulation has to be ran again. Finally, the simulator should have some means of displaying the code coverage. In case of *QuestaSim*, this is done by changing the *Layout* to *Coverage*.

![Changing the QuestaSim layout](/img/code_coverage_layout.png)

This should result in something like is shown below.

![Testing without GUI](/img/code_coverage.png)

{{% notice note %}}
Code coverage can be useful but it is merely a tool to assist the verification engineer. Having complete code coverage doesn't say anything on the functional verification of the design.
{{% /notice %}}
