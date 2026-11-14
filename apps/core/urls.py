from django.contrib import admin
from django.urls import path
from apps.core.views import home, catalog, profile_view, toggle_like
# Импорты ваших входов/выходов (login/logout)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home, name='home'),
    path('catalog/', catalog, name='catalog'),
    path('profile/', profile_view, name='profile'), # Страница профиля
    path('toggle-like/<int:track_id>/', toggle_like, name='toggle_like'), # AJAX ручка для лайков/удаления
    # ... ваши пути для авторизации ...
]