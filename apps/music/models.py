from django.db import models

class Artist(models.Model):
    name = models.CharField(max_length=100, verbose_name="Исполнитель")

    def __str__(self):
        return self.name

class Album(models.Model):
    title = models.CharField(max_length=100, verbose_name="Название альбома")
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE, verbose_name="Исполнитель")
    cover = models.CharField(max_length=255, blank=True, null=True, verbose_name="Путь к обложке")
    
    def __str__(self):
        return f"{self.title} - {self.artist.name}"

class Track(models.Model):
    title = models.CharField(max_length=100, verbose_name="Название трека")
    album = models.ForeignKey(Album, on_delete=models.CASCADE, verbose_name="Альбом")
    duration = models.CharField(max_length=10, default="0:00", verbose_name="Длительность")
    cover = models.CharField(max_length=255, blank=True, null=True, verbose_name="Путь к обложке трека")

    def __str__(self):
        return self.title