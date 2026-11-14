document.addEventListener('DOMContentLoaded', () => {
    initBurger();
    initSearch();
    initPasswordToggles();

    initTrackActions();
    initPlayer();
});

/* БУРГЕР-МЕНЮ */
function initBurger() {
    const burger = document.getElementById('burgerBtn');
    const sidebar = document.getElementById('sidebar');
    if (!burger || !sidebar) return;

    burger.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('open');
    });

    sidebar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 1024) {
                sidebar.classList.remove('open');
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (window.innerWidth >= 1024) return;
        if (!sidebar.classList.contains('open')) return;
        if (!sidebar.contains(e.target) && e.target !== burger) {
            sidebar.classList.remove('open');
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024) {
            sidebar.classList.remove('open');
        }
    });
}

/* ПОИСК */
function initSearch() {
    const input = document.getElementById('searchInput');
    if (!input) return;

    input.addEventListener('input', () => {
        const query = input.value.trim().toLowerCase();
        const cards = document.querySelectorAll('.album-card, .track');

        cards.forEach(card => {
            const title = (card.dataset.title || card.textContent).toLowerCase();
            card.style.display = title.includes(query) ? '' : 'none';
        });
    });
}

/* ПОКАЗ/СКРЫТИЕ ПАРОЛЯ */
function initPasswordToggles() {
    document.querySelectorAll('.toggle-pass').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = document.getElementById(btn.dataset.target);
            if (!input) return;
            input.type = input.type === 'password' ? 'text' : 'password';
        });
    });
}

/* ДЕЙСТВИЯ С ТРЕКАМИ */
/* ДЕЙСТВИЯ С ТРЕКАМИ */
function initTrackActions() {
    const playlist = document.getElementById('myPlaylist');
    // Ищем плеер на странице профиля тоже
    const profileLikes = document.getElementById('profileLikes'); 
    
    // Функция-обработчик для лайков
    const handleLikeClick = (likeBtn) => {
        likeBtn.classList.toggle('active');
        
        const img = likeBtn.querySelector('img');
        const trackId = likeBtn.dataset.id; // Берем ID трека из data-атрибута
        const isLiked = likeBtn.classList.contains('active');

        // Меняем иконку
        if (img) {
            if (isLiked) {
                img.src = img.src.replace('heart.svg', 'heart-red.svg');
            } else {
                img.src = img.src.replace('heart-red.svg', 'heart.svg');
            }
        }

        // Отправляем AJAX запрос на сервер (нужно прописать в urls.py и views.py)
        if (trackId) {
            fetch(`/toggle-like/${trackId}/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'), // Получаем CSRF токен
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'liked': isLiked })
            })
            .then(response => response.json())
            .then(data => {
                console.log("Лайк сохранен:", data);
            })
            .catch(error => console.error("Ошибка:", error));
        }
    };

    // Обработчик для плейлиста на главной
    if (playlist) {
        playlist.addEventListener('click', (e) => {
            const removeBtn = e.target.closest('.remove-btn');
            if (removeBtn) {
                const track = removeBtn.closest('.track');
                if (track) {
                    track.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    track.style.opacity = '0';
                    track.style.transform = 'translateX(20px)';
                    setTimeout(() => {
                        track.remove();
                        checkEmptyPlaylist(playlist);
                    }, 300);
                }
                return;
            }

            const likeBtn = e.target.closest('.like-btn');
            if (likeBtn) handleLikeClick(likeBtn);
        });
    }

    // Обработчик для страницы профиля (если мы там)
    if (profileLikes) {
        profileLikes.addEventListener('click', (e) => {
            const likeBtn = e.target.closest('.like-btn');
            if (likeBtn) handleLikeClick(likeBtn); // Тут тоже можно удалять лайк
        });
    }
}

// Вспомогательная функция для получения CSRF токена (нужна для Django)
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function checkEmptyPlaylist(playlist) {
    const tracks = playlist.querySelectorAll('.track');
    if (tracks.length === 0) {
        playlist.innerHTML = '<p style="color: var(--muted); padding: 10px;">Плейлист пока пуст.</p>';
    }
}

/* БАЗОВАЯ ЛОГИКА ПЛЕЕРА */
function initPlayer() {
    const playPauseBtn = document.getElementById('playPauseBtn');
    const playPauseIcon = document.getElementById('playPauseIcon');

    if (!playPauseBtn || !playPauseIcon) return;

    let isPlaying = false;

    playPauseBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;

        if (isPlaying) {
            playPauseIcon.src = playPauseIcon.src.replace('pause.svg', 'play.svg');
        } else {
            playPauseIcon.src = playPauseIcon.src.replace('play.svg', 'pause.svg');
        }
    });

    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.addEventListener('input', () => {
            const timeLabel = document.getElementById('timeLabel');
            if (timeLabel) {
                const totalSeconds = 225;
                const currentSeconds = Math.floor((progressBar.value / 100) * totalSeconds);
                const minutes = Math.floor(currentSeconds / 60);
                const seconds = currentSeconds % 60;
                timeLabel.textContent = `0:${seconds < 10 ? '0' : ''}${seconds} / 3:45`;
            }
        });
    }
}

/* УТИЛИТЫ ВАЛИДАЦИИ */
function setError(input, message) {
    const span = document.querySelector(`.error[data-error="${input.id}"]`);
    if (span) span.textContent = message || '';
    input.classList.toggle('invalid', Boolean(message));
}

function clearErrors(form) {
    form.querySelectorAll('.error').forEach(el => (el.textContent = ''));
    form.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
}

function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
