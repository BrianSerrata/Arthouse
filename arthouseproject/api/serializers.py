from rest_framework import serializers
from .models import GeneratedImage

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneratedImage
        fields = ('id', 'user', 'description', 'image', 'created_at')

class CreateImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneratedImage
        #TODO: later, we can include more fields to give the user more creative freedom / flexibility for image creation
        fields = ('description',)