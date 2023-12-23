from django.db import models
from accounts.models import UserAccount
from django.core.validators import MinLengthValidator
import uuid
from multiselectfield import MultiSelectField

from accounts.models import UserAccount
import base64


class Categorie(models.Model):
    category = models.CharField(max_length=100)
    def __str__(self):
        return self.category


    class Meta:
        verbose_name_plural = "Template Category"

class Template(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=100)
    categories= models.ManyToManyField(Categorie,null=True,blank=True)
    description = models.TextField()
    what_to_generate = models.TextField()
    premium = models.BooleanField(default=False)
    active = models.BooleanField(default=False)
    important = models.BooleanField(default=False)
    icon = models.ImageField(upload_to='icons/')
    user_id = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name="add_by_user")

    def __str__(self):
        return self.title

    class Meta:
        verbose_name_plural = "Templates"


class Template_Field(models.Model):
    COMPONENT_CHOICES = [
        ('text', 'text'),
        ('textarea', 'textarea'),
        ('select', 'select'),
        ('Example', 'Example'),
    ]
    TYPE_CHOICES = [
        ('string', 'string'),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    steps=models.CharField(max_length=80,null=True,blank=True)
    title = models.CharField(max_length=80)
    pre_define_value = models.TextField(null=True,blank=True)
    template= models.ForeignKey(Template,on_delete=models.CASCADE,related_name="TemplateIdTemplateField")
    component = models.CharField(max_length=20, choices=COMPONENT_CHOICES)
    type_field = models.CharField(max_length=20, choices=TYPE_CHOICES)
    label = models.CharField(max_length=100,null=True,blank=True)
    required = models.BooleanField(default=True)
    placeholder = models.CharField(max_length=100)
    range_of_text = models.PositiveIntegerField()
    maxLength = models.PositiveIntegerField(null=True,blank=True)

    def __str__(self):
        return str(self.title)+"  ( "+str(self.template) +" )"


    class Meta:
        verbose_name_plural = "Template Field"

class Language(models.Model):
    language = models.CharField(max_length=100)

    def __str__(self):
        return self.language

from team_members.models import Workspace

class TemplateAnswerModelOfUser(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name="user_template_answers")
    template_id = models.CharField(max_length=100,null=True,blank=True)
    workspace_id = models.ForeignKey(Workspace, on_delete=models.CASCADE, related_name="workspace_id_of_template_ans",null=True,blank=True)
    answer_response = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.user_id) + " : " +  str(self.answer_response[:10:])

    def get_decoded_answer_response(self):
        return base64.b64decode(self.answer_response).decode('utf-8')

class ProjectTemplate(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.ForeignKey(UserAccount,on_delete=models.CASCADE,related_name="UserIdProject")
    template_answer=models.ManyToManyField(TemplateAnswerModelOfUser,related_name="ProjectTemplateResponse")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.user_id)

class TempalteSelectFieldOptions(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.ForeignKey(UserAccount,on_delete=models.CASCADE,related_name="UserIdSelectField")
    value=models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.user_id)
    class Meta:
        verbose_name_plural = "Template Field Options"


class TokenGeneratedByOpenAI(models.Model):
    token_generated=models.CharField(max_length=50)
    default_name=models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Token Generated"

class PerTokenGeneratedByOpenAI(models.Model):
    token_generated=models.CharField(max_length=50)
    default_name=models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Per Token By User"


from team_members.models import Workspace
from template.models import Template

class SingleUserTokenGenerated(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    workspace = models.ForeignKey(Workspace, related_name='workspace_user_id', on_delete=models.CASCADE,null=True,blank=True)
    template_used = models.ForeignKey(Template, related_name='template_id_used', on_delete=models.CASCADE,null=True,blank=True)
    user_id = models.ForeignKey(UserAccount,on_delete=models.CASCADE,related_name="TokenGeneratedByUser")
    token_generated=models.CharField(max_length=450)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user_id.email} - {self.token_generated}"

    
    class Meta:
        verbose_name_plural = "Token Per user"



class UploadedImage(models.Model):
    image = models.ImageField(upload_to='images/')  # 'images/' is the directory where the uploaded images will be stored
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.image.name} - {self.uploaded_at}"

class OpenAiToken(models.Model):
    token_generated = models.CharField(max_length=400)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.token_generated} - {self.updated_at}"

    class Meta:
        verbose_name_plural = "Open AI Token"

class OpenAiToken_delete_it_after_test(models.Model):
    token_generated = models.CharField(max_length=400)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.token_generated} - {self.updated_at}"


class GeneratedImageByuser(models.Model):
    img_url = models.TextField(null=True,blank=True)
    our_server_image_name = models.TextField(null=True,blank=True)
    user_id = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name="add_by_user_img_generated",null=True,blank=True)
    workspace_id = models.ForeignKey(Workspace, on_delete=models.CASCADE, related_name="add_by_wrk_ins_img_generated",null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True,editable=True)

    def __str__(self):
        return f"{self.our_server_image_name} - {self.created_at}"


from django.utils import timezone

class GenerateAudioToSpeech(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    video_url = models.TextField(null=True,blank=True)
    url_of_video= models.CharField(max_length=100,blank=True, null=True)
    user_id = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name="add_by_user_audio_speech_generated",null=True,blank=True)
    workspace_id = models.ForeignKey(Workspace, on_delete=models.CASCADE, related_name="add_by_wrk_ins_speech_to_text",null=True,blank=True)
    # minutes = models.TextField(null=True,blank=True)
    minutes = models.IntegerField(null=True, blank=True)
    text_from_audio = models.TextField(null=True,blank=True)
    summarize_text = models.TextField(null=True,blank=True)
    # created_at = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField()


    def save(self, *args, **kwargs):
        if not self.created_at:
            self.created_at = timezone.now()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.url_of_video}"

class HowToSummarizeText(models.Model):
    How_To_summarize = models.TextField(null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.id}"

    class Meta:
        verbose_name_plural = "Speech Summarization"

class TempVideoDetails(models.Model):
    user_account  = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name="tmp_user",null=True,blank=True)
    video_url = models.TextField(null=True,blank=True)
    directory_of_file = models.TextField(null=True,blank=True)
    scripts_of_audio = models.TextField(null=True,blank=True)
    minutes = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class TranscribeSpeechModal(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_account = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name="transcribe_user_id",null=True,blank=True)
    workspace_id = models.ForeignKey(Workspace, on_delete=models.CASCADE, related_name="workspace_id_transcribe_user",null=True,blank=True)
    scripts_of_audio = models.TextField(null=True,blank=True)
    answer_response = models.TextField(null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.user_account) + " : " +  str(self.answer_response[:10:])

