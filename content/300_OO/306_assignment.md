---
title: '306 Assignment 2'
chapter: true
weight: 306
draft: false
---


# Assignment 2

The second assignment is to build your first layered testbench. The DUT, again, is the [ALU](../100_alu/) with the register file that was seen earlier. The test is assumed to be done when the **scoreboard** has received 100 test results, irrespective whether or not the results were correct. When this is amount of tests is reached, the scoreboard should print a summary of the obtained results.

A number of small remarks:

* The generator can (for now) simply generate the same **instruction** over and over;
* All the default components should be present (generator, driver, monitor, checker, scoreboard) in the environment;
* The output should look (something) like the image below.

![Example output](/img/screenshot_a2.png)


# After this chapter you should ...

{{% centeredColumn75 %}}

<ul>
  <li>... have gotten your hands dirty</li>
</ul>

{{% /centeredColumn75 %}}

