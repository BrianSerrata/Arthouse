from rest_framework import serializers
from .models import GeneratedImage

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneratedImage
        fields = ('id', 'description', 'image', 'created_at')