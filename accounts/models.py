
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
import os
from django.core.exceptions import ValidationError

def validate_image(image):
    check_exts = (".jpg", ".jpeg", ".png")
    file_extension= os.path.splitext(str(image))
    if image.size >= 5000000:
        raise ValidationError("File should less then 5MB")
    if file_extension[1] == check_exts[0] or file_extension[1] == check_exts[1] or file_extension[1] == check_exts[2]:
        pass
        # raise ValidationError("Delete this if good")
    else:
        raise ValidationError("Provide Valid Image file such as jpeg jpg png")
    if image:
        pass
    else:
        raise ValidationError("Image is not provided")
def validate_last_name(last_name):
    if len(last_name)<=1:
        raise ValidationError("character must be 3 to 10 long")
    if len(last_name)>=20:
        raise ValidationError("character must be 3 to 10 long")
def validate_first_name(first_name):
    if len(first_name)<=3:
        raise ValidationError("character must be 3 to 10 long")
    if len(first_name)>=20:
        raise ValidationError("character must be 3 to 10 long")
def validate_phone_number(value):
    cleaned_value = value.replace("(", "").replace(")", "").replace("-", "")
    if not cleaned_value.isdigit() or len(cleaned_value) != 11:
        raise ValidationError('Phone number must be 11 digits.')

# for now it's google
AUTH_PROVIDERS = {'google': 'google', 'email': 'email'}


class UserAccountManager(BaseUserManager):

    def create_user(self, email, first_name,last_name,three_steps,auth_provider=None,password=None):
        if not email:
            raise ValueError("User must have an email address")            
        email = self.normalize_email(email)
        user = self.model(email=email, first_name=first_name,last_name=last_name,three_steps=True)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, first_name,last_name,auth_provider=None,three_steps=True,password=None):
        user = self.create_user(email,first_name,last_name,auth_provider,three_steps,password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

class UserAccount(AbstractBaseUser, PermissionsMixin):
    STATUS_CHOICES=(
        ('active','active'),
        ('inactive','inactive'),
        ('working','working'),
        ('disable','disable'),
    )
    
    email = models.EmailField(max_length=40,unique=True)
    first_name = models.CharField(max_length=50,validators=[validate_first_name],null=True,blank=True)
    last_name = models.CharField(max_length=50,validators=[validate_last_name],null=True,blank=True)
    # address = models.CharField(max_length=50,null=True,blank=True)
    # phone_no = models.CharField(max_length=30,validators=[validate_phone_number],null=True,blank=True)
    auth_provider = models.CharField(max_length=255, blank=False,null=False, default=AUTH_PROVIDERS.get('email'))
    startDate = models.DateField(auto_now=True)
    status =  models.CharField(max_length=10, choices=STATUS_CHOICES,default="active",null=True,blank=True)
    three_steps =  models.BooleanField(default=True)
    profile_pic = models.ImageField(upload_to ='images/',null=True,blank=True,validators=[validate_image],help_text='Maximum file size allowed is 5MB')
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True,null=True,blank=True)
    username = None
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name','last_name']

    objects = UserAccountManager()

    def get_id(self):
        return self.id

    def __str__(self):
        return self.email



class OTP_TOKEN(models.Model):
    user_id = models.ForeignKey(UserAccount,on_delete=models.CASCADE)
    otp_token = models.CharField(max_length=6)
    validation_count = models.CharField(max_length=10,default=0)
    created_at = models.DateTimeField(auto_now_add=True,null=True,blank=True)

    def __str__(self):
        return str(self.otp_token)

    class Meta:
        verbose_name_plural = "User OTP Token"



class GeneralSetting(models.Model):
    user_id = models.ForeignKey(UserAccount,on_delete=models.CASCADE)
    company_name = models.CharField(max_length=100,null=True,blank=True)
    website = models.CharField(max_length=100,null=True,blank=True)
    billing_email = models.CharField(max_length=50,null=True,blank=True)

    def __str__(self):
        return str(self.company_name)

class UserTokenGenerated(models.Model):
    user_id = models.ForeignKey(UserAccount,on_delete=models.CASCADE)
    token_generated = models.CharField(max_length=100,null=True,blank=True)


class GenerateWordRestrictionForUser(models.Model):
    user = models.ForeignKey(UserAccount,on_delete=models.CASCADE)
    words = models.TextField(default=0)
    created_at = models.DateTimeField(auto_now_add=True,null=True,blank=True)

    def __str__(self):
        return str(self.user.email) + " : " + str(self.words)

    class Meta:
        verbose_name_plural = "User Limitation"


from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from ckeditor.fields import RichTextField  # Import RichTextField instead of CKEditorField



class EmailManager(models.Manager):
    def create_and_send_email(self, subject, recipient, content):
        email = self.create(subject=subject, recipient=recipient, content=content)
        email.send_email()
        return email

class SendEmailToUser(models.Model):
    subject = models.CharField(max_length=200)
    recipient = models.EmailField()
    # content = models.TextField()  # This field will store HTML content
    content = RichTextField()  # Use RichTextField instead of CKEditorField
    sent_date = models.DateTimeField(auto_now_add=True,null=True,blank=True)

    objects = EmailManager()

    def send_email(self):
        try:
            send_mail(
                subject=self.subject,
                message='',  # Leave this empty as you're sending HTML content
                from_email='your_email@example.com',  # Use your sender email here
                recipient_list=[self.recipient],
                html_message=self.content,
            )
            self.sent_date = timezone.now()
            self.save()
            return True
        except Exception as e:
            print("Error sending email:", e)
            return False

    def __str__(self):
        return self.subject
@receiver(post_save, sender=SendEmailToUser)
def send_email_after_save(sender, instance, **kwargs):
    instance.send_email()




class Visitor(models.Model):
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField()
    country = models.TextField()
    latitude = models.TextField()
    longitude = models.TextField()
    city = models.TextField()
    region= models.TextField()
    # count = models.CharField(max_length=10)
    count = models.IntegerField(default=1)  # Use IntegerField for count
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Visitor: {self.ip_address} - {self.created_at}"




class UserFromHubSpot(models.Model):
    email=models.EmailField(null=True,blank=True)
    hubspot_user_id = models.CharField(max_length=500,null=True,blank=True)

    class Meta:
        verbose_name_plural = "User From HubSpot"

    def __str__(self):
        return f"{self.email} - {self.hubspot_user_id}"

class UserApiKey(models.Model):
    user=models.ForeignKey(UserAccount,related_name="api_user_acc",on_delete=models.CASCADE)
    api_key = models.CharField(max_length=30,null=True,blank=True)
    class Meta:
        verbose_name_plural = "User Api Key"



