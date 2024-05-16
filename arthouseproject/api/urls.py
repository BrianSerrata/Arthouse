# This file is responsible for redirecting url patterns to api requests

from django.urls import path
from .views import ImageView, CreateImageView, GetImage

urlpatterns = [
    path('images', ImageView.as_view()),
    path('create', CreateImageView.as_view()),
    path('get-image', GetImage.as_view())
]