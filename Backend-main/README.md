## Running with virtual environment

### Setup python virtual environment


### create Environment using
* python -m venv env

###  Activate the environment
    for windows:
        .   env/Scripts/activate.bat
    for mac:
        .   source env/bin/activate



### Install requirments
* pip install -r requirements.txt

### Make migrations and migrate
* python manage.py makemigrations
* python manage.py migrate

### Run server
* python manage.py runserver


### In env file

> DEBUG=True
> DATABASE_URL=127.0.0.1
> HOST_USER=
> HOST_PASSWORD=
> AMDIN_EMAIL=
> GOOGLE_CLIENT_ID=
