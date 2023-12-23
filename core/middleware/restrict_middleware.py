from core.urls import version_api
class RestrictMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Check if the request path starts with the desired version
        if request.path.startswith(f'/{version_api}/'):
            # Perform your restriction logic here
            # if anythings need to restrict then use this middle ware 
            pass
        # Continue with the normal flow
        response = self.get_response(request)
        # print(request.user)
        return response
