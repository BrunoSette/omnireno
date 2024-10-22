export function openLightbox(mediaSrc) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxVideo = document.getElementById('lightbox-video');

  if (lightbox) {
    if (mediaSrc.endsWith('.mov') || mediaSrc.endsWith('.mp4')) {
      if (lightboxVideo) {
        lightboxVideo.src = mediaSrc;
        lightboxVideo.classList.remove('hidden');
        lightboxVideo.play(); // Ensure the video starts playing
        lightboxImage.classList.add('hidden');
      }
    } else {
      if (lightboxImage) {
        lightboxImage.src = mediaSrc;
        lightboxImage.classList.remove('hidden');
        lightboxVideo.classList.add('hidden');
      }
    }
    lightbox.classList.remove('hidden');
  }
}

export function initializeLightbox() {
  const lightbox = document.getElementById('lightbox');
  const closeLightbox = document.getElementById('close-lightbox');

  if (lightbox && closeLightbox) {
    closeLightbox.addEventListener('click', () => {
      lightbox.classList.add('hidden');
      resetLightbox();
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.add('hidden');
        resetLightbox();
      }
    });
  }
}

function resetLightbox() {
  const lightboxVideo = document.getElementById('lightbox-video');
  if (lightboxVideo) {
    lightboxVideo.pause();
    lightboxVideo.src = ''; // Clear the video source
  }
}
