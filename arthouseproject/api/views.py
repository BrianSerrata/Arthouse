from django.shortcuts import render
from rest_framework import generics, status
from .serializers import ImageSerializer, CreateImageSerializer
from .models import GeneratedImage
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response

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

class CreateImageView(APIView):
    serializer_class = CreateImageSerializer

    def post(self, request, format=None):
        # Checks to see if an active session for user exists
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            # to retriver other fields, repeat similar logic
            description = serializer.data.get('description')
            user = self.request.session.session_key
            image = GeneratedImage(user=user, description=description)
            image.save()

        return Response(ImageSerializer(image).data, status=status.HTTP_201_CREATED)

            # THE FOLLOWING IS INCOMPLETE CODE, INTENDED FOR WHEN USER GENERATION CAN BE TRACKED AND LIMITED
            # I.E., SO A SINGLE USER CANNOT MAKE MORE THAN 1 IMAGE AT THE SAME TIME
            
            # queryset = User.objects.filter(user=user)
            # if queryset exists():
            #     user = queryset[0]
            #     return message that indicates an image is currently being generated




