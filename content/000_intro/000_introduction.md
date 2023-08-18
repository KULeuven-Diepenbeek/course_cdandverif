---
title: '000 Introduction'
chapter: true
weight: 1
---

# Introduction

In these lab series a deeper dive is taken into verification. Up until now, you'll probably (and hopefully) have made a number of **testbenches**. These testbenches were focussed on the behaviour of a handful of components. It is still good practise to do this. When you're making a hardware driver for a *stepper motor*, it's only common sense that you test your design.

Something that occurs with many beginning hardware designers is that they only test [happy path](https://en.wikipedia.org/wiki/Happy_path). Let's try to illustrate this with an example. Assume you made a hardware implementation of AES. 

{{% centeredColumn %}}

<ol>
  <li>Find a <b>testvector</b></li>
  <li>Write a <b>testbench</b> that applies this testvector as stimuli to the design</li>
  <li>Start the <b>simulator</b> and run for the required amount of time</li>
  <li><b>Verify</b> that the encrypted vector matches with the expected result</li>
</ol>

{{% /centeredColumn %}}

{{% notice note %}}
One swallow doesn't make a summer.</br>It doesn't matter whether it's an African or a European swallow :wink:
{{% /notice %}}

Many more things need to be test to be assured that the design works. What if ... **1)** an internal register is not set to the required value after an iteration ? **2)** a specific value triggers something unwanted inside ? **3)** an operation is interrupted halfway through an encryption ? **4)** a user applies the inputs in a different way ?

Testing these scenario's *could* (and typically *will*) uncover underlying shortcomings. If the design becomes more complicated, the job of the verification engineer becomes even more challenging.

Imagine this scenario:

{{% centeredColumn %}}

You are the chief engineer of some fancy company and you're responsible for a new chip in a mobile-phone series. How can you be ensured that the chip can handle the following scenario:

<ul>
  <li>The phone is playing music through some streaming app</li>
  <li>The user listens to the music through headphones which are connected through Bluetooth</li>
  <li>The battery is running low</li>
  <li>There is a handover happening between cell towers</li>
  <li>...</li>
  
</ul>

... and on that moment, there is an incoming call.

{{% /centeredColumn %}}

What kind of testbench would you start coding that guarantees you that the chip can handle this ?

</br>
</br>
In these lab series the industry standard **SystemVerilog** will be introduced. The verification capabilities of this language help the poor chief engineers to sign off the approval document in (relative) confidence.
