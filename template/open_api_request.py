import openai
from datetime import datetime, timezone
from template.times_convert import format_time_elapsed
from template.models import TokenGeneratedByOpenAI,PerTokenGeneratedByOpenAI
import re


def estimate_tokens_from_text(text):
    character = text.split()  # Split text into words
    word_count = len(character)
    tokens_per_word = 1 / 5  # 5 character is 1 token
    estimated_tokens = word_count * tokens_per_word
    return round(estimated_tokens)

def count_token_data(data):
    count_token = estimate_tokens_from_text(data)
    try:
        PerTokenGeneratedByOpenAI.objects.create(default_name="token",token_generated=int(count_token))
        instance=TokenGeneratedByOpenAI.objects.get(default_name="token")
        count_database=instance.token_generated
        instance.token_generated=int(instance.token_generated)+int(count_token)
        instance.save()
    except:
        pass


try:
    from template.models import OpenAiToken
    openai.api_key=OpenAiToken.objects.get(id=1).token_generated
    API_TOKEN=OpenAiToken.objects.get(id=1).token_generated
except:
    pass




# def makeAPIRequest(ask_question_to_gpt):
    # import requests

    # url = "https://api.openai.com/v1/chat/completions"
    # headers = {
    #     "Content-Type": "application/json",
    #     "Authorization": f"Bearer {API_TOKEN}"
    # }
    # data = {
    #     "messages": [
    #         {"role": "user", "content": ask_question_to_gpt},
    #     ],
    #     "model": "gpt-4",
    #     "temperature": 0.5,
    #     "max_tokens":300
    # }
    # response = requests.post(url, headers=headers, json=data)
    # result = response.json()
    # generated_text = result["choices"][0]["message"]
    # count_token_data(generated_text["content"])
    # return generated_text
    # =======old api request ===

def makeAPIRequest(ask_question_to_gpt):
    # response = openai.Completion.create(
    #     engine="gpt-3.5-turbo",
    #     prompt=ask_question_to_gpt,
    #     temperature=0.7,
    #     max_tokens=300,
    # )

    # generated_text = response.choices[0].text
    # count_token_data(generated_text) # send text only
    # resp_data = {"role": "system", "content": generated_text}
    # return resp_data


    # =======old api request ===
    import requests

    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_TOKEN}"
    }
    data = {
        "messages": [
            {"role": "user", "content": ask_question_to_gpt},
        ],
        "model": "gpt-3.5-turbo",
        # "model": "gpt-4",
        "temperature": 0.7,
        "max_tokens":500
    }
    response = requests.post(url, headers=headers, json=data)
    result = response.json()
    generated_text = result["choices"][0]["message"]
    count_token_data(generated_text["content"])
    return generated_text
    # =======old api request ===

def ask_little_more(ask_question_to_gpt):
    
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": ask_question_to_gpt}
        ]
    )

    datetime_value = datetime.now(timezone.utc)
    response['choices'][0]['message']["created_at"]=format_time_elapsed(datetime_value)
    count_token_data(response['choices'][0]['message']['content'])
    return response['choices'][0]['message']

    # response = openai.Completion.create(engine="gpt-3.5-turbo",prompt=ask_question_to_gpt,temperature=0.7,max_tokens=500,)

    # generated_text = response.choices[0].text
    # count_token_data(generated_text)
    # resp_data = {"role": "system", "content": generated_text}
    # return resp_data

    # =======new api request ===
    # import requests

    # url = "https://api.openai.com/v1/chat/completions"
    # headers = {
    #     "Content-Type": "application/json",
    #     "Authorization": f"Bearer {API_TOKEN}"
    # }
    # data = {
    #     "messages": [
    #         {"role": "user", "content": ask_question_to_gpt},
    #     ],
    #     "model": "gpt-3.5-turbo",
    #     "temperature": 0.5,
    #     # "max_tokens":500
    # }

    # response = requests.post(url, headers=headers, json=data)
    # result = response.json()
    # generated_text = result["choices"][0]["message"]
    # count_token_data(generated_text["content"])
    # return generated_text


def summarize_text(ask_question_to_gpt):

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": ask_question_to_gpt}
        ]
    )

    datetime_value = datetime.now(timezone.utc)
    response['choices'][0]['message']["created_at"]=format_time_elapsed(datetime_value)
    count_token_data(response['choices'][0]['message']['content'])
    return response['choices'][0]['message']

def makechatrequest(ask_question_to_gpt):
    # =======old api request ===
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        # model="gpt-4",
        messages=[
            {"role": "user", "content": ask_question_to_gpt}
        ]
    )
    count_token_data(response['choices'][0]['message']['content'])
    return response['choices'][0]['message']["content"]
    # =======old api request ===
    
def givemeBestTitle(answer):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": "One title for this content (only two word)  \n "+ str(answer[:30])}
        ]
    )
    count_token_data(response['choices'][0]['message']['content'])
    return response['choices'][0]['message']["content"]

def summarize_in_tone(question):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": str(question) + "\n what is the tone of this text in twenty words not in points in sentence"}
        ]
    )
    count_token_data(response['choices'][0]['message']['content'])
    return response['choices'][0]['message']["content"]

def summarize_in_tone_url(question):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": str(question) + "\n what is the tone of this text in twenty words not in points in sentence"}
        ]
    )
    count_token_data(response['choices'][0]['message']['content'])
    return response['choices'][0]['message']["content"]


def give_me_one_word_of_content(question):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": str(question)}
        ]
    )
    count_token_data(response['choices'][0]['message']['content'])
    return response['choices'][0]['message']["content"]


