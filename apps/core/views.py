# apps/core/views.py (или где у вас лежат вьюхи)
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from music.models import LikedTrack

@login_required
def profile(request):
    # Достаем все лайкнутые треки текущего пользователя
    liked_tracks = LikedTrack.objects.filter(user=request.user).select_related('track')
    
    context = {
        'liked_tracks': liked_tracks,
    }
    return render(request, 'core/profile.html', context)