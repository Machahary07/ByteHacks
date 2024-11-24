let iconCart = document.querySelector('.cart-icon');
let cart = document.querySelector('.cart');
let container = document.querySelector('.ArtWork');
let close = document.querySelector('.close');

// Set initial style
cart.style.right = '-100%';

iconCart.addEventListener('click', function () {
    if (cart.style.right == '-100%') {
        cart.style.right = '0';
        container.style.transform = 'translateX(-400px)';
    } else {
        cart.style.right = '-100%';
        container.style.transform = 'translateX(0)';
    }
});

close.addEventListener('click', function () {
    cart.style.right = '-100%';
    container.style.transform = 'translateX(0)';
});

let listCart = [];
function checkCart() {
    const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('ArtifyCookie='));
    if (cookieValue) {
        listCart = JSON.parse(cookieValue.split('=')[1]);
    } else {
        listCart = [];
    }
}

// Add a product to the cart
function addCart(title, price, image) {
    // Check if the product already exists in the cart
    const existingProduct = listCart.find(item => item.title === title);
    if (existingProduct) {
        // Increase quantity if the product exists
        existingProduct.quantity++;
    } else {
        // Add new product to the cart
        listCart.push({
            title: title,
            price: parseFloat(price),
            image: image,
            quantity: 1
        });
    }

    // Save to cookie
    document.cookie = "ArtifyCookie=" + JSON.stringify(listCart) + "; expires=Thu, 31 Dec 2025 23:59:59 UTC; path=/;";
    addCartToHTML();
}

// Render the cart on the page
function addCartToHTML() {
    const listCartHTML = document.querySelector('.listCart');
    listCartHTML.innerHTML = ''; // Clear current cart items

    const totalHTML = document.querySelector('.totalQuantity');
    let totalQuantity = 0;

    // Populate the cart
    listCart.forEach(product => {
        const newCart = document.createElement('div');
        newCart.classList.add('item');
        newCart.innerHTML = `
            <img src="${product.image}">
            <div class="content">
                <div class="name">${product.title}</div>
                <div class="price">$${product.price} / 1 product</div>
            </div>
            <div class="quantity">
                <button onclick="changeQuantity('${product.title}', '-')">-</button>
                <span class="value">${product.quantity}</span>
                <button onclick="changeQuantity('${product.title}', '+')">+</button>
            </div>`;
        listCartHTML.appendChild(newCart);
        totalQuantity += product.quantity;
    });

    totalHTML.innerText = totalQuantity; // Update total quantity
}

// Update the quantity of a product in the cart
function changeQuantity(title, type) {
    const product = listCart.find(item => item.title === title);
    if (type === '+') {
        product.quantity++;
    } else if (type === '-') {
        product.quantity--;
        if (product.quantity <= 0) {
            listCart = listCart.filter(item => item.title !== title); // Remove item if quantity is 0
        }
    }

    // Save updated cart to cookie
    document.cookie = "ArtifyCookie=" + JSON.stringify(listCart) + "; expires=Thu, 31 Dec 2025 23:59:59 UTC; path=/;";
    addCartToHTML();
}

// Add event listeners to "add-to-cart" buttons
document.querySelectorAll('.add-to-cart').forEach((button, index) => {
    button.addEventListener('click', () => {
        const card = button.closest('.card');
        const title = card.querySelector('.title').innerText;
        const price = card.querySelector('.price').innerText.replace('$', '').trim();
        const image = card.querySelector('img').src;
        addCart(title, price, image);
    });
});

// Initialize cart on page load
checkCart();
addCartToHTML(); // Render cart contents from the cookie on page load
