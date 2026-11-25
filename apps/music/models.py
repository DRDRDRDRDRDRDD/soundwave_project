from django.db import models
from django.conf import settings

class Artist(models.Model):
    name = models.CharField(max_length=100, verbose_name="Исполнитель")

    def __str__(self):
        return self.name

class Album(models.Model):
    title = models.CharField(max_length=200)
    artist = models.CharField(max_length=200)
    cover = models.CharField(max_length=255, null=True, blank=True) 

    def __str__(self):
        return self.title

class Track(models.Model):
    title = models.CharField(max_length=255)
    artist = models.CharField(max_length=255, null=True, blank=True) 
    cover = models.CharField(max_length=255, null=True, blank=True)
    audio_file = models.FileField(upload_to='music/', null=True, blank=True, verbose_name="Аудиофайл")
    
    album = models.ForeignKey(Album, on_delete=models.SET_NULL, null=True, blank=True)
    liked_by = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='liked_tracks', blank=True)

    def __str__(self):
        return self.title