from django.urls import path ,include
from projectsApp import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('projects', views.ProjectsViewSet,basename='ProjectsViewSet')

urlpatterns = [
    path('',include(router.urls)),
    path('project_choose',views.project_choose, name='project_choose'),
]