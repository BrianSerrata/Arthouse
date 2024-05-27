from django.db import models
from django.contrib.auth.models import User

# Create your models here.

# Model (table) which will store images created by respective users, including description and creation time
# TODO: additional logic likely needed to look up specific users and/or images
class GeneratedImage(models.Model):
    user = models.TextField()
    description = models.TextField()
    image = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)

class GeneratedSong(models.Model):
    user = models.TextField()
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.description

class AudioFile(models.Model):
    song = models.ForeignKey(GeneratedSong, related_name='audio_files', on_delete=models.CASCADE)
    file = models.FileField(upload_to='audio_files/')

    def __str__(self):
        return self.file.name