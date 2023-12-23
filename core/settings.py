from enum import Flag
from pathlib import Path

import os
from dotenv import load_dotenv

load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

import os

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.0/howto/deployment/checklist/

SECRET_KEY = 'LOOWJ@89324aerweroidrjeweklr329329023903kjqwenrwkeqjWIOIWIWWJK3232i3asdfadsfdasf'

# use_db_live="local"
use_db_live="lightsail_postgres"

pro=True
# pro=False

stripe_production=True
# stripe_production=False

if pro:
    DEBUG = False
else:
    DEBUG = True

ALLOWED_HOSTS = ['*']



# Application definition

INSTALLED_APPS = [
    # 'jet',
    'jazzmin',
    'django.contrib.admin',
    # 'admin_interface',
    # 'chartjs',
    # 'colorfield',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    # 'channels',
    'django_filters',
    'djoser',
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_swagger',
    'drf_yasg',
    "accounts",
    "chat",
    "template",
    "documentsData",
    "projectsApp",
    "brand_voice",
    "chat_template",
    "custome_template",
    "subscriptions",
    "team_members",
    "ckeditor",
    "workflow",
    "business_plan",
    "hubspot_data",
    "api_docs",
]


MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'core.middleware.restrict_middleware.RestrictMiddleware',
]

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
# EMAIL_HOST_USER = os.getenv('HOST_USER')
EMAIL_HOST_USER = "codieburh682@gmail.com"
EMAIL_HOST_PASSWORD = "geyebcxjxaqfbfve"
EMAIL_USE_TLS = True
DEFAULT_FROM_EMAIL = 'SASS'

REST_FRAMEWORK = {
    #     'DEFAULT_PARSER_CLASSES': [
    #     'rest_framework.parsers.JSONParser',
    # ],
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend'
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    # 'DEFAULT_RENDERER_CLASSES': [
    #     'rest_framework.renderers.JSONRenderer',
    # ],
    'DEFAULT_SCHEMA_CLASS': 'rest_framework.schemas.coreapi.AutoSchema'
}


ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
                os.path.join(BASE_DIR,'Frontend/build'),
            ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'social_django.context_processors.backends',
                # 'social_django.context_processors.login_redirect' #added this for social-auth
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'
# ASGI_APPLICATION = "core.asgi.application"


# CHANNEL_LAYERS = {
#     "default": {
#         "BACKEND": "channels_redis.core.RedisChannelLayer",
#         "CONFIG": {
#             "hosts": [("localhost", 6379)],
#         },
#     },
# }

# Database
# https://docs.djangoproject.com/en/4.0/ref/settings/#databases


if use_db_live=="local":
    # test mode db for local server
     DATABASES = {
                'default': {
                    'ENGINE': 'django.db.backends.sqlite3',
                    'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
                }
     }
elif use_db_live=="lightsail_postgres":
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': 'postgres',
            'USER': 'dbmasteruser',
            'PASSWORD': '.2aNr<[7)|k0sNgI(.09vgic>FMza[mY',
            'HOST': 'ls-dd6ac7a7fde7febcdd96494f2a722935717608ca.cchckxmlw6np.ap-south-1.rds.amazonaws.com',  # or your database server address
            'PORT': '5432', # Default PostgreSQL port is 5432
        }
    }



# Password validation
# https://docs.djangoproject.com/en/4.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    # {
    #     'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    # },
    # {
    #     'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    # },
    # {
    #     'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    # },
    # {
    #     'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    # },
]


# Internationalization
# https://docs.djangoproject.com/en/4.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True




# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.0/howto/static-files/

STATIC_URL = '/static/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Cors Settings

if pro:
    CORS_ALLOWED_ORIGINS = [
        'https://stripe.com',
        'https://app.uffai.com',
    ]
    CORS_ALLOWED_ORIGIN_REGEXES = [
        'https://stripe.com',
        'https://app.uffai.com',
    ]
else:
    CORS_ALLOW_CREDENTIALS = True
    CORS_ALLOW_ALL_ORIGINS = True # If this is used then `CORS_ALLOWED_ORIGINS` will not have any effect
    CORS_ALLOWED_ORIGINS = [
        'http://localhost:3000',
        'http://localhost:8000',
        'https://stripe.com',
    ]
    CORS_ALLOWED_ORIGIN_REGEXES = [
        'http://localhost:3000',
        'http://localhost:8000',
        'https://stripe.com',
    ]


#STATIC_ROOT = 'staticfiles'
# STATIC_URL = '/static/'

STATIC_ROOT = os.path.join(BASE_DIR,'statiicfiles')

#print("============")
#print(BASE_DIR)
#print("==============")

STATICFILES_DIR = {
    os.path.join(BASE_DIR,"static")
}

MEDIA_ROOT = os.path.join(BASE_DIR,'public/static')
MEDIA_URL = 'data/'

FILE_UPLOAD_HANDLERS = [
    'django.core.files.uploadhandler.TemporaryFileUploadHandler',
]


STATICFILES_DIRS = [
    os.path.join(BASE_DIR,'Frontend/build/static')
]



# REST_FRAMEWORK = {
#     'DEFAULT_AUTHENTICATION_CLASSES': (
#         'rest_framework_simplejwt.authentication.JWTAuthentication',
#     ),
# }



SIMPLE_JWT = {
   'AUTH_HEADER_TYPES': ('JWT',),
   'AUTH_TOKEN_CLASSED':{  #added this for social-auth
       'rest_framework_simplejwt.tokens.AccessToken',
   }
}


SITE_NAME = "SAAS"

DJOSER = {
    # 'LOGIN_FIELD': 'email',
    # 'USER_CREATE_PASSWORD_RETYPE': False,
    # 'PASSWORD_CHANGED_EMAIL_CONFIRMATION': False,
    # 'SEND_CONFIRMATION_EMAIL': True,
    # 'SET_USERNAME_RETYPE': False,
    # 'SET_PASSWORD_RETYPE': False,
    # 'PASSWORD_RESET_CONFIRM_URL': 'password/reset/confirm/{uid}/{token}',
    # 'USERNAME_RESET_CONFIRM_URL': 'email/reset/confirm/{uid}/{token}',
    # 'ACTIVATION_URL': 'activate/{uid}/{token}',
    # 'SEND_ACTIVATION_EMAIL': False,
    # 'SERIALIZERS': {
    #     'user_create': 'accounts.serializer.UserCreateSerializer',
    #     'user': 'accounts.serializer.UserCreateSerializer',
    #     'user_delete': 'djoser.serializer.UserDeleteSerializer',
    # },
}

AUTH_USER_MODEL = 'accounts.UserAccount'



from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=5),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=5),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': False,

    'ALGORITHM': 'HS256',
    'SIGNING_KEY':SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUDIENCE': None,
    'ISSUER': None,

    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',


    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',

    'JTI_CLAIM': 'jti',

    'SLIDING_TOKEN_REFRESH_EXP_CLAIM': 'refresh_exp',
    'SLIDING_TOKEN_LIFETIME': timedelta(minutes=5),
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=1),
}


import stripe
if stripe_production:
    STRIPE_PUBLISHABLE_KEY = 'pk_live_51NZTCUD0PMGPSuj498KUuFDyto6yInGLWEHlB36cg2OIeD1x60heRIOzMyOsMCJwVglu9fWLviAYtDpN2oGcaYao00bU7wFH6q'
    STRIPE_SECRET_KEY='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'


    stripe_key="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"
    stripe.api_key="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"

    monthly_starter_production="prod_PDostNd201dqIp"
    annually_starter_production="prod_PDosk2QHnMoKZQ"
    monthly_premium_production="prod_PDotG2KHg6gv8m"
    annually_premium_production="prod_PDoubufOUNgQaR"

    per_seat_product="prod_Ov8ZcQintlQf3T"

    def get_price_id(plan, monthly_annually):
        if plan == "starter" and monthly_annually == "monthly":
            price_id = "price_1OPNEID0PMGPSuj49Iwq2nCm" # $30
        elif plan == "starter" and monthly_annually == "annually":
            price_id = "price_1OPNF9D0PMGPSuj4xkoaQruG" # $360
        elif plan == "premium" and monthly_annually == "monthly":
            price_id = "price_1OPNFkD0PMGPSuj4PMu2CpTT" # $122
        elif plan == "premium" and monthly_annually == "annually":
            price_id = "price_1OPNXgD0PMGPSuj4Rreb12Zz" # $1185
        else:
            price_id = None
        return price_id
else:
    STRIPE_PUBLISHABLE_KEY = 'pk_test_51NZTCUD0PMGPSuj4WSPtbwrwVJKw7xR4QL0KAwGoj5JCy6zajI8JNcPyoskvbJotDRUYmQM0FYZ4mjHuycSHISCZ00zgM3Z4YV'
    STRIPE_SECRET_KEY = 'sk_test_51NZTCUD0PMGPSuj4SY0Mqqmuy1YkOHa4YFFlHFqaphXE6vdhcCJKtyqsKJ9Wzy10acbth3pUlb04HfzYB2ucvAGg00emcxaUJD'

    stripe_key = 'sk_test_51NZTCUD0PMGPSuj4SY0Mqqmuy1YkOHa4YFFlHFqaphXE6vdhcCJKtyqsKJ9Wzy10acbth3pUlb04HfzYB2ucvAGg00emcxaUJD'
    stripe.api_key = 'sk_test_51NZTCUD0PMGPSuj4SY0Mqqmuy1YkOHa4YFFlHFqaphXE6vdhcCJKtyqsKJ9Wzy10acbth3pUlb04HfzYB2ucvAGg00emcxaUJD'
    

    def get_price_id(plan, monthly_annually):
        if plan == "starter" and monthly_annually == "monthly":
            # price_id = "price_1NZsCED0PMGPSuj4qdoHxgdt" # $78
            price_id = "price_1O8xg6D0PMGPSuj4CiV3BaER"  # $30
        elif plan == "starter" and monthly_annually == "annually":
            # price_id = "price_1NbfuMD0PMGPSuj4Q3Rubjlo" # $465
            price_id = "price_1O8xiVD0PMGPSuj4VpYuM95g" # $360
        elif plan == "premium" and monthly_annually == "monthly":
            price_id = "price_1NZsHID0PMGPSuj4OaNzAmjg"
        elif plan == "premium" and monthly_annually == "annually":
            price_id = "price_1NcstnD0PMGPSuj4VAZT8Uui"
        else:
            price_id = None
        return price_id

    annually_starter_production="prod_OMbTNALNwFBuLh"
    monthly_starter_production="prod_OMbPAS9tJRowUS"
    monthly_premium_production="prod_OMbUVmteO3pZaq"
    annually_premium_production="prod_OMbVL9ZurLLWk7"

    per_seat_product = "prod_OXvZIuqcC85cVy"



HUBSPOT_API_KEY="pat-na1-94e61a9c-1c6a-4b9e-a8fc-1123cd23f1fd"
HUBSPOT_API_KEY_TICKETS = "pat-na1-8d6b43ea-b6d6-4da2-92a2-92358fcf09de"


# GOOGLE
client_id_google='65857693177-41t814nhrml22jptcfdrcqveumamp8al.apps.googleusercontent.com'
client_secret_google='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'


# linkednin
client_id = '86nbyoaj3py59q'
client_secret = 'NQtw9gMCj4zOIUWX'

# FRONT_END_LINKEDIN="http://localhost:3000/linkedin"
# FRONT_END_GOOGLE="http://localhost:3000/google"


FRONT_END_LINKEDIN="https://app.uffai.com/linkedin"
FRONT_END_GOOGLE="https://app.uffai.com/google"


if use_db_live=="local":
    endpoint_secret_key = 'whsec_161bf20260f274cae28fdac564631c8a1b6f4c06f6de7a97719fbb98ec10aa4c' #local
    FRONT_END_HOST="http://localhost:3000"
    BACK_END_HOST="http://localhost:8000"

if use_db_live=="lightsail_postgres":

    if stripe_production:
        endpoint_secret_key = 'whsec_SAq1xSAQfck3enXoTqanNMwVsxsG1rBS' # server real key
    else:
        endpoint_secret_key = 'whsec_RU4rprIF29HmIkoenxPSMl1ziNeWQx4s' # server

    BACK_END_HOST="https://app.uffai.com"
    FRONT_END_HOST="https://app.uffai.com"
    


JAZZMIN_SETTINGS = {
    # title of the window (Will default to current_admin_site.site_title if absent or None)
    "site_title": "AI Content",

    # Title on the login screen (19 chars max) (defaults to current_admin_site.site_header if absent or None)
    "site_header": "AI Content",

    # Title on the brand (19 chars max) (defaults to current_admin_site.site_header if absent or None)
    "site_brand": "AI Content",
}


CKEDITOR_JQUERY_URL = 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js'  # Replace with your preferred jQuery version
CKEDITOR_UPLOAD_PATH = 'uploads/'
CKEDITOR_CONFIGS = {
    'default': {
        'toolbar': 'full',  # Customize the toolbar as needed
        'height': 400,      # Set the editor height
        'width': 620,       # Set the editor width
    },
}






AWS_ACCESS_KEY_ID = 'AKIA23ZBBWRD5BVZDBM2'
AWS_SECRET_ACCESS_KEY = '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'
AWS_STORAGE_BUCKET_NAME = 'aiprojectfilestorage'
AWS_S3_SIGNATURE_NAME = 's3v4',
AWS_S3_REGION_NAME = 'ap-southeast-2'
AWS_S3_FILE_OVERWRITE = False
AWS_DEFAULT_ACL =  None
AWS_S3_VERITY = True
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
AWS_S3_CUSTOM_DOMAIN="aiprojectfilestorage.s3-ap-southeast-2.amazonaws.com"




# Configure session engine (use database-based sessions)
SESSION_ENGINE = "django.contrib.sessions.backends.db"

# Configure session cookie name
SESSION_COOKIE_NAME = "my_custom_cookie_name"

# Set session expiration (optional)
SESSION_COOKIE_AGE = 3600  # Set session expiration to 1 hour (3600 seconds)



# LOGIN_URL = '/admin/login/'
# LOGIN_REDIRECT_URL = '/admin/template/tokengeneratedbyopenai'



# SWAGGER_SETTINGS = {
#     'SECURITY_DEFINITIONS': {},
# }

SWAGGER_SETTINGS = {
    'SECURITY_DEFINITIONS': {
        'api_key': {
            'type': 'apiKey',
            'in': 'header',
            'name': 'Api-Key',
        }
    },
    'USE_SESSION_AUTH': False,  # Disable Django session authentication
    'JSON_EDITOR': False,  # Disable JSON editor for request/response bodies
    'SHOW_REQUEST_HEADERS': True,  # Show request headers
}
