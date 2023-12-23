from datetime import datetime
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.core.mail import send_mail
from django.template.loader import render_to_string
from subscriptions.models import Subscription

class Command(BaseCommand):
    help = 'Send subscription reminders to users based on their subscription status and expiration dates.'

    def handle(self, *args, **kwargs):
        subscriptions = Subscription.objects.all()

        for subscription in subscriptions:
            if subscription.status == "trial":
                trail_ends = subscription.trail_ends

                # Check if trail_ends is in string format and convert it to a datetime object
                if isinstance(trail_ends, str):
                    trail_ends = datetime.strptime(trail_ends, "%Y-%m-%dT%H:%M:%S.%fZ")

                # Calculate the difference between trail_ends dates
                if trail_ends:
                    current_date = timezone.now().date()
                    difference = trail_ends.date() - current_date
                    if difference.days <= 0:
                        # Send a "trail ends" email here
                        subject = 'Your trial subscription is ending soon'
                        template_name = 'send_email_to_user_for_remainder_of_subscription.html'
                        context = {'user_name': "subscription.user.username"}
                        email_content = render_to_string(template_name, context)
                        send_mail(
                            subject,
                            email_content,
                            'your-email@example.com',  # Replace with your sender email
                            ["kcroshan682@gmail.com"],
                            html_message=email_content,
                            fail_silently=False
                        )
                        self.stdout.write(self.style.SUCCESS(f'Sent trail email to subscription.user.username'))
            else:
                given_datetime = subscription.end_at
                current_datetime = datetime.now(given_datetime.tzinfo)

                # Compare the given datetime with the current datetime
                if given_datetime < current_datetime:
                    # Send a "subscription is ending" email here
                    subject = 'Your subscription is ending soon'
                    template_name = 'send_email_to_user_for_remainder_of_subscription.html'
                    context = {'user_name': "subscription.user.username"}
                    email_content = render_to_string(template_name, context)
                    send_mail(
                        subject,
                        email_content,
                        'your-email@example.com',  # Replace with your sender email
                        ["kcroshan682@gmail.com"],
                        html_message=email_content,
                        fail_silently=False
                    )
                    self.stdout.write(self.style.SUCCESS(f'Sent subscription ending email to subscription.user.username'))
                elif given_datetime == current_datetime:
                    self.stdout.write(self.style.SUCCESS(f'The given datetime is the same as the current datetime for subscription.user.username'))
                else:
                    self.stdout.write(self.style.SUCCESS(f'The given datetime is in the future for subscription.user.username'))
