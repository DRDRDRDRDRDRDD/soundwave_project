from django.shortcuts import render
from apps.music.models import Album, Track

def home(request):
    recommendations = Album.objects.all()
    top_albums = Album.objects.all()[:4] 
    playlist = Track.objects.all()
    
    context = {
        'recommendations': recommendations,
        'playlist': playlist,
        'top_albums': top_albums,
    }
    return render(request, 'core/index.html', context)

def catalog(request):
    albums = Album.objects.all()
    return render(request, 'core/catalog.html', {'albums': albums})