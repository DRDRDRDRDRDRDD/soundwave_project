from django.shortcuts import render
from apps.music.models import Album, Track
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
import json
from django.shortcuts import render, get_object_or_404

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
@login_required(login_url='login')
def profile_view(request):
    # Получаем треки, которые лайкнул текущий авторизованный пользователь
    liked_tracks = request.user.liked_tracks.all()
    context = {
        'liked_tracks': liked_tracks,
    }
    return render(request, 'core/profile.html', context)

@login_required
def toggle_like(request, track_id):
    if request.method == 'POST':
        track = get_object_or_404(Track, id=track_id)
        user = request.user
        
        if user in track.liked_by.all():
            track.liked_by.remove(user)
            liked = False
        else:
            track.liked_by.add(user)
            liked = True
            
        return JsonResponse({'status': 'ok', 'liked': liked})
    return JsonResponse({'status': 'error'}, status=400)

def album_detail(request, album_id):
    album = get_object_or_404(Album, id=album_id)
    tracks = Track.objects.filter(album=album)
    return render(request, 'core/album_detail.html', {'album': album, 'tracks': tracks})