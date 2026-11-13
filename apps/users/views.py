from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from .models import User


def register(request):
    if request.method == 'POST':
        username = request.POST.get('username', '').strip()
        password = request.POST.get('password', '')
        confirm = request.POST.get('confirmPassword', '')
        fio = request.POST.get('fio', '').strip()
        email = request.POST.get('email', '').strip()

        if User.objects.filter(username=username).exists():
            return render(request, 'core/register.html', {'error': 'Логин уже занят'})
        if len(password) < 8:
            return render(request, 'core/register.html', {'error': 'Пароль должен быть не менее 8 символов'})
        if password != confirm:
            return render(request, 'core/register.html', {'error': 'Пароли не совпадают'})

        User.objects.create_user(
            username=username, password=password, fio=fio, email=email
        )
        return redirect('login')
    return render(request, 'core/register.html')


def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username', '').strip()
        password = request.POST.get('password', '')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            if user.is_superuser:
                return redirect('/admin/')
            return redirect('home')
        return render(request, 'core/login.html', {'error': 'Неверный логин или пароль'})
    return render(request, 'core/login.html')


def logout_view(request):
    logout(request)
    return redirect('login')