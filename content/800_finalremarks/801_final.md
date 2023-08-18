---
title: '801 Final remarks'
chapter: true
weight: 801
---

# Final remarks

In these labs it was tried to show a different, more professional approach to verification. If there is one take away from these labs it should be: **there is more to testing than writing a testbench that successfully executes 1 testvector**.

Through the use SystemVerilog, all the good of object oriented programming can be brought into hardware verification. 

Using the **coverage** capabilities that are by-design in SystemVerilog, is a flexible way to achieve a bug-free, working implementation.

Assertions were briefly touched, but there is much more to it. Luckily for us, there are working groups like the [Open Verification Library (OVL) Working Group](https://www.accellera.org/activities/working-groups/ovl). They provide a library of assertion checkers.

Finally, SystemVerilog is not the terminus, but rather the starting point. The [Universal Verification Methodology (UVM)](https://en.wikipedia.org/wiki/Universal_Verification_Methodology) is the de-facto industry standard to verify (large) designs. It is written in SystemVerilog and provides a lot templates for classes like: a generator, a transaction, or a [driver](https://www.chipverify.com/uvm/uvm-driver).


We hope we've opened your eyes to see how complicated, but also how fascinating verification can be. Let's rise the glass to bug-free hardware designs.
