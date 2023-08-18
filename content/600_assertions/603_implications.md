---
title: '603 Implications'
chapter: true
weight: 603
draft: false
---

# Implications

The sequences provide the verification engineer with a powerful tool. As with many things, the striking power is very much determined by the creativity and expertise of the wielder. The same holds for **implications**.

Implications allow to implement ... well ... implications. For example *If x is high, then y must high*. The construction consists of an **antecedent** (the initial condition) and a **consequent** (the effect). 

Again there are two different types of implications.

{{% multiHcolumn %}}
{{% column %}}
## Overlapping implications

In this type of implication the consequent is checked starting from the moment of **every** non-empty match of the antecedent.

Writing the implication on the aforementioned example would be done as follows:

{{< highlight systemverilog >}}
x |-> y;
{{< /highlight >}}

![Wavedrom example](/img/screenshot_603_overlapping.png)

{{% /column %}}
{{% column %}}
## Nonoverlapping implications

In this type of implication the consequent is checked starting from **the next clock tick** after each nonempty match of the antecedent.

Writing the implication on the aforementioned example would be done as follows:

{{< highlight systemverilog >}}
x |=> y;
{{< /highlight >}}

![Wavedrom example](/img/screenshot_603_nonoverlapping.png)

{{% /column %}}
{{% /multiHcolumn %}}

## One more word on implications

Implications can be used in **properties**, but NOT in sequences. The critical reader might see a *overlap* between the overlapping implication and the immediate assertion. While they might look similar, there is a subtle difference. In case of an overlapping implication where the antecedent is not succeed, the property (in which it is used) is assumed to succeed. A fancy term for this is: **vacuous success**. In contrast, an immediate assertion will give a warning even if the antecedent is not succeeding.
