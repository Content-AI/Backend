from django.db import models

class TimestampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True,null=True,blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        abstract = True

class TicketIssue(TimestampedModel):
    issues=models.CharField(max_length=300,null=True,blank=True)

    class Meta:
        verbose_name_plural = "Ticket Issue"

    def __str__(self):
        return f"{self.issues}"


