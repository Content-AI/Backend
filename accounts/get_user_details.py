import requests

import concurrent.futures

def get_user_subs_details(url):
    response = requests.get(url)
    print("sending response")

    print("=======")
    print(response.content)
    print("=======")