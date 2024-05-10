from django.shortcuts import render
from rest_framework import generics
from .serializers import ImageSerializer
from .models import GeneratedImage

# Create your views here.

# # api endpoint responsible for dispatching request to openAI dall-e api
# def generate_image(request):
#     return HttpResponse("Hello")

class ImageView(generics.ListAPIView):
    queryset = GeneratedImage.objects.all()
    serializer_class = ImageSerializer


