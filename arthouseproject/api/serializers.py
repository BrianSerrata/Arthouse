from rest_framework import serializers
from .models import GeneratedImage, GeneratedSong, AudioFile

# Used to represent objects in database
class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneratedImage
        fields = ('id', 'user', 'description', 'image', 'created_at')

# Used by API for actual image creation
class CreateImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneratedImage
        #TODO: later, we can include more fields to give the user more creative freedom / flexibility for image creation
        fields = ('description',)

class AudioFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AudioFile
        fields = ('id', 'file')

class SongSerializer(serializers.ModelSerializer):
    audio_files = AudioFileSerializer(many=True, read_only=True)

    class Meta:
        model = GeneratedSong
        fields = ('id', 'user', 'description', 'audio_files', 'created_at')

class CreateSongSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneratedSong
        fields = ('description',)