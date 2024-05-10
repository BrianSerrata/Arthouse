# This file is responsible for redirecting url patterns to api requests

from django.urls import path
from .views import ImageView

urlpatterns = [
    path('images', ImageView.as_view())
]