---
title: '307 Checker & scoreboard'
chapter: true
weight: 307
draft: false
---

A number of steps on the OO-ladder have already been taken. First of all, there is the **interface** that does all the pin-interconnecting. One layer above there are the **driver** and the **monitor**. These two components translate between the software world and the hardware world.

The **driver** is instructed by the **generator**, through the use of **transactions**. In this final section the path will be completed. 

First, there is the **checker**, that verifies the result as seen by the monitor against a *golden value*.

And, finally, there is a **scoreboard** that collects all the results.

Neither of these components will introduce new concepts, but for the sake of completeness they are discussed here. However, coming up with the *golden reference* will require some more work.

<!-- {{% notice tip %}}
It is pointed out that there is no precise separation of tasks to certain components. In general it is clear what each compent does, but the exact borders between tasks are not set in stone. What is taught here is a default approach.
{{% /notice %}} -->

# Checker

{{% multiHcolumn %}}
{{% column %}}
{{< highlight systemverilog >}}
`include "transaction.sv"

class checkers;

  mailbox #(transaction) gen2che;
  mailbox #(shortint) mon2che;
  mailbox #(bit) che2scb;

  function new(mailbox #(shortint) m2c, mailbox #(bit) c2s);
    this.mon2che = m2c;
    this.che2scb = c2s;
  endfunction : new

  task run; 
    shortint expected_result, received_result;

    string s;

    $timeformat(-9,0," ns" , 10);
    s = $sformatf("[%t | CHE] I will start checking", $time);
    $display(s);

    forever 
    begin  
      this.mon2che.get(received_result);

      /* do something to get the.
         For now, have this placeholder */
      received_result = expected_result;

      if (received_result == expected_result)
      begin
        this.che2scb.put(bit'(1));
      end else begin
        this.che2scb.put(bit'(0));
      end
    end
  endtask
  
endclass : checkers
{{< /highlight >}}
{{% /column %}}
{{% column %}}

The **checker** uses multiple mailboxes. There is one *incoming* communication channel from the generator. This will be required to be able to determine the *golden value*; there is another *incoming* channel from the monitor for providing the obtained result, and finally, there is one *outgoing* channel to the scoreboard (for keeping score).

{{% notice warning %}}
Please note that **checker** is a keyword in SystemVerilog. Hence, the name of the class is checker<u>**s**</u>.
{{% /notice %}}

When the expected outcome, or *golden value* is determined, the checker compares whether or not this value matches with obtained result. In the example, there is simply a placeholder.

Its decision is then sent to the **scoreboard**. Note the type to which the **che2scb** mailbox is fixed.

{{% /column %}}
{{% /multiHcolumn %}}


# Scoreboard

{{% multiHcolumn %}}
{{% column %}}

An example of a scoreboard is given here. There should be nothing out-of-the-usual here.

One point that is worth mentioning is the conclusion that all blocks up-until-this-point are running **forever**. (Or they will be if you look at the entire code for this example :wink:)

A closer look at the scoreboard shows that this run( ) function only runs for a certain amount of test vectors.

{{% /column %}}
{{% column %}}
{{< highlight systemverilog >}}
class scoreboard;

  mailbox #(bit) che2scb;

  int NO_tests;

  int no_tests_done;
  int no_tests_ok;
  int no_tests_nok;

  function new(mailbox c2s);
    this.che2scb = c2s;
    NO_tests = 0;
    no_tests_done = 0;
    no_tests_ok = 0;
    no_tests_nok = 0;
  endfunction : new


  task run(int NOT);
    byte result;
    string s;
    this.NO_tests = NOT;

    $timeformat(-9,0," ns" , 10);
    s = $sformatf("[%t | SCB] I will start keeping score", $time);
    $display(s);

    while (this.no_tests_done < this.NO_tests)
    begin
      this.che2scb.get(result);

      no_tests_done++; 
      
      if (result > 0)
      begin 
        no_tests_ok++; 
        //$display("[SCB] successful test registered");
      end else begin
        no_tests_nok++;
        //$display("[SCB] unsuccessful test registered");
      end
    end /* while*/
  endtask : run


  task showReport;
    $display("[SCB] Test report");
    $display("[SCB] ------------");
    $display("[SCB] # tests done         : %0d", this.no_tests_done);
    $display("[SCB] # tests ok           : %0d", this.no_tests_ok);
    $display("[SCB] # tests failed       : %0d", this.no_tests_nok);
    $display("[SCB] # tests success rate : %0.2f", this.no_tests_ok/this.no_tests_done*100);
  endtask : showReport


endclass : scoreboard
{{< /highlight >}}
{{% /column %}}
{{% /multiHcolumn %}}