from django.shortcuts import render
from rest_framework import generics, status
from .serializers import ImageSerializer, CreateImageSerializer
from .models import GeneratedImage
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import openai
from openai.types import ImageGenerateParams, ImagesResponse

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
            return Response({"Image not found":"Invalid Image Identifier"}, status=HTTP_404_NOT_FOUND)
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





