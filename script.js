let basketCart = [];

window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 30) { nav.classList.add('scrolled'); } 
    else { nav.classList.remove('scrolled'); }
});

function toggleMobileMenu() {
    const linksMenu = document.getElementById('navLinksMenu');
    const icon = document.getElementById('menuToggleIcon');
    linksMenu.classList.toggle('mobile-open');
    if (linksMenu.classList.contains('mobile-open')) {
        icon.classList.replace('fa-bars', 'fa-xmark');
    } else {
        icon.classList.replace('fa-xmark', 'fa-bars');
    }
}

function closeMobileMenu() {
    const linksMenu = document.getElementById('navLinksMenu');
    if(linksMenu.classList.contains('mobile-open')) {
        linksMenu.classList.remove('mobile-open');
        document.getElementById('menuToggleIcon').classList.replace('fa-xmark', 'fa-bars');
    }
}

function imageLoaded(img) {
    img.classList.add('loaded');
    const placeholder = img.parentElement.querySelector('.mystical-fallback');
    if(placeholder) placeholder.style.opacity = '0';
}

function imageError(img) {
    // If the user hasn't uploaded the image yet, keep the fallback visible and hide the broken img icon.
    img.style.display = 'none';
}

function openLightboxModal(imageSrc) {
    const lightbox = document.getElementById('imageLightbox');
    const targetImg = document.getElementById('lightboxTargetImage');
    
    // We check if there's an image element with this source that loaded successfully.
    // If we're using the placeholder, we won't open it or we'll show an alert.
    const matchingImages = document.querySelectorAll(`img[src="${imageSrc}"]`);
    let isLoaded = false;
    if(matchingImages.length > 0) {
        if(matchingImages[0].classList.contains('loaded') && matchingImages[0].style.display !== 'none') {
            isLoaded = true;
        }
    }

    if (isLoaded) {
        targetImg.src = imageSrc;
        lightbox.style.display = 'flex';
    } else {
        alert("This product image will be viewable in high resolution once you upload the picture to the 'images/' folder.");
    }
}

function closeLightboxModal() {
    document.getElementById('imageLightbox').style.display = 'none';
}

function toggleFaq(element) {
    const item = element.parentElement;
    const body = item.querySelector('.faq-body');
    if (item.classList.contains('active')) {
        body.style.maxHeight = null;
        item.classList.remove('active');
    } else {
        document.querySelectorAll('.faq-item').forEach(el => {
            el.classList.remove('active');
            el.querySelector('.faq-body').style.maxHeight = null;
        });
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + "px";
    }
}

function filterProducts(category, event) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    if(event) event.target.classList.add('active');
    
    document.querySelectorAll('.product-card').forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'flex';
            card.style.animation = 'fadeUp 0.5s ease forwards';
        } else {
            card.style.display = 'none';
        }
    });
}

function toggleCartDrawer(openStatus) {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (openStatus) {
        drawer.classList.add('open');
        overlay.classList.add('open');
    } else {
        drawer.classList.remove('open');
        overlay.classList.remove('open');
    }
}

function addItemToCart(name, price) {
    const existingItem = basketCart.find(item => item.name === name);
    if (existingItem) { existingItem.quantity += 1; } 
    else { basketCart.push({ name: name, price: price, quantity: 1 }); }
    updateCartUI();
    toggleCartDrawer(true);
}

function adjustItemQuantity(name, shift) {
    const item = basketCart.find(item => item.name === name);
    if (item) {
        item.quantity += shift;
        if (item.quantity <= 0) { basketCart = basketCart.filter(i => i.name !== name); }
    }
    updateCartUI();
}

function updateCartUI() {
    const container = document.getElementById('cartItemsContainer');
    const badge = document.getElementById('cartBadgeCount');
    const totalDisplay = document.getElementById('cartTotalDisplay');
    let totalItemCount = 0; let grandTotalSum = 0;
    container.innerHTML = '';
    
    if (basketCart.length === 0) {
        container.innerHTML = '<p class="empty-cart-msg">Your basket is currently empty.</p>';
    } else {
        basketCart.forEach(item => {
            totalItemCount += item.quantity;
            grandTotalSum += (item.price * item.quantity);
            container.innerHTML += `
                <div class="cart-item">
                    <div>
                        <h4>${item.name}</h4>
                        <p style="color:var(--gold-primary)">₦${(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                    <div class="quantity-control">
                        <span class="quantity-btn" onclick="adjustItemQuantity('${item.name}', -1)">-</span>
                        <span>${item.quantity}</span>
                        <span class="quantity-btn" onclick="adjustItemQuantity('${item.name}', 1)">+</span>
                    </div>
                </div>
            `;
        });
    }
    badge.innerText = totalItemCount;
    totalDisplay.innerText = '₦' + grandTotalSum.toLocaleString();
}

function executeCartCheckout() {
    if (basketCart.length === 0) { return; }
    const baseNumber = "2348143644489";
    let orderSummary = "Hello Omoolopaase Empire, I want to purchase the following spiritual solutions:\n\n";
    let grandTotal = 0;
    basketCart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        grandTotal += itemTotal;
        orderSummary += `${index + 1}. ${item.name} (x${item.quantity}) - ₦${itemTotal.toLocaleString()}\n`;
    });
    orderSummary += `\n🎯 Grand Total: ₦${grandTotal.toLocaleString()}`;
    window.open(`https://wa.me/${baseNumber}?text=${encodeURIComponent(orderSummary)}`, '_blank');
}

function bookConsultation(tierType) {
    const baseNumber = "2348143644489";
    let msg = "Hello, I am ready for the Consultation. I want to select the normal one.";
    if (tierType === 'vip') { msg = "Hello, I am ready for the Consultation. I would love to sign up for the VIP one."; }
    else if (tierType === 'face-to-face') { msg = "Hello, I am ready for the Consultation. I want to book a physical face-to-face session."; }
    window.open(`https://wa.me/${baseNumber}?text=${encodeURIComponent(msg)}`, '_blank');
}
