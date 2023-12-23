from django.db import models
import uuid
from accounts.models import UserAccount
from template.models import Categorie


class WorkFlowTemplate(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=100)
    categories= models.ManyToManyField(Categorie)
    description = models.TextField()
    premium = models.BooleanField(default=False)
    active = models.BooleanField(default=False)
    important = models.BooleanField(default=False)
    icon = models.ImageField(upload_to='icons/')
    user_id = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name="add_by_user_workflow")
    created_at = models.DateTimeField(auto_now_add=True,null=True,blank=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name_plural = "WorkFlow Template"


class WorkFlowSteps(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=80,null=True,blank=True)
    step_title = models.CharField(max_length=80,null=True,blank=True)
    step_no = models.CharField(max_length=80)
    WorkFlowTemplate= models.ForeignKey(WorkFlowTemplate,on_delete=models.CASCADE,related_name="WorkFlowTemplateId")
    created_at = models.DateTimeField(auto_now_add=True,null=True,blank=True)


    def __str__(self):
        return self.title

    class Meta:
        verbose_name_plural = "WorkFlow Steps"


class WorkFlowField(models.Model):
    COMPONENT_CHOICES = [
        ('textarea', 'textarea'),
        ('select', 'select'),
    ]
    TYPE_CHOICES = [
        ('string', 'string'),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    label_title = models.CharField(max_length=100,null=True,blank=True)
    step_no = models.CharField(max_length=80)
    WorkFlow_Steps= models.ForeignKey(WorkFlowSteps,on_delete=models.CASCADE,related_name="WorkFlowStepsId")
    pre_define_value = models.TextField(null=True,blank=True)
    component = models.CharField(max_length=20, choices=COMPONENT_CHOICES)
    type_field = models.CharField(max_length=20, choices=TYPE_CHOICES)
    required = models.BooleanField(default=True)
    placeholder = models.CharField(max_length=100)
    range_of_text = models.PositiveIntegerField()
    maxLength = models.PositiveIntegerField(null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True,null=True,blank=True)

    def __str__(self):
        return str(self.label_title)+"  ( "+str(self.WorkFlow_Steps) +" )"
    class Meta:
        verbose_name_plural = "WorkFlow Fields"
