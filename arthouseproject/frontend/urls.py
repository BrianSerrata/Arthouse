from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path('create_image', index),
    path('create_song', index),
    path('create', index),
    path('edit_image', index),
    path('view', index),
    path('image/<str:description>', index)
]
