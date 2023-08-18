---
title: '303 Join or fail'
chapter: true
weight: 303
draft: false
---

# Join or fail

So ... you noticed that the final exercise failed, didn't you ?

This is due to the fact that we are simulating hardware in software. More precisely, we're simulating hardware that runs everything in parallel. The simulation is done in software, which typically is sequential.

Now how to fix this ?

### Enter concurrent processes

To achieve support for parallel pieces of software, threads can be used. In Verilog2001 the **fork...join** construct was added. SystemVerilog adds two additional variants: **fork...join_any** and **fork...join_none**. How this multi-threaded approach works, can be explained easiest with a drawing.

Let's assume there are four "tasks" in software: <span style="color: blue; font-weight: bold">a</span>, <span style="color: red; font-weight: bold">b</span>, <span style="color: #90EE90; font-weight: bold">c</span>, and <span style="color: black; font-weight: bold">d</span>. Note that this can also be a function or method call, or a simple one-line statement. Simply writing &nbsp; ``` a; b; c; d;``` will start task <span style="color: blue; font-weight: bold">a</span>. When this is done, task  <span style="color: red; font-weight: bold">b</span> will be started, and so on. 

To start every task in its own dedicated thread, they should be wrapped in a **fork-statement**. The three available options for a fork-statement are:


* **fork ... join** runs all the statements in parallel. The first statement after the *fork ... join* (task **d**) will be executed when **all** parallel statements are finished.
* **fork ... join_any** runs all the statements in parallel. The first statement after the *fork ... join_any* (task **d**) will be executed when **the first** of the parallel statements is finished.
* **fork ... join_none** runs all the statements in parallel. The first statement after the *fork ... join_none* (task **d**) will be executed immediately after initiating the parallel statements.

![Simulation screenshot driver](/img/forks.png)

Adding **disable fork** and **wait fork** to the mix, gives you a lot of control.

* **disable fork;** terminates all remaining forked blocks
* **wait fork;** causes calling process to block until all the sub-statements are completed.

{{% notice warning %}}
The **disable fork** statement stops <u>all active threads</u> that were <u>spawned from the current thread</u>. The problem is that this may accidentally stop threads that you did not intended to.
<!-- <br/> -->
<!-- <br/> -->
<!-- **Always** put a fork...join block around code that uses a disable fork to create a sort-of firewall. This construct creates a new thread and limits the scope of the disable fork statement. -->
{{% /notice %}}

### Back to the Environment

{{% multiHcolumn %}}
{{% column %}}
With all that tackled, the **environment** can be fixed.

When the **run()** method is called, 2 threads need to be started in parallel: 1 for the driver, and 1 for the monitor. This allows to run both instances in parallel.

The fork is closed with a **join_any**. 


After giving 10 clock cycles of spin-up, the *downstream* threads are started in a *join_any*. If you remember, the **Monitor** has a *forever* loop, so the **this.mon.run()** will never end. This implies that the fork is ended when the driver ends.

To illustrate this, the **Transcript** windows of both simulations (with and without fork) are shown below.
{{% /column %}}
{{% column %}}
{{< highlight systemverilog >}}
class environment;

  virtual gbprocessor_iface ifc;

  driver drv;
  monitor mon;

  function new(virtual gbprocessor_iface ifc);
    this.drv = new(ifc);
    this.mon = new(ifc);
  endfunction : new

  task run();
    fork
      this.drv.run_addition();
      this.mon.run();
    join_any;

    $display("[ENV]: end of run()");

  endtask : run

endclass : environment
{{< /highlight>}}
{{% /column %}}
{{% /multiHcolumn %}}

![MON](/img/screenshot_303_mon.png)

Take a close look at the **timestamp** of the message that stated the Monitor will start working.