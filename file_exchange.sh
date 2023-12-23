#!/bin/bash

# Define source and destination directories
source_dir="/home/ubuntu/ai-aws/statiicfiles"
destination_dir="/home/ubuntu/ai-aws"

# Define the commands to run
commands=(
  "rm -rf $destination_dir/statiicfiles/static" # Remove the existing 'static' directory if it exists
  "mkdir -p $destination_dir/static"
  "cp -r $source_dir/. $destination_dir/static"
  "mv $destination_dir/static $destination_dir/statiicfiles"
  "cp -r /home/ubuntu/ai-aws/Frontend/build/static/js/. $destination_dir/statiicfiles/static/js"
  "cp -r /home/ubuntu/ai-aws/Frontend/build/static/css/. $destination_dir/statiicfiles/static/css"
)

# Iterate through the commands and execute them with a 5-second gap
for cmd in "${commands[@]}"; do
  echo "Running: $cmd"
  $cmd
  sleep 5
done

echo "All tasks completed."
