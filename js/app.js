const images = [
  { src: 'images/img1.png', title: 'El Beso - Gustav Klimt' },
  { src: 'images/img2.png', title: 'Judit ecapitando a Holofernes - Artemisia Gentileschi' },
  { src: 'images/img3.jpg', title: 'El Infierno - Peeter Huys ' },
  { src: 'images/img4.png', title: 'Las Meninas - Diego Velázquez' },
  { src: 'images/img5.png', title: 'El ángel herido - Hugo Simberg' },
  { src: 'images/img6.png', title: 'El aquelarre - Francisco de Goya' },
  { src: 'images/img7.png', title: 'Untitled painting - Zdzisław Beksiński' },
  { src: 'images/img8.png', title: 'Gallowgate - C-Darte' },
  { src: 'images/img9.png', title: 'Saturno devorando a su hijo - Francisco de Goya' },
];

const gallery = document.getElementById('gallery');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
const closeBtn = document.getElementById('lightboxClose');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentIndex = 0;

function buildGallery() {
  gallery.innerHTML = '';
  images.forEach((img, i) => {
    const card = document.createElement('button');
    card.className = 'card';
    card.type = 'button';
    card.innerHTML = `
      <img src="${img.src}" alt="${img.title}" />
      <div class="title">${img.title}</div>
    `;

    card.addEventListener('click', () => openLightbox(i));
    gallery.appendChild(card);
  });
}

function openLightbox(index) {

  currentIndex = index;
  const img = images[index];

  setTimeout(() => {
    lightboxImage.src = img.src;
    lightboxCaption.textContent = img.title;
    lightbox.style.opacity = 1;
  }, 100);

  lightbox.setAttribute('aria-hidden', 'false');

  lightbox.style.opacity = 0;
   zoom = 1;
   translateX = 0;
   translateY = 0;
   lightboxImage.style.transform = "scale(1)";

}

function closeLightbox() {
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImage.src = '';
}

function changeImage(newIndex) {
  lightboxImage.style.opacity = 0;

  setTimeout(() => {
    currentIndex = newIndex;
    const img = images[currentIndex];
    lightboxImage.src = img.src;
    lightboxCaption.textContent = img.title;
    lightboxImage.style.opacity = 1;
  }, 150);
}

function showPrevious() {
  const newIndex = (currentIndex - 1 + images.length) % images.length;
  changeImage(newIndex);
}

function showNext() {
  const newIndex = (currentIndex + 1) % images.length;
  changeImage(newIndex);
}

closeBtn.addEventListener('click', closeLightbox);
prevBtn.addEventListener('click', showPrevious);
nextBtn.addEventListener('click', showNext);

lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

window.addEventListener('keydown', (event) => {
  if (lightbox.getAttribute('aria-hidden') === 'false') {
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') showPrevious();
    if (event.key === 'ArrowRight') showNext();
  }
});


let zoom = 1;
let isDragging = false;
let startX, startY;
let translateX = 0;
let translateY = 0;

lightboxImage.addEventListener("wheel", (e) => {
  e.preventDefault();

  const zoomSpeed = 0.1;

  if (e.deltaY < 0) {
    zoom += zoomSpeed;
  } else {
    zoom -= zoomSpeed;
  }

  zoom = Math.min(Math.max(zoom, 1), 4); // límite entre 1x y 4x

  updateTransform();
});

lightboxImage.addEventListener("mousedown", (e) => {
  if (zoom > 1) {
    isDragging = true;
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
    lightboxImage.style.cursor = "grabbing";
  }
});

window.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  translateX = e.clientX - startX;
  translateY = e.clientY - startY;

  updateTransform();
});

window.addEventListener("mouseup", () => {
  isDragging = false;
  lightboxImage.style.cursor = "grab";
});

function updateTransform() {
  lightboxImage.style.transform = `
    scale(${zoom}) 
    translate(${translateX / zoom}px, ${translateY / zoom}px)
  `;
}

lightboxImage.addEventListener("dblclick", () => {
  if (zoom === 1) {
    zoom = 2;
  } else {
    zoom = 1;
    translateX = 0;
    translateY = 0;
  }
  updateTransform();
});

buildGallery();