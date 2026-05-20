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
    if(img.getAttribute('src') === "") {
        img.style.display = 'none';
        return;
    }
    img.classList.add('loaded');
    const placeholder = img.parentElement.querySelector('.mystical-fallback');
    if(placeholder) placeholder.style.opacity = '0';
}

function imageError(img) {
    img.style.display = 'none';
}

function openLightboxModal(imageSrc) {
    if(!imageSrc || imageSrc === "") {
        alert("This specialized spiritual remedy is dynamically customized following a direct framework session.");
        return;
    }
    const lightbox = document.getElementById('imageLightbox');
    const targetImg = document.getElementById('lightboxTargetImage');
    
    const matchingImages = document.querySelectorAll(`img[src="${imageSrc}"]`);
    let isLoaded = false;
    if(matchingImages.length > 0) {
        if(matchingImages[0].style.display !== 'none') {
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
            const convertedItemTotal = Math.round((item.price * item.quantity) * exchangeRates[currentCurrency]);
            
            let displayedPrice = `${currencySymbols[currentCurrency]}${convertedItemTotal.toLocaleString()}`;
            if(item.price === 0) { displayedPrice = "Consultation Link"; }

            container.innerHTML += `
                <div class="cart-item">
                    <div>
                        <h4>${item.name}</h4>
                        <p style="color:var(--gold-primary)">${displayedPrice}</p>
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
    const convertedGrandTotal = Math.round(grandTotalSum * exchangeRates[currentCurrency]);
    totalDisplay.innerText = currencySymbols[currentCurrency] + convertedGrandTotal.toLocaleString();
}

function executeCartCheckout() {
    if (basketCart.length === 0) { return; }
    const baseNumber = "2348073733419";
    let orderSummary = "Hello Omoolopaase Empire, I want to purchase the following spiritual solutions:\n\n";
    let grandTotal = 0;
    basketCart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        grandTotal += itemTotal;
        const convertedItemTotal = Math.round(itemTotal * exchangeRates[currentCurrency]);
        
        let priceString = `${currencySymbols[currentCurrency]}${convertedItemTotal.toLocaleString()}`;
        if(item.price === 0) { priceString = "Price via Consultation"; }

        orderSummary += `${index + 1}. ${item.name} (x${item.quantity}) - ${priceString}\n`;
    });
    const convertedGrandTotal = Math.round(grandTotal * exchangeRates[currentCurrency]);
    orderSummary += `\n🎯 Grand Total: ${currencySymbols[currentCurrency]}${convertedGrandTotal.toLocaleString()}`;
    window.open(`https://wa.me/${baseNumber}?text=${encodeURIComponent(orderSummary)}`, '_blank');
}

function bookConsultation(tierType) {
    const baseNumber = "2348073733419";
    let msg = "Hello, I am ready for the Consultation. I want to select the normal one.";
    if (tierType === 'vip') { msg = "Hello, I am ready for the Consultation. I would love to sign up for the VIP one."; }
    else if (tierType === 'face-to-face') { msg = "Hello, I am ready for the Consultation. I want to book a physical face-to-face session."; }
    window.open(`https://wa.me/${baseNumber}?text=${encodeURIComponent(msg)}`, '_blank');
}

/* --- CURRENCY SWITCHER LOGIC --- */
let currentCurrency = 'NGN';
const exchangeRates = { NGN: 1, USD: 1/1500, GBP: 1/1900, EUR: 1/1600 };
const currencySymbols = { NGN: '₦', USD: '$', GBP: '£', EUR: '€' };

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.new-price, .tier-price').forEach(el => {
        let rawNum = el.innerText.replace(/[^0-9]/g, '');
        if(rawNum !== "") {
            el.setAttribute('data-base-price', rawNum);
        }
    });
});

function changeCurrency(currency) {
    currentCurrency = currency;
    const rate = exchangeRates[currency];
    const symbol = currencySymbols[currency];
    
    document.querySelectorAll('.new-price, .tier-price').forEach(el => {
        const basePrice = parseInt(el.getAttribute('data-base-price'));
        if(!isNaN(basePrice)) {
            const converted = Math.round(basePrice * rate);
            el.innerText = symbol + converted.toLocaleString();
        }
    });
    updateCartUI();
}

/* --- EMAILJS INTEGRATION --- */
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('empireContactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const submitBtn = this.querySelector('.luxury-submit-btn');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = "Encrypting Transmission...";
            submitBtn.disabled = true;

            const templateParams = {
                from_name: document.getElementById('userName').value,
                reply_to: document.getElementById('userEmail').value,
                message: document.getElementById('userMessage').value
            };

            emailjs.send('service_x9pc811', 'template_pd71q72', templateParams)
                .then(() => {
                    alert('Your spiritual request has been logged and transmitted securely.');
                    contactForm.reset();
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                }, (error) => {
                    alert('Transmission channel blocked. Please try checking your network connection.');
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                });
        });
    }

    const subscribeForm = document.getElementById('empireSubscribeForm');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const subBtn = document.getElementById('subscribeBtn');
            const originalSubText = subBtn.innerText;
            subBtn.innerText = "Securing Star...";
            subBtn.disabled = true;

            const inputEmail = document.getElementById('subscriberEmail').value;

            const templateParams = {
                from_name: "Inner Circle Subscriber",
                reply_to: inputEmail,
                message: `Shalom Empire Team,\n\nA new vessel has requested access to the Inner Circle: ${inputEmail}`
            };

            emailjs.send('service_x9pc811', 'template_pd71q72', templateParams)
                .then(() => {
                    alert('Subscription confirmed.');
                    subscribeForm.reset();
                    subBtn.innerText = originalSubText;
                    subBtn.disabled = false;
                }, (error) => {
                    alert('Subscription alignment interrupted.');
                    subBtn.innerText = originalSubText;
                    subBtn.disabled = false;
                });
        });
    }
});
