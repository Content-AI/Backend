from django.urls import path ,include
from template.views import history_transcribe,generate_transcribe_text_answer,convert_audio,file_first_step,getting_the_recap_of_audio,extracting_speech_from_video,uploading_video,history_audio_video,history_url,movie_file_to_text,check_video,image_generator,team_template_user_user,user_template_user_user,team_user_token_generation,single_user_token_generation,team_token_generated,count_custom_template,ImpTemplate,favorite,token_generated_single_users,token_generated_by_users,token_generated,upload_image,test,select_field_of_template,TemplateDef,TemplateFieldDef,categories,project_template,TemplateResponseOfTemplate,Languages,TemplateUserAnswer,single_response


urlpatterns = [
    path('data', TemplateDef, name='TemplateDef'),
    path('imp_template', ImpTemplate, name='ImpTemplate'),
    path('field', TemplateFieldDef, name='TemplateDef'),

    path('image_generator', image_generator, name='image_generator'),
    
    # path('stream_data', stream_data, name='stream_data'),
    # path('stream_data',StreamGeneratorView.as_view(),name='generate_stream'),

    path('check_video', check_video, name='check_video'),
    path('uploading_video', uploading_video, name='uploading_video'),
    path('extracting_speech_from_video', extracting_speech_from_video, name='extracting_speech_from_video'),
    path('getting_the_recap_of_audio', getting_the_recap_of_audio, name='getting_the_recap_of_audio'),

    # path('movie_file_to_text', movie_file_to_text, name='movie_file_to_text'),
    path('file_first_step/', file_first_step, name='file_first_step'),
    path('convert_audio/', convert_audio, name='convert_audio_to_mp3'),
    # path('file_first_step', file_first_step, name='file_first_step'),
    
    path('generate_speech_text_answer/', generate_transcribe_text_answer, name='generate_speech_text_answer'),
    
    # path('videos_length', movie_file_to_text, name='movie_file_to_text'),
    
    path('history_url', history_url, name='history_url'),
    path('history_audio_video', history_audio_video, name='history_audio_video'),
    path('history_transcribe', history_transcribe, name='history_transcribe'),


    path('response_of_template', TemplateResponseOfTemplate, name='TemplateResponseOfTemplate'),

    path('history/<str:id>', TemplateUserAnswer, name='TemplateUserAnswer'),
    path('language',Languages, name='Language'),
    path('categories',categories, name='categories'),
    path('single_response/<str:data>',single_response, name='single_response'),
    path('project_template/<str:data>',project_template, name='project_template'),
    path('select_field_of_template',select_field_of_template, name='select_field_of_template'),
    path('test',test, name='test'),
    path('upload-image/', upload_image, name='upload_image'),

    path('token_generated/', token_generated, name='token_generated'),
    path('team_token_generated/', team_token_generated, name='team_token_generated'),
    path('single_user_token_generation/', single_user_token_generation, name='single_user_token_generation'),
    path('team_user_token_generation/', team_user_token_generation, name='team_user_token_generation'),
    
    path('user_template_user_user/', user_template_user_user, name='user_template_user_user'),
    path('team_template_user_user/', team_template_user_user, name='team_template_user_user'),

    path('token_generated_by_users/', token_generated_by_users, name='token_generated_by_users'),
    path('token_generated_single_users/', token_generated_single_users, name='token_generated_single_users'),
    path('count_custom_template/', count_custom_template, name='count_custom_template'),
    path('favorite/', favorite, name='favorite'),
    # path('total_token_generated/', upload_image, name='upload_image'),
]