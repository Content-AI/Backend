from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response


from .models import CreateAdsPhoto
# from .serializers import PhotoSerializer,CustomPhotoSerializer
from .serializers import CreateAdsPhotoSerializer,CustomPhotoSerializer

# class PhotoListCreateView(generics.ListCreateAPIView):
#     queryset = Photo.objects.all()
#     serializer_class = PhotoSerializer




class PhotoListCreateView(generics.ListCreateAPIView):
    queryset = CreateAdsPhoto.objects.all()
    serializer_class = CreateAdsPhotoSerializer


    def get(self, request):
        documents = CreateAdsPhoto.objects.all()
        serializer = CustomPhotoSerializer(documents, many=True)
        return Response(serializer.data)



# class PhotoRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = CreateAdsPhoto.objects.all()
#     serializer_class = CreateAdsPhotoSerializer




import requests


class CreateFromApiDocumentList(APIView):
    # permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request,pk=None):

        # Fetch data from the Unsplash API
        page = self.request.query_params.get('page', 1)
        per_page = self.request.query_params.get('per_page', 10)
        url = f'https://api.polotno.com/api/get-unsplash?query=&per_page={per_page}&page={page}&KEY=nFA5H9elEytDyPyvKL7T'
        response = requests.get(url)

        data = response.json().get('results', [])

        # try:
        for index in range(0,len(data)):
            breakpoint()
            CreateAdsPhoto.objects.create(
                    slug=data[index]["slug"],
                    width=data[index]["width"],
                    height=data[index]["height"],
                    color=data[index]["color"],
                    blur_hash=data[index]["blur_hash"],
                    description=data[index]["description"],
                    alt_description=data[index]["alt_description"],
                    breadcrumbs=data[index]["breadcrumbs"],
                    urls_raw=data[index]["urls"]["raw"],
                    urls_full=data[index]["urls"]["full"],
                    urls_regular=data[index]["urls"]["regular"],
                    urls_small=data[index]["urls"]["small"],
                    urls_thumb=data[index]["urls"]["thumb"],
                    urls_small_s3=data[index]["urls"]["small_s3"],
                    links_self=data[index]["links"]["self"],
                    links_html=data[index]["links"]["html"],
                    links_download=data[index]["links"]["download"],
                    links_download_location=data[index]["links"]["download_location"],
                    likes=data[index]["likes"],
                    liked_by_user=True,
                    current_user_collections=data[index]["current_user_collections"],
                    # sponsorship_impression_urls=data[index]["sponsorship"]["impression_urls"][0],
                    sponsorship_impression_urls=None,
                    tagline=None,
                    # tagline=data[index]["sponsorship"]["tagline"],
                    tagline_url=data[index]["sponsorship"]["tagline_url"],
                    sponsor_id=data[index]["sponsorship"]["sponsor"]["id"],
                    sponsor_updated_at=data[index]["sponsorship"]["sponsor"]["updated_at"],
                    sponsor_username=data[index]["sponsorship"]["sponsor"]["username"],
                    sponsor_name=data[index]["sponsorship"]["sponsor"]["name"],
                    sponsor_first_name=data[index]["sponsorship"]["sponsor"]["first_name"],
                    sponsor_last_name=data[index]["sponsorship"]["sponsor"]["last_name"],
                    sponsor_twitter_username=data[index]["sponsorship"]["sponsor"]["twitter_username"],
                    sponsor_portfolio_url=data[index]["sponsorship"]["sponsor"]["portfolio_url"],
                    sponsor_bio=data[index]["sponsorship"]["sponsor"]["bio"],
                    sponsor_location=data[index]["sponsorship"]["sponsor"]["location"],
                    sponsor_links=data[index]["sponsorship"]["sponsor"]["links"],
                    sponsor_self=data[index]["sponsorship"]["sponsor"]["links"]["self"],
                    sponsor_html=data[index]["sponsorship"]["sponsor"]["links"]["html"],
                    sponsor_photos=data[index]["sponsorship"]["sponsor"]["links"]["photos"],
                    sponsor_likes=data[index]["sponsorship"]["sponsor"]["links"]["likes"],
                    sponsor_portfolio=data[index]["sponsorship"]["sponsor"]["links"]["portfolio"],
                    sponsor_following=data[index]["sponsorship"]["sponsor"]["links"]["following"],
                    sponsor_followers=data[index]["sponsorship"]["sponsor"]["links"]["followers"],
                    profile_image_small=data[index]["sponsorship"]["sponsor"]["profile_image"]["small"],
                    profile_image_medium=data[index]["sponsorship"]["sponsor"]["links"]["followers"],
                    profile_image_large=data[index]["sponsorship"]["sponsor"]["links"]["followers"],
                    instagram_username=data[index]["sponsorship"]["sponsor"]["links"]["followers"],
                    total_collections=data[index]["sponsorship"]["sponsor"]["links"]["followers"],
                    total_likes=data[index]["sponsorship"]["sponsor"]["links"]["followers"],
                    total_photos=data[index]["sponsorship"]["sponsor"]["links"]["followers"],
                    total_promoted_photos=data[index]["sponsorship"]["sponsor"]["links"]["followers"],
                    accepted_tos=True,
                    for_hire=True,
                    social_instagram_username=data[index]["sponsorship"]["sponsor"]["instagram_username"],
                    social_portfolio_url=data[index]["sponsorship"]["sponsor"]["instagram_username"],
                    social_twitter_username=data[index]["sponsorship"]["sponsor"]["instagram_username"],
                    social_paypal_email=data[index]["sponsorship"]["sponsor"]["instagram_username"],
                    topic_submissions=data[index]["sponsorship"]["sponsor"]["instagram_username"],
                    user_id=data[index]["sponsorship"]["sponsor"]["instagram_username"],
                    user_updated_at=data[index]["sponsorship"]["sponsor"]["instagram_username"],
                    user_username=data[index]["sponsorship"]["sponsor"]["instagram_username"],
                    user_name=data[index]["sponsorship"]["sponsor"]["instagram_username"],
                    user_first_name=data[index]["sponsorship"]["sponsor"]["instagram_username"],
            )
        # except Exception as e:
        #     return Response({"message":str(e)},status=400)
        return Response({"message":"good"},status=200)

        # documents = CreateAdsPhoto.objects.all()
        # serializer = CreateAdsPhotoSerializer(documents, many=True)
        # return Response(serializer.data)












#         slug=data[index]["slug"]

# promoted_at=data[index]["slug"]

# width=data[index]["width"]
# height=data[index]["height"]
# color=data[index]["color"]

# blur_hash=data[index]["blur_hash"]
# description=data[index]["description"]
# alt_description=data[index]["alt_description"]
# breadcrumbs=data[index]["breadcrumbs"]

# urls_raw=data[index]["urls"]["raw"]
# urls_full=data[index]["urls"]["full"]
# urls_regular=data[index]["urls"]["regular"]
# urls_small=data[index]["urls"]["small"]
# urls_thumb=data[index]["urls"]["thumb"]
# urls_small_s3=data[index]["urls"]["small_s3"]


# links_self=data[index]["links"]["self"]
# links_html=data[index]["links"]["html"]
# links_download=data[index]["links"]["download"]
# links_download_location=data[index]["links"]["download_location"]

# likes=data[index]["likes"]

# liked_by_user=data[index]["liked_by_user"]
# current_user_collections=data[index]["current_user_collections"]

# sponsorship_impression_urls=data[index]["sponsorship"]["impression_urls"][0]

# tagline=data[index]["sponsorship"]["tagline"]
# tagline_url=data[index]["sponsorship"]["tagline_url"]



# sponsor_id=data[index]["sponsorship"]["sponsor"]["id"]

# sponsor_updated_at=data[index]["sponsorship"]["sponsor"]["updated_at"]

# sponsor_username=data[index]["sponsorship"]["sponsor"]["username"]
# sponsor_name=data[index]["sponsorship"]["sponsor"]["name"]
# sponsor_first_name=data[index]["sponsorship"]["sponsor"]["first_name"]
# sponsor_last_name=data[index]["sponsorship"]["sponsor"]["last_name"]
# sponsor_twitter_username=data[index]["sponsorship"]["sponsor"]["twitter_username"]
# sponsor_portfolio_url=data[index]["sponsorship"]["sponsor"]["portfolio_url"]
# sponsor_bio=data[index]["sponsorship"]["sponsor"]["bio"]
# sponsor_location=data[index]["sponsorship"]["sponsor"]["location"]
# sponsor_links=data[index]["sponsorship"]["sponsor"]["links"]
# sponsor_self=data[index]["sponsorship"]["sponsor"]["links"]["self"]
# sponsor_html=data[index]["sponsorship"]["sponsor"]["links"]["html"]
# sponsor_photos=data[index]["sponsorship"]["sponsor"]["links"]["photos"]
# sponsor_likes=data[index]["sponsorship"]["sponsor"]["links"]["likes"]
# sponsor_portfolio=data[index]["sponsorship"]["sponsor"]["links"]["portfolio"]
# sponsor_following=data[index]["sponsorship"]["sponsor"]["links"]["following"]
# sponsor_followers=data[index]["sponsorship"]["sponsor"]["links"]["followers"]


# profile_image_small=data[index]["sponsorship"]["sponsor"]["profile_image"]["small"]
# profile_image_medium=data[index]["sponsorship"]["sponsor"]["links"]["followers"]
# profile_image_large=data[index]["sponsorship"]["sponsor"]["links"]["followers"]


# instagram_username=data[index]["sponsorship"]["sponsor"]["links"]["followers"]
# total_collections=data[index]["sponsorship"]["sponsor"]["links"]["followers"]
# total_likes=data[index]["sponsorship"]["sponsor"]["links"]["followers"]
# total_photos=data[index]["sponsorship"]["sponsor"]["links"]["followers"]
# total_promoted_photos=data[index]["sponsorship"]["sponsor"]["links"]["followers"]
# accepted_tos=data[index]["sponsorship"]["sponsor"]["links"]["followers"]
# for_hire=data[index]["sponsorship"]["sponsor"]["links"]["followers"]

# social_instagram_username=data[index]["sponsorship"]["sponsor"]["instagram_username"]
# social_portfolio_url=data[index]["sponsorship"]["sponsor"]["instagram_username"]
# social_twitter_username=data[index]["sponsorship"]["sponsor"]["instagram_username"]
# social_paypal_email=data[index]["sponsorship"]["sponsor"]["instagram_username"]

# topic_submissions=data[index]["sponsorship"]["sponsor"]["instagram_username"]



# user_id=data[index]["sponsorship"]["sponsor"]["instagram_username"]
# user_updated_at=data[index]["sponsorship"]["sponsor"]["instagram_username"]
# user_username=data[index]["sponsorship"]["sponsor"]["instagram_username"]
# user_name=data[index]["sponsorship"]["sponsor"]["instagram_username"]
# user_first_name=data[index]["sponsorship"]["sponsor"]["instagram_username"]

# user_last_name
# user_twitter_username
# user_portfolio_url
# user_bio
# user_location

# links_self
# links_html
# links_photos
# links_likes
# links_portfolio
# links_following
# links_followers


# profile_image_small
# profile_image_medium
# profile_image_large

# instagram_username
# total_collections
# total_likes
# total_photos
# total_promoted_photos
# accepted_tos
# for_hire

# social_instagram_username
# social_portfolio_url
# social_twitter_username
# social_paypal_email


