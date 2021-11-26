#!/bin/bash

ROOT=https://cdn.jsdelivr.net/gh/warpprism/cdn@1.8.0/autopiano/static/samples/bright_piano/

declare -a AAA=("A" "B" "C" "D" "E" "F" "G" "As" "Bs" "Cs" "Ds" "Es" "Fs" "Gs")

# get length of an array
echo ${#AAA[@]}

# use for loop to read all values and indexes
for (( a=0; a<${#AAA[@]}; a++ ));
do
	for((i=0; i<7; i++));
	do
		curl -o ${AAA[$a]}${i}.mp3 ${ROOT}${AAA[$a]}${i}.mp3
	done
done

