sudo systemctl restart gunicorn
sleep 3

sudo systemctl daemon-reload
sleep 3
sudo systemctl restart gunicorn.socket gunicorn.service
sleep 3

sudo nginx -t && sudo systemctl restart nginx
sleep 3

sudo systemctl start gunicorn.socket
sleep 3
sudo systemctl enable gunicorn.socket
sleep 3

sudo systemctl status gunicorn.socket
sleep 3

file /run/gunicorn.sock
sleep 3

sudo systemctl status gunicorn
sleep 3

curl --unix-socket /run/gunicorn.sock localhost
sleep 3

sudo systemctl daemon-reload
sleep 3
sudo systemctl restart gunicorn
