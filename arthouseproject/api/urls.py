# This file is responsible for redirecting url patterns to api requests

from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import ImageView, CreateImageView, GetImage, SongView, CreateSongView, GetSong

urlpatterns = [
    path('images', ImageView.as_view()),
    path('create_image', CreateImageView.as_view()), # change to create_image
    path('get_image', GetImage.as_view()), # change to get_image
    path('songs', SongView.as_view()),
    path('create_song', CreateSongView.as_view()),
    path('get_song', GetSong.as_view()),
]