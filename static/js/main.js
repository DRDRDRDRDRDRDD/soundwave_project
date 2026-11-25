document.addEventListener('DOMContentLoaded', () => {
    initBurger();
    initSearch();
    initPasswordToggles();
    initTrackActions(); // Лайки и удаление
    initPlayerControls(); // Единый плеер
    initTrackClicks(); // Клики по трекам
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

/* ДЕЙСТВИЯ С ТРЕКАМИ (Лайки/Удаление) */
function initTrackActions() {
    const playlist = document.getElementById('myPlaylist');
    const profileLikes = document.getElementById('profileLikes'); 
    
    const handleLikeClick = (likeBtn) => {
        likeBtn.classList.toggle('active');
        const img = likeBtn.querySelector('img');
        const trackId = likeBtn.dataset.id;
        const isLiked = likeBtn.classList.contains('active');

        if (img) {
            img.src = isLiked ? img.src.replace('heart.svg', 'heart-red.svg') : img.src.replace('heart-red.svg', 'heart.svg');
        }

        if (trackId) {
            fetch(`/toggle-like/${trackId}/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'liked': isLiked })
            })
            .then(response => response.json())
            .then(data => {
                const profileLikesContainer = document.getElementById('profileLikes');
                if (profileLikesContainer && !isLiked) {
                    const trackElement = likeBtn.closest('.track');
                    if (trackElement) {
                        trackElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        trackElement.style.opacity = '0';
                        trackElement.style.transform = 'translateX(20px)';
                        setTimeout(() => {
                            trackElement.remove();
                            if (profileLikesContainer.querySelectorAll('.track').length === 0) {
                                profileLikesContainer.innerHTML = '<p style="color: var(--muted);">У вас пока нет любимых треков.</p>';
                            }
                        }, 300);
                    }
                }
            })
            .catch(error => console.error("Ошибка:", error));
        }
    };

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

    if (profileLikes) {
        profileLikes.addEventListener('click', (e) => {
            const likeBtn = e.target.closest('.like-btn');
            if (likeBtn) handleLikeClick(likeBtn);
        });
    }
}

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
    if (playlist.querySelectorAll('.track').length === 0) {
        playlist.innerHTML = '<p style="color: var(--muted); padding: 10px;">Плейлист пока пуст.</p>';
    }
}

/* --- УПРАВЛЕНИЕ ПЛЕЕРОМ (Единая функция) --- */
function initPlayerControls() {
    const playPauseBtn = document.getElementById('playPauseBtn');
    const playPauseIcon = document.getElementById('playPauseIcon');
    const audio = document.getElementById('audioElement');
    const progressBar = document.getElementById('progressBar');
    const timeLabel = document.getElementById('timeLabel');

    if (!playPauseBtn || !audio) return;

    // Кнопка Play/Pause
    playPauseBtn.addEventListener('click', () => {
        if (audio.paused) {
            if (audio.src) audio.play();
        } else {
            audio.pause();
        }
    });

    // Смена иконки
    audio.addEventListener('play', () => {
        playPauseIcon.src = "/static/images/images/pause.svg";
    });

    audio.addEventListener('pause', () => {
        playPauseIcon.src = "/static/images/images/play.svg";
    });

    // Прогресс и время
    audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            progressBar.value = (audio.currentTime / audio.duration) * 100;
            
            const curMin = Math.floor(audio.currentTime / 60);
            const curSec = Math.floor(audio.currentTime % 60);
            const durMin = Math.floor(audio.duration / 60);
            const durSec = Math.floor(audio.duration % 60);
            
            timeLabel.textContent = `${curMin}:${curSec < 10 ? '0' : ''}${curSec} / ${durMin}:${durSec < 10 ? '0' : ''}${durSec}`;
        }
    });

    // Перемотка
    if (progressBar) {
        progressBar.addEventListener('input', () => {
            if (audio.duration) {
                audio.currentTime = (progressBar.value / 100) * audio.duration;
            }
        });
    }

    // Кнопки Next/Prev
    document.getElementById('nextBtn')?.addEventListener('click', () => {
        const tracks = Array.from(document.querySelectorAll('.track'));
        let currentIndex = tracks.findIndex(t => t.dataset.audioUrl === audio.src.replace(window.location.origin, ''));
        if (currentIndex !== -1 && currentIndex < tracks.length - 1) {
            tracks[currentIndex + 1].click();
        } else if (tracks.length > 0) {
            tracks[0].click();
        }
    });

    document.getElementById('prevBtn')?.addEventListener('click', () => {
        const tracks = Array.from(document.querySelectorAll('.track'));
        let currentIndex = tracks.findIndex(t => t.dataset.audioUrl === audio.src.replace(window.location.origin, ''));
        if (currentIndex > 0) {
            tracks[currentIndex - 1].click();
        }
    });
}

/* --- КЛИКИ ПО ТРЕКАМ --- */
function initTrackClicks() {
    const tracks = document.querySelectorAll('.track');
    const audio = document.getElementById('audioElement');
    const playerTitle = document.getElementById('playerTitle');
    const playerArtist = document.getElementById('playerArtist');
    const playerCover = document.getElementById('playerCover');

    if (!audio) return;

    tracks.forEach(track => {
        track.addEventListener('click', (e) => {
            if (e.target.closest('.like-btn') || e.target.closest('.remove-btn')) return;

            const audioUrl = track.dataset.audioUrl;
            const title = track.dataset.title;
            const artist = track.dataset.artist; 
            const cover = track.dataset.cover;
            
            if (!audioUrl) {
                alert("У этого трека нет аудиофайла. Загрузите его в админке.");
                return;
            }

            audio.src = audioUrl;
            audio.play();
            
            playerTitle.textContent = title;
            // Если артист не передан, пишем "Неизвестный исполнитель"
            playerArtist.textContent = artist ? artist : "Неизвестный исполнитель"; 
            
            if (cover) playerCover.src = cover;
        });
    });
}