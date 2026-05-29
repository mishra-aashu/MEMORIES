// --- Memories Cozy Dedication Logic ---

document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selectors ---
    const welcomeOverlay = document.getElementById('welcomeOverlay');
    const openBoxBtn = document.getElementById('openBoxBtn');
    const mainApp = document.getElementById('mainApp');
    const bgMusic = document.getElementById('bgMusic');
    
    // Audio Player Elements
    const playPauseBtn = document.getElementById('playPauseBtn');
    const playIcon = document.getElementById('playIcon');
    const prevTrackBtn = document.getElementById('prevTrackBtn');
    const muteBtn = document.getElementById('muteBtn');
    const muteIcon = document.getElementById('muteIcon');
    const volumeSlider = document.getElementById('volumeSlider');
    const cassetteContainer = document.getElementById('cassetteContainer');
    
    // Particles and Memories Board Elements
    const floatingContainer = document.getElementById('floatingContainer');
    const corkBoard = document.querySelector('.cork-board');
    const memoryForm = document.getElementById('memoryForm');
    const memoryText = document.getElementById('memoryText');
    const noteColor = document.getElementById('noteColor');

    let particleInterval = null;
    let isMuted = false;
    let lastVolume = 0.7;

    // --- 1. Open Memory Box (Start Experience) ---
    if (openBoxBtn && welcomeOverlay && mainApp && bgMusic) {
        openBoxBtn.addEventListener('click', () => {
            // Fade out welcome screen
            welcomeOverlay.style.opacity = '0';
            welcomeOverlay.style.pointerEvents = 'none';
            
            // Fade in main site
            mainApp.style.opacity = '1';
            mainApp.style.pointerEvents = 'auto';
            
            // Start playing audio
            bgMusic.volume = lastVolume;
            bgMusic.play().then(() => {
                updatePlayingState(true);
            }).catch(err => {
                console.log("Audio autoplay prevented. User action handles it.", err);
                updatePlayingState(false);
            });
            
            // Clean up welcome screen from DOM after transition
            setTimeout(() => {
                welcomeOverlay.style.display = 'none';
            }, 800);
        });
    }

    // --- 2. Custom Music Player Controls ---
    function updatePlayingState(isPlaying) {
        if (isPlaying) {
            playIcon.className = 'fa-solid fa-pause';
            cassetteContainer.classList.add('playing');
            startFloatingParticles();
        } else {
            playIcon.className = 'fa-solid fa-play';
            cassetteContainer.classList.remove('playing');
            stopFloatingParticles();
        }
    }

    if (playPauseBtn && bgMusic) {
        playPauseBtn.addEventListener('click', () => {
            if (bgMusic.paused) {
                bgMusic.play().then(() => {
                    updatePlayingState(true);
                });
            } else {
                bgMusic.pause();
                updatePlayingState(false);
            }
        });
    }

    // Rewind track
    if (prevTrackBtn && bgMusic) {
        prevTrackBtn.addEventListener('click', () => {
            bgMusic.currentTime = 0;
            // Pop effect on tape reels to show rewind action
            const reels = document.querySelectorAll('.tape-reel');
            reels.forEach(reel => {
                reel.style.transform = 'scale(1.15)';
                setTimeout(() => {
                    reel.style.transform = 'none';
                }, 200);
            });
        });
    }

    // Mute/Unmute
    if (muteBtn && bgMusic) {
        muteBtn.addEventListener('click', () => {
            if (isMuted) {
                bgMusic.volume = lastVolume;
                volumeSlider.value = lastVolume;
                muteIcon.className = 'fa-solid fa-volume-high';
                isMuted = false;
            } else {
                lastVolume = bgMusic.volume;
                bgMusic.volume = 0;
                volumeSlider.value = 0;
                muteIcon.className = 'fa-solid fa-volume-xmark';
                isMuted = true;
            }
        });
    }

    // Volume Slider
    if (volumeSlider && bgMusic) {
        volumeSlider.addEventListener('input', (e) => {
            const vol = parseFloat(e.target.value);
            bgMusic.volume = vol;
            lastVolume = vol;
            
            if (vol === 0) {
                muteIcon.className = 'fa-solid fa-volume-xmark';
                isMuted = true;
            } else {
                muteIcon.className = vol < 0.5 ? 'fa-solid fa-volume-low' : 'fa-solid fa-volume-high';
                isMuted = false;
            }
        });
    }

    // --- 3. Floating Hearts & Music Notes Particle System ---
    const particles = ['❤️', '🎶', '✨', '🎵', '🌸', '☕'];

    function createParticle() {
        if (!floatingContainer) return;
        
        const particle = document.createElement('span');
        particle.className = 'floating-particle';
        
        // Select random emoji
        const randomIcon = particles[Math.floor(Math.random() * particles.length)];
        particle.textContent = randomIcon;
        
        // Random horizontal start position (percentage-based to prevent mobile horizontal scroll)
        const startPct = Math.random() * 90 + 5;
        particle.style.left = `${startPct}%`;
        
        // Random size
        const size = Math.random() * (1.6 - 0.8) + 0.8;
        particle.style.fontSize = `${size}rem`;
        
        // Random animation speed
        const duration = Math.random() * (9 - 5) + 5;
        particle.style.animationDuration = `${duration}s`;
        
        // Random initial opacity
        const opacity = Math.random() * (0.8 - 0.4) + 0.4;
        particle.style.opacity = opacity;
        
        floatingContainer.appendChild(particle);
        
        // Remove particle after animation ends
        setTimeout(() => {
            particle.remove();
        }, duration * 1000);
    }

    function startFloatingParticles() {
        if (particleInterval) clearInterval(particleInterval);
        particleInterval = setInterval(createParticle, 1200);
    }

    function stopFloatingParticles() {
        if (particleInterval) {
            clearInterval(particleInterval);
            particleInterval = null;
        }
    }

    // --- 4. Interactive Memory Board Dragging & Pinning ---
    
    // Apply draggable behaviors to existing board items
    const boardItems = document.querySelectorAll('.board-note, .board-polaroid');
    boardItems.forEach(item => {
        makeElementDraggable(item);
    });

    // Handle Adding New Memory Notes
    if (memoryForm && corkBoard) {
        memoryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const text = memoryText.value.trim();
            const colorClass = noteColor.value;
            
            if (text === '') return;

            // Create new board note element
            const note = document.createElement('div');
            note.className = `board-note ${colorClass}`;
            
            // Random position inside corkboard (range: 10% to 70% to keep it centered)
            const randomTop = Math.floor(Math.random() * 60) + 10;
            const randomLeft = Math.floor(Math.random() * 60) + 10;
            const randomRotation = Math.floor(Math.random() * 16) - 8; // -8deg to +8deg
            
            note.style.top = `${randomTop}%`;
            note.style.left = `${randomLeft}%`;
            note.style.transform = `rotate(${randomRotation}deg)`;
            
            // Pin Color matching note color
            let pinColor = 'pin-red';
            if (colorClass === 'note-pink') pinColor = 'pin-blue';
            if (colorClass === 'note-blue') pinColor = 'pin-yellow';

            // Date for note
            const options = { month: 'short', year: 'numeric' };
            const todayStr = new Date().toLocaleDateString('en-US', options);

            note.innerHTML = `
                <div class="note-pin ${pinColor}"></div>
                <div class="note-inner">
                    <span class="note-date">${todayStr}</span>
                    <p>${escapeHtml(text)}</p>
                </div>
            `;
            
            corkBoard.appendChild(note);
            makeElementDraggable(note);
            
            // Reset input form
            memoryText.value = '';
            
            // Particle burst from note
            createNoteBurst(randomLeft, randomTop);
        });
    }

    // Helper to escape HTML text inputs
    function escapeHtml(string) {
        return String(string).replace(/[&<>"']/g, function (s) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[s];
        });
    }

    // Create heart sparks when a note is pinned
    function createNoteBurst(pctLeft, pctTop) {
        if (!corkBoard) return;
        const rect = corkBoard.getBoundingClientRect();
        const pxLeft = (pctLeft / 100) * rect.width;
        const pxTop = (pctTop / 100) * rect.height;

        for (let i = 0; i < 8; i++) {
            const sparkle = document.createElement('span');
            sparkle.textContent = '✨';
            sparkle.style.position = 'absolute';
            sparkle.style.left = `${pxLeft}px`;
            sparkle.style.top = `${pxTop}px`;
            sparkle.style.fontSize = '1rem';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.zIndex = '15';
            sparkle.style.transition = 'all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)';
            
            corkBoard.appendChild(sparkle);

            // Trigger animation
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 50 + 20;
            const targetX = Math.cos(angle) * distance;
            const targetY = Math.sin(angle) * distance;

            setTimeout(() => {
                sparkle.style.transform = `translate(${targetX}px, ${targetY}px) scale(0)`;
                sparkle.style.opacity = '0';
            }, 50);

            setTimeout(() => {
                sparkle.remove();
            }, 700);
        }
    }

    // --- 5. Mouse/Touch Drag and Drop Algorithm for Board Items ---
    function makeElementDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        
        // Grab handler is the pin or the entire note
        const pin = element.querySelector('.note-pin');
        
        if (pin) {
            pin.onmousedown = dragMouseDown;
            pin.ontouchstart = dragTouchStart;
        } else {
            element.onmousedown = dragMouseDown;
            element.ontouchstart = dragTouchStart;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // Get the mouse cursor position at startup
            pos3 = e.clientX;
            pos4 = e.clientY;
            
            // Put element on top while dragging
            const items = document.querySelectorAll('.board-note, .board-polaroid');
            items.forEach(item => item.style.zIndex = '5');
            element.style.zIndex = '10';
            element.style.cursor = 'grabbing';
            
            document.onmouseup = closeDragElement;
            // Call a function whenever the cursor moves
            document.onmousemove = elementDrag;
        }

        function dragTouchStart(e) {
            // Support touch devices
            const touch = e.touches[0];
            pos3 = touch.clientX;
            pos4 = touch.clientY;
            
            const items = document.querySelectorAll('.board-note, .board-polaroid');
            items.forEach(item => item.style.zIndex = '5');
            element.style.zIndex = '10';
            
            document.ontouchend = closeDragElement;
            document.ontouchmove = elementTouchDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // Calculate the new cursor position
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            
            updateElementPosition();
        }

        function elementTouchDrag(e) {
            const touch = e.touches[0];
            pos1 = pos3 - touch.clientX;
            pos2 = pos4 - touch.clientY;
            pos3 = touch.clientX;
            pos4 = touch.clientY;
            
            updateElementPosition();
        }

        function updateElementPosition() {
            // Set the element's new position relative to the cork board
            const boardRect = corkBoard.getBoundingClientRect();
            
            // Calculate new top and left in pixels relative to corkboard
            let newTop = element.offsetTop - pos2;
            let newLeft = element.offsetLeft - pos1;
            
            // Keep elements inside the cork board boundary
            if (newTop < 10) newTop = 10;
            if (newTop > boardRect.height - element.clientHeight - 10) {
                newTop = boardRect.height - element.clientHeight - 10;
            }
            if (newLeft < 10) newLeft = 10;
            if (newLeft > boardRect.width - element.clientWidth - 10) {
                newLeft = boardRect.width - element.clientWidth - 10;
            }

            // Convert back to percentages so it stays responsive
            const pctTop = (newTop / boardRect.height) * 100;
            const pctLeft = (newLeft / boardRect.width) * 100;

            element.style.top = `${pctTop}%`;
            element.style.left = `${pctLeft}%`;
        }

        function closeDragElement() {
            // Stop moving when mouse button is released or touch ends
            document.onmouseup = null;
            document.onmousemove = null;
            document.ontouchend = null;
            document.ontouchmove = null;
            element.style.cursor = 'grab';
        }
    }
});
