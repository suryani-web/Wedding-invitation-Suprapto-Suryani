/* =========================
   NAMA TAMU DARI LINK
========================= */

const params = new URLSearchParams(window.location.search);

const guestName = params.get("to");

const guestElement = document.getElementById("guest-name");

if (guestName) {
    guestElement.textContent = guestName;
}


/* =========================
   TOMBOL BUKA UNDANGAN
========================= */

const openButton = document.getElementById("open-button");

openButton.addEventListener("click", function () {

    const kataPembuka = document.getElementById("kata-pembuka");

    kataPembuka.scrollIntoView({
        behavior: "smooth"
    });

});
/* =========================
   SLIDER FOTO PASANGAN
========================= */

const fotoPasangan = document.querySelectorAll(
    ".foto-slider .foto"
);

let fotoPasanganIndex = 0;

function fotoPasanganNext() {

    if (fotoPasangan.length < 2) return;

    fotoPasangan[fotoPasanganIndex]
        .classList.remove("active");

    fotoPasanganIndex++;

    if (fotoPasanganIndex >= fotoPasangan.length) {
        fotoPasanganIndex = 0;
    }

    fotoPasangan[fotoPasanganIndex]
        .classList.add("active");
}

/* Otomatis berganti setiap 4 detik */
setInterval(fotoPasanganNext, 4000);


/* =========================
   SWIPE DI HP
========================= */

let fotoStartX = 0;

const fotoSlider = document.querySelector(".foto-slider");

if (fotoSlider) {

    fotoSlider.addEventListener("touchstart", function(e) {
        fotoStartX = e.touches[0].clientX;
    });

    fotoSlider.addEventListener("touchend", function(e) {

        const fotoEndX = e.changedTouches[0].clientX;
        const selisih = fotoStartX - fotoEndX;

        if (Math.abs(selisih) < 50) return;

        fotoPasangan[fotoPasanganIndex]
            .classList.remove("active");

        if (selisih > 0) {
            /* Swipe kiri */
            fotoPasanganIndex++;

            if (fotoPasanganIndex >= fotoPasangan.length) {
                fotoPasanganIndex = 0;
            }

        } else {
            /* Swipe kanan */
            fotoPasanganIndex--;

            if (fotoPasanganIndex < 0) {
                fotoPasanganIndex = fotoPasangan.length - 1;
            }
        }

        fotoPasangan[fotoPasanganIndex]
            .classList.add("active");
    });
}
// =========================
// COUNTDOWN
// =========================

const weddingDate = new Date("November 4, 2026 12:00:00 GMT+0700").getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance <= 0) {
        document.getElementById("days").textContent = "00";
        document.getElementById("hours").textContent = "00";
        document.getElementById("minutes").textContent = "00";
        document.getElementById("seconds").textContent = "00";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) /
        (1000 * 60 * 60)
    );

    const minutes = Math.floor(
        (distance % (1000 * 60 * 60)) /
        (1000 * 60)
    );

    const seconds = Math.floor(
        (distance % (1000 * 60)) /
        1000
    );

    document.getElementById("days").textContent =
        String(days).padStart(2, "0");

    document.getElementById("hours").textContent =
        String(hours).padStart(2, "0");

    document.getElementById("minutes").textContent =
        String(minutes).padStart(2, "0");

    document.getElementById("seconds").textContent =
        String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);
// =========================
// GALERI - FULLSCREEN + SWIPE
// =========================

const galleryImages = document.querySelectorAll(".galeri-item img");
const lightbox = document.getElementById("galeriLightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");

let currentPhoto = 0;

/* ================================
   LIGHTBOX + ZOOM + SWIPE
================================ */

let scale = 1;
let translateX = 0;
let translateY = 0;

let startX = 0;
let startY = 0;
let lastX = 0;
let lastY = 0;

let isDragging = false;
let isPinching = false;

let startDistance = 0;
let startScale = 1;

function resetZoom() {
    scale = 1;
    translateX = 0;
    translateY = 0;

    lightboxImage.style.transform =
        "translate3d(0, 0, 0) scale(1)";
}

function updateZoom() {
    lightboxImage.style.transform =
        `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`;
}

/* ================================
   BUKA FOTO
================================ */

galleryImages.forEach(function (image, index) {

    image.addEventListener("click", function () {

        currentPhoto = index;

        lightboxImage.src =
            galleryImages[currentPhoto].src;

        resetZoom();

        lightbox.classList.add("active");

        document.body.style.overflow = "hidden";
    });

});


/* ================================
   FOTO BERIKUTNYA
================================ */

function nextPhoto() {

    currentPhoto++;

    if (currentPhoto >= galleryImages.length) {
        currentPhoto = 0;
    }

    lightboxImage.src =
        galleryImages[currentPhoto].src;

    resetZoom();
}


/* ================================
   FOTO SEBELUMNYA
================================ */

function previousPhoto() {

    currentPhoto--;

    if (currentPhoto < 0) {
        currentPhoto = galleryImages.length - 1;
    }

    lightboxImage.src =
        galleryImages[currentPhoto].src;

    resetZoom();
}


/* ================================
   HITUNG JARAK 2 JARI
================================ */

/**
 * Menghitung jarak antara 2 jari
 * @param {TouchList} touches
 */
function getDistance(touches) {

    const dx =
        touches[0].clientX -
        touches[1].clientX;

    const dy =
        touches[0].clientY -
        touches[1].clientY;

    return Math.sqrt(dx * dx + dy * dy);
}

/* ================================
   TOUCH START
================================ */

lightbox.addEventListener("touchstart", function (event) {

    if (event.touches.length === 2) {

        isPinching = true;

        startDistance =
            getDistance(event.touches);

        startScale = scale;

        return;
    }

    if (event.touches.length === 1) {

        startX =
            event.touches[0].clientX;

        startY =
            event.touches[0].clientY;

        lastX = startX;
        lastY = startY;

        isDragging = false;
    }

}, { passive: false });


/* ================================
   TOUCH MOVE
================================ */

lightbox.addEventListener("touchmove", function (event) {

    event.preventDefault();

    /* PINCH ZOOM */

    if (
        event.touches.length === 2 &&
        isPinching
    ) {

        const distance =
            getDistance(event.touches);

        scale =
            startScale *
            (distance / startDistance);

        scale =
            Math.max(1, Math.min(scale, 4));

        updateZoom();

        return;
    }


    /* GESER FOTO SAAT ZOOM */

    if (
        event.touches.length === 1 &&
        scale > 1
    ) {

        const x =
            event.touches[0].clientX;

        const y =
            event.touches[0].clientY;

        const dx = x - lastX;
        const dy = y - lastY;

        translateX += dx;
        translateY += dy;

        lastX = x;
        lastY = y;

        isDragging = true;

        updateZoom();
    }

}, { passive: false });


/* ================================
   TOUCH END
================================ */

lightbox.addEventListener("touchend", function (event) {

    if (event.touches.length < 2) {
        isPinching = false;
    }


    /* SWIPE FOTO */

    if (
        !isDragging &&
        scale === 1 &&
        event.changedTouches.length === 1
    ) {

        const endX =
            event.changedTouches[0].clientX;

        const distance =
            endX - startX;


        if (distance < -50) {
            nextPhoto();
        }

        else if (distance > 50) {
            previousPhoto();
        }
    }

}, { passive: true });


/* ================================
   DOUBLE TAP ZOOM
================================ */

let lastTap = 0;

lightboxImage.addEventListener("touchend", function (event) {

    if (event.touches.length > 0) return;

    const now = Date.now();

    if (now - lastTap < 300) {

        if (scale === 1) {

            scale = 2;

        } else {

            scale = 1;
            translateX = 0;
            translateY = 0;
        }

        updateZoom();
    }

    lastTap = now;

});


/* ================================
   MOUSE WHEEL ZOOM
   (untuk komputer)
================================ */

lightboxImage.addEventListener("wheel", function (event) {

    event.preventDefault();

    if (event.deltaY < 0) {
        scale += 0.2;
    } else {
        scale -= 0.2;
    }

    scale =
        Math.max(1, Math.min(scale, 4));

    if (scale === 1) {

        translateX = 0;
        translateY = 0;
    }

    updateZoom();

}, { passive: false });


/* ================================
   TUTUP LIGHTBOX
================================ */

lightboxClose.addEventListener("click", function () {

    lightbox.classList.remove("active");

    document.body.style.overflow = "";

    resetZoom();
});


/* KLIK AREA GELAP UNTUK TUTUP */

lightbox.addEventListener("click", function (event) {

    if (event.target === lightbox) {

        lightbox.classList.remove("active");

        document.body.style.overflow = "";

        resetZoom();
    }

});

// =========================================
// RSVP - PILIHAN KEHADIRAN
// =========================================

document.querySelectorAll(".rsvp-pilihan").forEach(function(button) {

    button.addEventListener("click", function() {

        // Hapus status aktif dari semua pilihan
        document.querySelectorAll(".rsvp-pilihan").forEach(function(item) {
            item.classList.remove("aktif");
        });

        // Aktifkan pilihan yang ditekan
        this.classList.add("aktif");

    });

});
// =========================================
// RSVP - KIRIM DATA KE GOOGLE SHEETS
// =========================================

const RSVP_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyBqrDSVECg_FQH1o-4tElt1a-0yFucvCPpWcCbgI-tT09KDN5iUWSOrpJdq0lJ2tMMfw/exec";

document.getElementById("btnKonfirmasi").addEventListener("click", function () {

    const nama = document.getElementById("namaTamu").value.trim();
    const jumlah = document.getElementById("jumlahTamu").value;
    const ucapan = document.getElementById("ucapanTamu").value.trim();

    const pilihanAktif = document.querySelector(".rsvp-pilihan.aktif");
    const status = pilihanAktif
        ? pilihanAktif.getAttribute("data-status")
        : "Hadir";

    const pesan = document.getElementById("pesanKonfirmasi");

    // Cek nama
    if (!nama) {
        pesan.textContent = "Silakan masukkan nama Anda.";
        return;
    }

    // Tampilkan proses
    pesan.textContent = "Mengirim konfirmasi...";

    const data = {
        nama: nama,
        status: status,
        jumlah: jumlah,
        ucapan: ucapan
    };

    fetch(RSVP_WEB_APP_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(data)
    })
    .then(function () {

        pesan.textContent = "✓ Konfirmasi kehadiran berhasil dikirim.";

        // Kosongkan form
        document.getElementById("namaTamu").value = "";
        document.getElementById("ucapanTamu").value = "";
        document.getElementById("jumlahTamu").value = "1";

    })
    .catch(function (error) {

        console.error(error);
        pesan.textContent = "Maaf, konfirmasi gagal dikirim.";
    });

});
// =========================================
// TANDA KASIH - TOMBOL SALIN REKENING
// =========================================

document.querySelectorAll(".btn-salin").forEach(function(button) {

    button.addEventListener("click", function() {

        const nomorRekening = this.getAttribute("data-rekening");
        const tombol = this;

        navigator.clipboard.writeText(nomorRekening).then(function() {

            tombol.textContent = "✓ TERSALIN";

            setTimeout(function() {
                tombol.textContent = "SALIN";
            }, 2000);

        }).catch(function() {

            alert("Nomor rekening: " + nomorRekening);

        });

    });

});
// =========================================
// MUSIK UNDANGAN
// =========================================

const musikUndangan = document.getElementById("musikUndangan");

if (musikUndangan) {

    musikUndangan.volume = 0.5;

    document.addEventListener("click", function() {

        if (musikUndangan.paused) {
musikUndangan.play().catch(function() {
});
        }

    }, { once: true });

}