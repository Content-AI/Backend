from django.db import models
from accounts.models import UserAccount
from django.core.validators import MinLengthValidator
import uuid
from django.utils import timezone
from team_members.models import Workspace

class TimestampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True,null=True,blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        abstract = True

class ChatRootModel(TimestampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.ForeignKey(UserAccount,on_delete=models.CASCADE,related_name="chat_room_user_id")
    # workspace_id = models.ForeignKey(Workspace,on_delete=models.CASCADE,related_name="chat_room_workspace")
    root = models.BooleanField(default=True,editable=False)
    trash= models.BooleanField(default=False)

    def default_title():
        # Get the current date in the format %Y-%m-%d
        current_date = timezone.now().strftime("%Y-%m-%d")

        # Find the maximum number for existing titles
        existing_titles = ChatRootModel.objects.filter(title__startswith="Untitled")
        max_number = 0
        for title in existing_titles:
            try:
                number = int(title.title.split("Untitled ")[1].split(" ")[0])
                max_number = max(max_number, number)
            except ValueError:
                continue

        # Increment the number and return the new title
        new_number = max_number + 1
        return f"Untitled {new_number} ({current_date})"

    title = models.CharField(max_length=80, default=default_title)
    def __str__(self):
        return str(self.id)+ " : "+str(self.user_id)+ " : " + str(self.title)

class ChatContentModel(TimestampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.ForeignKey(UserAccount,on_delete=models.CASCADE,related_name="chat_content_user_id")
    chat_root = models.ForeignKey(ChatRootModel,on_delete=models.CASCADE,related_name="chat_root_relation")
    root = models.BooleanField(default=False,editable=False)
    question = models.TextField() # it was description in front end
    content = models.TextField()

    def __str__(self):
        return str(self.id)+ " : "+str(self.user_id)+ " : " + str(self.question)

    
