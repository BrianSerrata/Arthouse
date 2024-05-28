from django.shortcuts import render
from rest_framework import generics, status
from .serializers import ImageSerializer, CreateImageSerializer, SongSerializer, CreateSongSerializer
from .models import GeneratedImage, GeneratedSong, AudioFile
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.base import ContentFile
import json
import requests
import time
import openai
from openai.types import ImageGenerateParams, ImagesResponse
from django.http import JsonResponse
from django.conf import settings
import os

# Create your views here.

# # api endpoint responsible for dispatching request to openAI dall-e api
# def generate_image(request):
#     return HttpResponse("Hello")

class ImageView(ListAPIView):
    queryset = GeneratedImage.objects.all()
    serializer_class = ImageSerializer

class GetImage(APIView):
    serializer_class = ImageSerializer
    lookup_url_kwarg = 'description'

    def get(self, request, format=None):
        description = request.GET.get(self.lookup_url_kwarg)
        if description != None:
            image = GeneratedImage.objects.filter(description=description)
            # NOTE: code will break if description not unique, perhaps use a different way to retrieve image (like id)
            if len(image) > 0:
                data = ImageSerializer(image[0]).data
                return Response(data, status=status.HTTP_200_OK)
            return Response({"Image not found":"Invalid Image Identifier"}, status=status.HTTP_404_NOT_FOUND)
        return Response({"Bad Request":"Image parameter not found in request"}, status=status.HTTP_400_BAD_REQUEST)

openai.api_key = "sk-proj-ihzHQFuyVdTxLgyRQgWHT3BlbkFJYSSEGPLhYiOk40h3QEdV"

class CreateImageView(APIView):
    serializer_class = CreateImageSerializer

    def post(self, request, format=None):
        # Checks to see if an active session for user exists
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            description = serializer.data.get('description')
            user = self.request.session.session_key

            # Define the parameters for the image generation
            params = {
                "prompt": description,
                "model": "dall-e-3",
                "size": "1024x1024",
                "n": 1,
                "quality": "standard",
                "response_format": "url"
            }

            try:
                # Call the OpenAI API
                response: ImagesResponse = openai.images.generate(**params)
                image_url = response.data[0].url


                # Save the generated image information to the database
                generated_image = GeneratedImage(user=user, description=description, image=image_url)
                generated_image.save()

                return Response(ImageSerializer(generated_image).data, status=status.HTTP_201_CREATED)

            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class SongView(ListAPIView):
    queryset = GeneratedSong.objects.all()
    serializer_class = SongSerializer

class GetSong(APIView):
    serializer_class = SongSerializer
    lookup_url_kwarg = 'description'

    def get(self, request, format=None):
        description = request.GET.get(self.lookup_url_kwarg)
        if description != None:
            image = GeneratedSong.objects.filter(description=description)
            # NOTE: code will break if description not unique, perhaps use a different way to retrieve image (like id)
            if len(image) > 0:
                data = SongSerializer(image[0]).data
                return Response(data, status=status.HTTP_200_OK)
            return Response({"Song not found":"Invalid Song Identifier"}, status=status.HTTP_404_NOT_FOUND)
        return Response({"Bad Request":"Song parameter not found in request"}, status=status.HTTP_400_BAD_REQUEST)
    
## TODO: may need to be changed
base_url = 'http://127.0.0.1:3000'


class CreateSongView(APIView):
    serializer_class = CreateSongSerializer

    def post(self, request, format=None):
        # Check if an active session for the user exists
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            description = serializer.data.get('description')
            print("the description is", description)
            user = self.request.session.session_key

            # Define the parameters for the audio generation
            payload = {
                "prompt": description,
                "make_instrumental": False,
                "wait_audio": True  # Wait for audio generation to complete
            }

            try:
                # Call the external API to generate the audio
                response = requests.post(f'{base_url}/api/generate', json=payload, headers={'Content-Type': 'application/json'})
                response_data = response.json()
                
                if response.status_code != 200 or not response_data:
                    return Response({'error': 'Failed to generate audio'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                # Create the GeneratedSong instance
                generated_song = GeneratedSong(user=user, description=description)
                generated_song.save()

                # Save the audio files
                audio_files = response_data
                for audio_file_info in audio_files:
                    audio_url = audio_file_info['audio_url']
                    audio_content = requests.get(audio_url).content
                    audio_file_name = f"{audio_file_info['id']}.mp3"
                    audio_file = AudioFile(song=generated_song)
                    audio_file.file.save(audio_file_name, ContentFile(audio_content))

                
                return Response(SongSerializer(generated_song).data, status=status.HTTP_201_CREATED)

            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)






