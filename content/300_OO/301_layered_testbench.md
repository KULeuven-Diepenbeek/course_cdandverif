---
title: '301 Layered testbench'
chapter: true
weight: 301
draft: false
---

# Layered testbench

Some of you might be thinking: **"That assignment and those exercises did not differ too much from the classical approach."**. If so, you're right. From this point on, however, the layered testbench will be climbed. 


![The layered testbench](/img/layeredTB.png)

The concept in SystemVerilog is to build a layered testbench:

* **Signal layer**: The bottom-most layer is the signal layer. On this level only the DUT resides. The signals that going to and from the DUT represent actual signals. Aspects like rise-times and clock cycles are important only on this level. This level mainly serves **connectivity**.
* **Command layer**: The second layer is the command layer. This is an edge layer that translates signals from the software world into physical signals. This includes translations to conceptual interfaces like AXI4Stream. Transactions are done, in two directions, by the *driver* and the *monitor*. Assertions will be handled more thoroughly, later.
* **Functional level**: At this level of abstraction, the tester no longer concerns himself/herself with signals and protocols, but focuses on the application level. Coming up with *questions* and determining the *answer* is done here. Also the checking of the observed outcome to the correct *answer* happens here. Finally, this layer keeps score :smiley:
* **Scenario**: The highest level of abstraction is the scenario layer. In this layer different *scenarios* can be checked (what a surprise). Everybody should be familiar with **happy path** (when everything happens as it should, nobody is breaking any rules, nor trying to). A scenario where every 1% of the time something happens can be tested on this level, as example.
* **Control**: Finally, an overarching layer controls all the layers.

## Going step-by-step

During the first assignment, you've *driven* the DUT directly. A total of 256 different testvectors were thrown at the DUT. The next step is to do this in a more SystemVerilog-like way.

{{% multiHcolumn %}}
{{% column %}}
{{< highlight systemverilog >}}
class driver;

  /* Virtual interface */
  virtual gbprocessor_iface ifc;

  /* Constructor */
  function new(virtual gbprocessor_iface ifc);
    this.ifc = ifc;
  endfunction : new

  /* run_addition method */
  task run_addition();
    string s;
    
    $timeformat(-9,0," ns" , 10); /* format timing */

    /* print message */
    s = $sformatf("[%t | DRV] I will start driving for addition", $time);
    $display(s);
    
    /* start with reset */
    this.ifc.reset <= 1'b1;
    repeat(10) @(posedge this.ifc.clock);

    this.ifc.reset <= 1'b0;
    repeat(10) @(posedge this.ifc.clock);

    /* execute instructions */
    this.ifc.valid <= 1'b1;
    this.ifc.instruction <= 8'h81;
    @(posedge this.ifc.clock);

    this.ifc.valid <= 1'b1;
    this.ifc.instruction <= 8'h82;
    @(posedge this.ifc.clock);

    this.ifc.valid <= 1'b0;
    this.ifc.instruction <= 8'h00;
    @(posedge this.ifc.clock);

    /* print message */
    s = $sformatf("[%t | DRV] done", $time);
    $display(s);
  endtask : run_addition

endclass : driver
{{< /highlight>}}
{{% /column %}}

{{% column %}}
Behold ... the first class: **driver**. 

As you might recognise from other OO-languages, this class 'driver' has:

* a single property **ifc**,
* one constructor **new( )**, and 
* a single class method **run_addition( )**.

It is pointed out that the **this** keyword should be used to distinguish between a local variable and a class member. In the line ```this.ifc = ifc;``` the left-hand *ifc* targets the class member. The right-hand occurrence of *ifc* targets the local variable that was given as a function argument. 

In the example, there is only one method **run_addition()**. When this method is called, it resets the DUT and then gives it 2 instructions. 

{{% /column %}}
{{% /multiHcolumn %}}

Finally, there is one more important keyword: **virtual**. In SystemVerilog the interface is considered *static*. This makes sense as there should be **only one** interface that connects the test environment with the DUT. Classes, in contrast, are *dynamic* by nature. This also comes natural as class instances (or objects) are created dynamically.

Because of this duality, it is not allowed to declare an interface within a class. The solution for this is to work with a *placeholder* that will be substituted with the actual interface. This is achieved by the **virtual** keyword. A *virtual interface* is a variable of a certain interface type that is used to facilitate access to the interface from within in a class.

{{% notice note %}}
**TL;DR** &nbsp; for the interface: use virtual.
{{% /notice  %}}


## Building the testbench

Keeping in mind one of the big benefits from SystemVerilog, being modularity and re-usability, it should not come as a surprise that the amount of files and hierarchy is substantial. **Don't let that scare you !!** The image below shows a simple example.

![The layered testbench](/img/files.png)

The highest block is the testbench: **top(.sv)**. On the righthand-side there is the **gbprocessor(.sv)**. Note that the design itself could also consist of many files. The interface, **ALU_iface(.sv)**, is already discussed but is now simply stored in a separate file. 

The *software* is all contained and managed by **test(.sv)**. For now, the only thing this does is instantiating an **environment(.sv)**. The purpose of this environment will become clear later on in these labs. Finally, the only thing the environment currently does is instantiating the **driver(.sv)**.

*Hehe*, that was a lot of files and a seemingly pointless hierarchy. Below are basic examples of: top.sv, test.sv, and environment.sv. 


<script>
function openTab(evt, tabName) {
  // Declare all variables
  var i, tabcontent, tablink;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
} 
</script>

<div class="tab">
  <button class="tablink" onclick="openTab(event, 'example_02_top')">top.sv</button>
  <button class="tablink" onclick="openTab(event, 'example_02_tst')">test.sv</button>
  <button class="tablink" onclick="openTab(event, 'example_02_env')">environment.sv</button>
</div>


<!-- ************************************************* -->
{{% tab id="example_02_top" name="top.sv"%}}

{{< highlight systemverilog >}}
`include "gbprocessor_iface.sv"
`include "test.sv"

module top;
    logic clock=0;

    // clock generation - 100 MHz
    always #5 clock = ~clock;

    // instantiate an interface
    gbprocessor_iface gb_iface (
        .clock(clock)
    );

    // instantiate the DUT and connect it to the interface
    gbprocessor dut (
        .reset(gb_iface.reset),
        .clock(clock),
        .instruction(gb_iface.instruction),
        .valid(gb_iface.valid),
        .probe(gb_iface.probe)
    );

    // SV testing 
    test tst(gb_iface);

endmodule : top
{{< /highlight >}}

{{% /tab %}}


<!-- ************************************************* -->
{{% tab id="example_02_tst" name="test.sv"%}}

{{< highlight systemverilog >}}
`include "gbprocessor_iface.sv"
`include "environment.sv"

program test (gbprocessor_iface ifc);

  environment env = new(ifc);

  initial
  begin
    env.run();
  end

endprogram : test
{{< /highlight >}}
{{% /tab %}}

<!-- ************************************************* -->
{{% tab id="example_02_env" name="environment.sv"%}}

{{< highlight systemverilog >}}
`include "driver.sv"

class environment;

  virtual gbprocessor_iface ifc;

  driver drv;

  function new(virtual gbprocessor_iface ifc);
    this.drv = new(ifc);
  endfunction : new


  /* Task : run
   * Parameters :
   * Returns :
  **/
  task run();
    this.drv.run_addition();
  endtask : run

endclass : environment
{{< /highlight >}}
{{% /tab %}}

<!-- ************************************************* -->


If you add the *driver.sv*, as illustrated above, you can start running the simulator. The result of this should look like shown below.

![Simulation screenshot driver](/img/screenshot_301_sim.png)


## Now you try this !!