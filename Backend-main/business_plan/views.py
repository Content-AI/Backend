from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_ratelimit.decorators import ratelimit
from django.core.mail import send_mail
from rest_framework import status

from django.template.loader import render_to_string
from django.http import JsonResponse

def validate_data(request_data):
    error_fields = {}

    # Check if the required fields are present
    required_fields = ['email', 'fullName', 'companyName', 'messageDetails', 'phone']
    for field in required_fields:
        if field not in request_data:
            error_fields = f"{field} is required"

    # Validate Full Name
    if 'fullName' in request_data and len(request_data['fullName']) > 20 or len(request_data['fullName']) <= 3:
        error_fields = "Full Name must be 20 characters or less"

    # Validate Email
    if 'email' in request_data:
        from django.core.validators import validate_email
        from django.core.exceptions import ValidationError
        try:
            validate_email(request_data['email'])
        except ValidationError:
            error_fields = "Invalid email format"

    # Validate Phone Number
    # if 'phone' in request_data and len(request_data['phone']) <= 12:
    #     error_fields['phone'] = "Phone number must be 12 characters"

    # Validate Message Length
    if 'messageDetails' in request_data and len(request_data['messageDetails']) > 1000 or len(request_data['messageDetails']) <= 20:
        error_fields = "Type a little more details Message so we can clearly go through it !!"

    return error_fields


@api_view(['POST'])
@ratelimit(key='user', rate='1/10m', method='POST', block=True)  # Allow 1 requests per 10 minutes
@permission_classes([IsAuthenticated])
def contact_sales(request):



    error_fields = validate_data(request.data)

    if error_fields:
        return Response({"message": error_fields}, status=400)
    else:
        subject = 'Contact For Business Plan : '+str(request.data.get('email',""))
        template_name = 'business_plan.html'
        context = {'email_of_customer': str(request.data.get('email',"")),
                    'message':str(request.data.get('messageDetails',"")),
                    'full_name':str(request.data.get('fullName',"")),
                    'phn_no':str(request.data.get('phone',"")),
                    'cmp_name':str(request.data.get('companyName',""))
                }
        email_content = render_to_string(template_name, context)
        recipient_emails = ["webcentralnepal@gmail.com"]
        AMDIN_EMAIL = "kcroshan682@gmail.com"
        send_mail(
            subject,
            email_content,
            'test@gmail.com',
            [AMDIN_EMAIL]+recipient_emails,
            html_message=email_content,
            fail_silently=False
        )

        return Response({"message":"We will get back soon"},status=200)
