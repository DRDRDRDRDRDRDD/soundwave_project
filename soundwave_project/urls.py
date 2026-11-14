from django.contrib import admin
from django.urls import path, include
from apps.music import views 
urlpatterns = [
    path('admin/', admin.site.urls),
    path('users/', include('apps.users.urls')),
    path('toggle-like/<int:track_id>/', views.toggle_like, name='toggle_like'),
    path('', include('apps.core.urls')),
]
