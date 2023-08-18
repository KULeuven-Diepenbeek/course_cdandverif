---
title: '604 Assignment 5'
chapter: true
weight: 604
draft: true
---

# Assignment 5

For this assignment you will be writing assertions for an **AHB-bus** arbiter. Such a bus arbiter manages the control of an AHB bus, that can be driven by multiple masters.

![AHB arbiter](/img/screenshot_604_ahb_arbiter.png)


{{% multiHcolumn %}}
{{% column %}}

When a master wants access to the AHB bus it has to 

* raise the **request** signal
* wait for the **grant** signal
    * this will come **within** 16 clock cycles if no other grant is active. The arbiter works Round Robin.
* raise the **lock** signal if there will be a locked (which signals an indivisible transfer).

More remarks:

* multiple requests can be pending
* only **one** master can be granted access
* You'll probably need to {{% google %}}

{{% /column %}}
{{% column %}}

The **minimum** criteria to be asserted (to pass this assignment) are:

* *grant* can only be given to 1 master
* *grant* is always given
* *grant* goes LOW after a *ready*

... but feel free to assert more.

{{% /column %}}
{{% /multiHcolumn %}}