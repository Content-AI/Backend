from datetime import datetime, timedelta, timezone

import pytz

def format_timedelta(td):
    # Calculate years, weeks, days, hours, and minutes
    years, days = divmod(td.days, 365)
    weeks, days = divmod(days, 7)
    hours, seconds = divmod(td.seconds, 3600)
    minutes, seconds = divmod(seconds, 60)

    # Build the formatted string
    if years > 0:
        return f"{years} year{'s' if years > 1 else ''} ago"
    elif weeks > 0:
        return f"{weeks} week{'s' if weeks > 1 else ''} ago"
    elif days > 0:
        return f"{days} day{'s' if days > 1 else ''} ago"
    elif hours > 0:
        return f"{hours} hour{'s' if hours > 1 else ''} ago"
    elif minutes > 0:
        return f"{minutes} minute{'s' if minutes > 1 else ''} ago"
    else:
        return f"{seconds} second{'s' if seconds > 1 else ''} ago"


def format_time_elapsed(datetime_value):
    datetime_value = datetime_value

    current_time = datetime.now(timezone.utc)
    time_difference = current_time - datetime_value

    if time_difference < timedelta(minutes=1):
        seconds = int(time_difference.total_seconds())
        return f"{seconds} sec{'s' if seconds != 1 else ''} ago"
    elif time_difference < timedelta(hours=1):
        minutes = int(time_difference.total_seconds() // 60)
        return f"{minutes} min{'s' if minutes != 1 else ''} ago"
    elif time_difference < timedelta(days=1):
        hours = int(time_difference.total_seconds() // 3600)
        return f"{hours} hr{'s' if hours != 1 else ''} ago"
    elif time_difference < timedelta(weeks=1):
        days = time_difference.days
        return f"{days} day{'s' if days != 1 else ''} ago"
    else:
        weeks = int(time_difference.days // 7)
        return f"{weeks} week{'s' if weeks != 1 else ''} ago"


from datetime import datetime, timedelta, timezone

def updated_time_format(datetime_value):
    datetime_value = datetime.strptime(datetime_value, "%Y-%m-%dT%H:%M:%S.%fZ").replace(tzinfo=timezone.utc)

    current_time = datetime.now(timezone.utc)
    time_difference = current_time - datetime_value

    if time_difference < timedelta(minutes=1):
        seconds = int(time_difference.total_seconds())
        return f"{seconds} sec{'s' if seconds != 1 else ''} ago"
    elif time_difference < timedelta(hours=1):
        minutes = int(time_difference.total_seconds() // 60)
        return f"{minutes} min{'s' if minutes != 1 else ''} ago"
    elif time_difference < timedelta(days=1):
        hours = int(time_difference.total_seconds() // 3600)
        return f"{hours} hr{'s' if hours != 1 else ''} ago"
    elif time_difference < timedelta(weeks=1):
        days = int(time_difference.total_seconds() // 86400)
        return f"{days} day{'s' if days != 1 else ''} ago"
    else:
        weeks = int(time_difference.total_seconds() // 604800)
        return f"{weeks} week{'s' if weeks != 1 else ''} ago"

from datetime import datetime

def format_time_month_day(created_at):
    # Parse the time string into a datetime object
    datetime_obj = datetime.strptime(created_at, '%Y-%m-%dT%H:%M:%S.%fZ')
    # Format the datetime object as "Month day, Year"
    formatted_date = datetime_obj.strftime('%B %d, %Y')
    
    return formatted_date
