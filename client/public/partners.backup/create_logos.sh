#!/bin/bash

# Array of company names
companies=(
  "NOKIA"
  "SONY ERICSSON"
  "TOM TOM"
  "GARMIN"
  "MONTBLANC"
  "AMAZON"
  "TEXAS INSTRUMENTS"
  "ANALOG DEVICES"
  "QUALCOMM"
  "MAXIM INTEGRATED"
  "OSRAM"
  "LG INNOTEK"
  "1LIFE"
  "MMI HOLDINGS"
  "UNISURE"
  "HANNOVER RE"
  "ABACUS INSURANCE"
  "PRECIUM"
  "AHI"
)

# Corresponding filenames
filenames=(
  "nokia"
  "sony-ericsson"
  "tomtom"
  "garmin"
  "montblanc"
  "amazon"
  "texas-instruments"
  "analog-devices"
  "qualcomm"
  "maxim-integrated"
  "osram"
  "lg-innotek"
  "1life"
  "mmi-holdings"
  "unisure"
  "hannover-re"
  "abacus-insurance"
  "precium"
  "ahi"
)

# Create SVG for each company
for i in "${!companies[@]}"; do
  company="${companies[$i]}"
  filename="${filenames[$i]}"
  
  # Adjust font size based on text length
  textlen=${#company}
  if [ $textlen -gt 15 ]; then
    fontsize=28
  elif [ $textlen -gt 10 ]; then
    fontsize=36
  else
    fontsize=48
  fi
  
  cat > "${filename}.svg" << SVGEOF
<svg width="300" height="100" xmlns="http://www.w3.org/2000/svg">
  <text x="150" y="60" font-family="Arial, sans-serif" font-size="${fontsize}" font-weight="700" fill="#ffffff" text-anchor="middle">${company}</text>
</svg>
SVGEOF
done

echo "Created ${#companies[@]} logo files"
