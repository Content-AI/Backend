from rest_framework_simplejwt.tokens import RefreshToken

def generate_token(user):
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)
    return {"refresh":str(refresh),"access":access_token,"three_steps":user.three_steps}
