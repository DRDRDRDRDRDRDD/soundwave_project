from django.urls import path
from apps.core.views import home, catalog, profile_view, toggle_like, album_detail # Добавили album_detail

urlpatterns = [
    # path('admin/', admin.site.urls),  <-- УДАЛИТЕ ЭТУ СТРОКУ (она уже есть в главном urls.py)
    path('', home, name='home'),
    path('catalog/', catalog, name='catalog'),
    path('profile/', profile_view, name='profile'),
    path('toggle-like/<int:track_id>/', toggle_like, name='toggle_like'),
    
    # Добавляем маршрут для альбома:
    path('album/<int:album_id>/', album_detail, name='album_detail'), 
]