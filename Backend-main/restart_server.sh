#!/bin/bash

# Define source and destination directories
source_dir="/home/ubuntu/ai-aws/statiicfiles"
destination_dir="/home/ubuntu/ai-aws"

# Define the commands to run
commands=(
  "sudo systemctl restart gunicorn"
  "sudo systemctl daemon-reload"
  "sudo systemctl restart gunicorn.socket gunicorn.service"
  "sudo nginx -t"
  "sudo systemctl restart nginx"
)

# Iterate through the commands and execute them with a 5-second gap
for cmd in "${commands[@]}"; do
  echo "Running: $cmd"
  $cmd
  sleep 5
done

echo "Server Restarted"