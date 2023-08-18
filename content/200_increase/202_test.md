---
title: '202 Updating test'
chapter: true
weight: 202
draft: false
---

# Updating the test

Adding more features to the DUT is all nice, but this has to be reflected in the verification. 

As the DUT now looks different, the **interface** needs to be adapted. It no longer connects to the ALU, but to the **gbprocessor**.

![newtest](/img/newtest.png)

Initially, **register A** starts at value 0x00. When the instruction ```ADC H``` is executed, then **register A** gets incremented with 5.

![newtest](/img/screenshot_202_sim.png)

{{% notice note %}}
Have a closer look at the waveforms. After the ADC operation, the value of register A is updated. However, this results in a consecutive change of the ALU output **'Z'**.<br/><br/>Why is this new value not stored in register A ?
{{% /notice %}}

Repeating this instruction 3 more times will result in a change of the value in **register F**.

![newtest](/img/screenshot_202_sim2.png)

{{% notice note %}}
Find an explanation why **register F** changes.
{{% /notice %}}