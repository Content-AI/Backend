from rest_framework import serializers
# from .models import Photo
from .models import CreateAdsPhoto

# class PhotoSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Photo
#         fields = '__all__'


class CreateAdsPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreateAdsPhoto
        fields = '__all__'


class CustomPhotoSerializer(serializers.ModelSerializer):
    urls = serializers.SerializerMethodField()
    links = serializers.SerializerMethodField()
    sponsorship = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()

    def get_urls(self, obj):
        return {
            "raw": obj.urls_raw,
            "full": obj.urls_full,
            "regular": obj.urls_regular,
            "small": obj.urls_small,
            "thumb": obj.urls_thumb,
            "small_s3": obj.urls_small_s3,
        }

    def get_links(self, obj):
        return {
            "self": obj.links_self,
            "html": obj.links_html,
            "download": obj.links_download,
            "download_location": obj.links_download_location,
        }

    def get_sponsorship(self, obj):
        return {
            "impression_urls": obj.sponsorship_impression_urls,
            "tagline": obj.tagline,
            "tagline_url": obj.tagline_url,
            "sponsor": {
                "id": obj.sponsor_id,
                "updated_at": obj.sponsor_updated_at,
                "username": obj.sponsor_username,
                "name": obj.sponsor_name,
                "first_name": obj.sponsor_first_name,
                "last_name": obj.sponsor_last_name,
                "twitter_username": obj.sponsor_twitter_username,
                "portfolio_url": obj.sponsor_portfolio_url,
                "bio": obj.sponsor_bio,
                "location": obj.sponsor_location,
                "links": {
                    "self": obj.sponsor_links,
                    "html": obj.sponsor_html,
                    "photos": obj.sponsor_photos,
                    "likes": obj.sponsor_likes,
                    "portfolio": obj.sponsor_portfolio,
                    "following": obj.sponsor_following,
                    "followers": obj.sponsor_followers,
                },
                "profile_image": {
                    "small": obj.profile_image_small,
                    "medium": obj.profile_image_medium,
                    "large": obj.profile_image_large,
                },
                "instagram_username": obj.instagram_username,
                "total_collections": obj.total_collections,
                "total_likes": obj.total_likes,
                "total_photos": obj.total_photos,
                "total_promoted_photos": obj.total_promoted_photos,
                "accepted_tos": obj.accepted_tos,
                "for_hire": obj.for_hire,
                "social": {
                    "instagram_username": obj.social_instagram_username,
                    "portfolio_url": obj.social_portfolio_url,
                    "twitter_username": obj.social_twitter_username,
                    "paypal_email": obj.social_paypal_email,
                },
            },
        }

    def get_user(self, obj):
        return {
            "id": obj.user_id,
            "updated_at": obj.user_updated_at,
            "username": obj.user_username,
            "name": obj.user_name,
            "first_name": obj.user_first_name,
            "last_name": obj.user_last_name,
            "twitter_username": obj.user_twitter_username,
            "portfolio_url": obj.user_portfolio_url,
            "bio": obj.user_bio,
            "location": obj.user_location,
            "links": {
                "self": obj.links_self_user,
                "html": obj.links_html_user,
                "photos": obj.links_photos_user,
                "likes": obj.links_likes_user,
                "portfolio": obj.links_portfolio_user,
                "following": obj.links_following_user,
                "followers": obj.links_followers_user,
            },
            "profile_image": {
                "small": obj.profile_image_small_user,
                "medium": obj.profile_image_medium_user,
                "large": obj.profile_image_large_user,
            },
            "instagram_username": obj.instagram_username_user,
            "total_collections": obj.total_collections_user,
            "total_likes": obj.total_likes_user,
            "total_photos": obj.total_photos_user,
            "total_promoted_photos": obj.total_promoted_photos_user,
            "accepted_tos": obj.accepted_tos_user,
            "for_hire": obj.for_hire_user,
            "social": {
                "instagram_username": obj.social_instagram_username_user,
                "portfolio_url": obj.social_portfolio_url_user,
                "twitter_username": obj.social_twitter_username_user,
                "paypal_email": obj.social_paypal_email_user,
            },
        }

    class Meta:
        model = CreateAdsPhoto
        fields = '__all__'