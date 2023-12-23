from django.contrib import admin

from hubspot_data.models import TicketIssue

class TicketIssueAdmin(admin.ModelAdmin):
    list_display = ['issues','updated_at', 'created_at']
    list_filter = ['issues','updated_at', 'created_at']
    search_fields = ['issues','updated_at', 'created_at']
    ordering = ['-updated_at']
    list_per_page = 20

admin.site.register(TicketIssue, TicketIssueAdmin)
