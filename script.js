/* Heart toggle */
document.querySelectorAll('.cards button i.fa-heart').forEach(heart => {
    heart.addEventListener('click', () => {
        heart.classList.toggle('fa-regular');
        heart.classList.toggle('fa-solid');
        heart.style.color = heart.classList.contains('fa-solid') ? '#b97de8' : '';
    });
});

/* Add to Cart */
document.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', () => {
        const card = btn.closest('[data-id]');
        if (!card) return;
        addToCart(card.dataset.id, card.dataset.name, parseFloat(card.dataset.price), card.dataset.img);
        btn.classList.add('added');
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Added!';
        setTimeout(() => {
            btn.classList.remove('added');
            btn.innerHTML = '<i class="fa-solid fa-cart-plus"></i> Add to Cart';
        }, 1800);
    });
});

/* Brand filter */
document.addEventListener('DOMContentLoaded', () => {
    const checkboxes = document.querySelectorAll('.brand-filter');
    const cards = document.querySelectorAll('.cards');
    checkboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            const selected = Array.from(checkboxes).filter(c => c.checked).map(c => c.value);
            if (!selected.length) { cards.forEach(c => c.classList.remove('d-none')); return; }
            cards.forEach(c => {
                const brand = c.dataset.brand?.toLowerCase();
                c.classList.toggle('d-none', !selected.includes(brand));
            });
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    /* Image gallery */
    const mainImg = document.getElementById("mainImg");
    const smallImgs = document.querySelectorAll(".small-img");

    if (mainImg && smallImgs.length) {
        smallImgs.forEach(i => i.style.filter = "grayscale(100%)");
        smallImgs.forEach(img => {
            img.addEventListener("click", function() {
                mainImg.src = this.src;
                smallImgs.forEach(i => i.style.filter = "grayscale(100%)");
                this.style.filter = "none";
            });
        });
    }

    /* Storage / price selector */
    const storageRadios = document.querySelectorAll('input[name="btnradio"]');
    const currentPriceElement = document.getElementById('current-price');

    function updatePrice() {
        const selectedRadio = document.querySelector('input[name="btnradio"]:checked');
        if (selectedRadio && currentPriceElement) {
            currentPriceElement.textContent = `$${selectedRadio.getAttribute('data-price')}`;
        }
    }

    storageRadios.forEach(radio => radio.addEventListener('change', updatePrice));
    updatePrice();
});

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btn-send');
    const success = document.getElementById('form-success');

    btn.addEventListener('click', () => {
        const fname   = document.getElementById('inp-fname').value.trim();
        const email   = document.getElementById('inp-email').value.trim();
        const subject = document.getElementById('inp-subject').value;
        const message = document.getElementById('inp-message').value.trim();

        if (!fname || !email || !subject || !message) {
            /* simple shake if fields empty */
            btn.style.animation = 'none';
            btn.offsetHeight; /* reflow */
            btn.style.animation = '';
            document.querySelectorAll('.cyber-input').forEach(el => {
                if (!el.value.trim()) el.style.borderColor = '#e05252';
                else el.style.borderColor = '';
            });
            return;
        }

        btn.classList.add('sent');
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Sent!';
        success.classList.add('show');

        setTimeout(() => {
            btn.classList.remove('sent');
            btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
            success.classList.remove('show');
            /* clear form */
            ['inp-fname','inp-lname','inp-email','inp-message'].forEach(id => {
                document.getElementById(id).value = '';
            });
            document.getElementById('inp-subject').selectedIndex = 0;
            document.querySelectorAll('.cyber-input').forEach(el => el.style.borderColor = '');
        }, 3000);
    });
});