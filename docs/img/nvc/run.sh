#!/bin/bash

extractImages.sh cdandverif_images.drawio.pdf ALU classic_sim files layeredTB forks probe instruction crosscoverage helloworld newtest

for i in ALU classic_sim layeredTB files forks probe instruction crosscoverage helloworld newtest
do
  convert $i.pdf ../$i.png
done
