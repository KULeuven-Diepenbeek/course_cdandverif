---
title: '302 Adding a monitor'
chapter: true
weight: 302
draft: false
---

# Adding a monitor

With our scaffolding starting to take form, it's time to start filling the reserved spots. First up is the monitor. As you might recall from the previous section, the **Monitor** resides on the *Command layer* and receives data from the **DUT**. This way SystemVerilog can evaluate how the DUT handled the given inputs.

{{% multiHcolumn %}}
{{% column %}}
{{< highlight systemverilog >}}
class monitor;

  /* Virtual interface */
  virtual gbprocessor_iface ifc;

  /* Constructor */
  function new(virtual gbprocessor_iface ifc);
    this.ifc = ifc;
  endfunction : new

  /* run method */
  task run();
    string s;
    byte a, b, z;
    bit sample = 0;
    byte instruction;
    
    $timeformat(-9,0," ns" , 10); /* format timing */

    /* print message */
    s = $sformatf("[%t | MON] I will start monitoring", $time);
    $display(s);

    forever begin
      /* wait for falling edge of the clock */
      @(negedge this.ifc.clock);

      /* if sampling is required, sample */
      if(sample == 1)
      begin
        s = $sformatf("[%t | MON] I sampled %x (with %x)", $time, this.ifc.probe, instruction);
        $display(s);

        sample = 0;
      end 

      /* determine whether sampling is required */
      if(this.ifc.valid == 1)
      begin
        sample = 1;
        instruction = this.ifc.instruction;
      end /* if valid */
        
    end /* forever */
  endtask : run

endclass : monitor

{{< /highlight>}}
{{% /column %}}

{{% column %}}
This code shows a minimal implementation for a monitor.

A number of remarks were already made for the driver:

* the class
* the class property for the interface. Note that the type is again a **virtual interface**.
* a constructor function
* a run task

The main difference with the driver code (for now) is the **forever** loop. Once the monitor has started, it'll keep on working until the end of time (or shut down). 

Here it becomes **a little tricky**: the value of the probe only changes 1 clock cycle after a valid instruction. Therefore, samling is only done **if there was valid instruction in the previous clock cycle**.

The first step is to wait on a **negedge** off the clock. Once this has been detected, sampling will be done, if the previous clock cycle was a meaningful instruction.

After (possible) sampling, it has to be determined whether or not sampling is required **in the NEXT clock cycle**.
{{% /column %}}
{{% /multiHcolumn %}}

There is a simple line of code that could have great impact: ```instruction = this.ifc.instruction``` As is already explained <a href="../../100_various/103_interfaces#datatypes" target="_blank">earlier</a> there are 2-state and 4-state variables. If you remember, a *byte* is an eight bit 2-state value; and the pins from the **DUT** (being described in HDL) are a 4-state type. **Don't get fooled by this !!**

### Some help

As this could become tricky, SystemVerilog also adds a number of operators. These can come in handy when having to deal with these translations between 2-state and 4-state values.

{{% centeredColumn %}}
<ul>
  <li><span style="font-weight: bold; width: 50px; text-align: center; display: inline-block">===</span> true if equal (with X and Z included)</li>
  <li><span style="font-weight: bold; width: 50px; text-align: center; display: inline-block">!==</span> true if not equal (with X and Z included)</li>
  <li><span style="font-weight: bold; width: 50px; text-align: center; display: inline-block">==?</span> true if equal (with X and Z as wildcard)</li>
  <li><span style="font-weight: bold; width: 50px; text-align: center; display: inline-block">!=?</span> true if not equal (with X and Z as wildcard)</li>
</ul>
{{% /centeredColumn %}}

{{% multiHcolumn %}}
{{% column %}}
What would be the output of this code ?
{{% /column %}}
{{% column %}}
{{< highlight systemverilog >}}
module operators_demo;
  logic [3:0] a, b;

  initial 
  begin
    a = 4'b1001;
    b = 4'b10X1;

    if (a ==? b)
      $display("YES");

    if (a !== b)
      $display("YES");
  end
endmodule
{{< /highlight>}}
{{% /column %}}
{{% /multiHcolumn %}}


## Integrating the monitor

Now, with the first version of the monitor ready-and-understood, it has be inserted into the test. It should not come as a surprise that it will reside in the **environment**, next to the driver.


{{% multiHcolumn %}}
{{% column %}}
{{< highlight systemverilog >}}
`include "driver.sv"
`include "monitor.sv"

class environment;

  virtual gbprocessor_iface ifc;

  driver drv;
  monitor mon;

  function new(virtual gbprocessor_iface ifc);
    this.drv = new(ifc);
    this.mon = new(ifc);
  endfunction : new

  task run();
    this.drv.run_addition();
    this.mon.run();
  endtask : run

endclass : environment
{{< /highlight>}}
{{% /column %}}
{{% column %}}
With all that tackled, the **monitor** can be added in the **environment**.

Next is the code for the **run( )** task inside the **environment**. This will run the correct methods in both the driver and the monitor.
{{% /column %}}
{{% /multiHcolumn %}}

## Now you try this !!

<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>

{{% notice warning %}}
This will **fail**. Although you might have already spotted why, this will be discussed in the next section.
{{% /notice %}}