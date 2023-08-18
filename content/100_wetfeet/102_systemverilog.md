---
title: '102 SystemVerilog'
chapter: true
weight: 102
---

# ALU testing - with SystemVerilog

After the introductions of **VHDL** and **Verilog** in earlier courses, it is time to visit the new kind on the block: **SystemVerilog**. Although, *new* is relative. SystemVerilog has first appeared in 2002 and is a part of the IEEE standard since 2008. VHDL has first appeared in 1980 and Verilog in 1984.

Both VHDL and Verilog are **hardware description languages (HDL)**. The idea is you use the *language* to **describe** the design you made. SystemVerilog is also a hardware description language, but it is also a **hardware verification language (HVL)**.

{{% notice warning %}}
Although SystemVerilog **can** be used as an HDL, in these labs the focus lies on the **HVL**.
{{% /notice %}}


## Synthesizable vs Non-synthesizable code

In the earlier HDL courses a distinction was made between **synthesizable** and **non-synthesizable** code. The former is code can, as the names states, be run through the synthesis tool. In other words, you describe something that can be built with standard cells (ASIC) or can be implemented in reconfigurable fabric (FPGA).

<div class="multicolumn">
  <div class="column">
    <h4>Synthesizable</h4>
    {{< highlight vhdl >}}
PREG: process (clock)
begin
  if rising_edge(clock) then 
    if reset = '1' then 
      regX <= (others => '0');
    else
      if load_reg = '1' then 
        regX <= regX_i;
      elsif shiftL_reg = '1' then 
        regX <= regX(regX'high-1 downto 0) &  '0';
      end if;
    end if;
  end if;
end process;
    {{< /highlight >}}
  </div>
  <div class="column">
    <h4>Non-synthesizable</h4>
    {{< highlight vhdl >}}
PSTIM: process
begin
  regX_i <= x"AB12";
  load_reg <= '0';
  shiftL_reg <= '0';
  wait for 10 ns;

  shiftL_reg <= '1';
  wait for 10 ns;

  shiftL_reg <= '0';
  wait for 10 ns;
  
  wait;
end process;
    {{< /highlight >}}
  </div>
</div>

Both in VHDL and Verilog, non-synthesisable code is valid, but only for testbenches. The SystemVerilog language has a much larger part that is for verification only.

The image below occurred in a paper by Sutherland and Mills ([link to the article](https://sutherland-hdl.com/papers/2013-SNUG-SV_Synthesizable-SystemVerilog_paper.pdf)). It shows the versions and added keywords to Verilog through time. Every rectangle is backward compatible with all the inner rectangles. 

{{% figure src="/img/sv_keywords.png" title="Verilog to SystemVerilog growth chart" %}}

The outer rectangle (SystemVerilog-2005/2009/2012) shows what was added by SystemVerilog. The added keywords/concepts are separated in *design* and *verification*. This illustrates SystemVerilog being both a HDL and HVL, and distinguishes the synthesizable and non-synthesisable code.

{{% notice note %}}
These labs have no intention of going over all the different keywords and making small exercises on each of them. The idea is that the concepts are addressed and the keywords will make their introduction as we go.
{{% /notice %}}

One keyword, however, is important to spot: **classes**.

## Object-oriented approach
With SystemVerilog you will no longer *write a testbench*. You rather write software that generates the testbenches, apply them, and only examine the results.

Most of the techniques you learned in software courses can be applied here. Well known functions in the OO-world are featured in SystemVerilog:

* Inheritance
* Polymorphism
* Encapsulation
* Abstract type modelling

A user-defined class becomes a data type and can have properties (= class data), and methods (= class methods).

<div class="multicolumn">
  <div class="column">
    {{< highlight systemverilog >}}
// class declaration
class ExampleClass;

  // data members - class properties
  int x;

  // class methods
  function set(int i);
    x = i;
  end function

  function int get();
    return x;
  end function

endclass
    {{< /highlight >}}
  </div>
  <div class="column">
    {{< highlight systemverilog >}}
// make an instance
ExampleClass ec1;
ec1 = new;

// make an instance in another way
ExampleClass ec2 = new;
    {{< /highlight >}}
  </div>
</div>

With this OO-approach, the developed code can be reused more efficiently.
