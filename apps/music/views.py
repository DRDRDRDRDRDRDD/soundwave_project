from django.http import JsonResponse
import json
from django.views.decorators.http import require_POST
from music.models import LikedTrack, Track

@require_POST
def toggle_like(request, track_id):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Не авторизован'}, status=403)

    try:
        data = json.loads(request.body)
        is_liked = data.get('liked')
        track = Track.objects.get(id=track_id)

        if is_liked:
            # Добавляем в избранное
            LikedTrack.objects.get_or_create(user=request.user, track=track)
        else:
            # Удаляем из избранного
            LikedTrack.objects.filter(user=request.user, track=track).delete()

        return JsonResponse({'status': 'ok'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)