---
title: '505 Assignment 4'
chapter: true
weight: 505
draft: false
---

# Assignment 4

This assignment works in an cumulative way. Try to obtain 100% coverage and, upon reaching 100%, stop the simulation. For this exercise it is decided that **100% coverage** is reached when:

  * at least 100 **XORs** are executed after immediately after a **SBC**
  * at least 1000 **CPs** are executed
  * at least 20 **SUB** instructions should be done with **register E**
  * the amount of arithmetic operations should roughly be 3 times the amount of logical operations
  * at least 327 logical instructions are done without **register A**

{{% notice tip %}}
To have your simulation **halt** after achieving 100% coverage, and no longer on a certain number of operations, there is a built-in function **$get_coverage( )**.
<br/>
Make sure you only count the instructions if they are valid and no reset is being done !!!
{{% /notice %}}