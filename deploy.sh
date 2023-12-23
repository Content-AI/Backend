#!/bin/bash

# Change to your Django project directory
cd /home/ubuntu/ai-aws

# Run additional commands before deploying Django project
source_dir="/home/ubuntu/ai-aws/statiicfiles"
destination_dir="/home/ubuntu/ai-aws"

commands=(
  "rm -rf $destination_dir/statiicfiles/static" # Remove the existing 'static' directory if it exists
  "mkdir -p $destination_dir/static"
  "cp -r $source_dir/. $destination_dir/static"
  "mv $destination_dir/static $destination_dir/statiicfiles"
  "cp -r /home/ubuntu/ai-aws/Frontend/build/static/js/. $destination_dir/statiicfiles/static/js"
  "cp -r /home/ubuntu/ai-aws/Frontend/build/static/css/. $destination_dir/statiicfiles/static/css"
)

for cmd in "${commands[@]}"; do
  echo "Running: $cmd"
  $cmd
  sleep 5
done

# Start Gunicorn socket
sudo systemctl start gunicorn.socket

sleep 3

# Enable Gunicorn socket (auto-start on boot)
sudo systemctl enable gunicorn.socket

sleep 3

# Check the status or display information about the Gunicorn socket
file /run/gunicorn.sock

sleep 3

# Reload systemd manager configuration
sudo systemctl daemon-reload

sleep 3

# Restart Gunicorn
sudo systemctl restart gunicorn

# Additional deployment commands, if any
# ...
