from django.db import models
from django.contrib.auth.models import User

# Create your models here.

# Model (table) which will store images created by respective users, including description and creation time
# TODO: additional logic likely needed to look up specific users and/or images
class GeneratedImage(models.Model):
    description = models.TextField()
    image = models.ImageField(upload_to='generated_images/')
    created_at = models.DateTimeField(auto_now_add=True)
