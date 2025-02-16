const loader = document.querySelector("#loader");
const cart = document.querySelector(".cart");
const cartClose = document.querySelector("#cart-close");
const cartIcon = document.querySelector("#cart-icon");
const addCartButtons = document.querySelectorAll(".add-cart");

cartIcon.addEventListener("click", () => cart.classList.add("active"))
cartClose.addEventListener("click", () => cart.classList.remove("active"))

addCartButtons.forEach(button => {
    button.addEventListener("click", event => {
        const productBox = event.target.closest(".product-box");
        addToCart(productBox);
    })
})

const addToCart = productBox => {
    const productImgSrc = productBox.querySelector("img").src;
    const productTitle = productBox.querySelector(".product-title").textContent;
    const productPrice = productBox.querySelector(".price").textContent;
    const cartContent = document.querySelector(".cart-content");

    const cartItems = cartContent.querySelectorAll(".cart-product-title");
    for (let item of cartItems) {
        if (item.textContent === productTitle) {
            alert("This product is already in the cart.");
            return;
        }
    }
    const cartBox = document.createElement("div");
    cartBox.classList.add("cart-box")
    cartBox.innerHTML = `
                <img src="${productImgSrc}" class="cart-img">
                <div class="cart-details">
                    <h2 class="cart-product-title">${productTitle}</h2>
                    <span class="cart-price">${productPrice}</span>
                    <div class="cart-quantity">
                        <button id="decrement">-</button>
                        <span class="number">1</span>
                        <button id="increment">+</button>
                    </div>
                </div>
                <i class="ri-delete-bin-line cart-remove"></i>
                `;
    cartContent.appendChild(cartBox);
    cartBox.querySelector(".cart-remove").addEventListener("click", () => {
        cartBox.remove();
        updateCartCount(-1);
        updateTotalPrice();
    })

    cartBox.querySelector(".cart-quantity").addEventListener("click", event => {
        const numberElement = cartBox.querySelector(".number");
        const decrementButton = cartBox.querySelector("#decrement");
        const incrementButton = cartBox.querySelector("#increment");
        let quantity = parseInt(numberElement.textContent);

        if (event.target.id === "decrement" && quantity > 1) {
            quantity--;
            if (quantity === 1) {
                decrementButton.style.color = "#999"
            }
        } else if (event.target.id === "increment") {
            quantity++;
            decrementButton.style.color = "#333"
        }
        numberElement.textContent = quantity;
        updateTotalPrice();
    })
    updateCartCount(1);
    updateTotalPrice();
};

const updateTotalPrice = () => {
    const cartContent = document.querySelector(".cart-content");
    const totalPriceElement = document.querySelector(".total-price");
    const cartBoxes = cartContent.querySelectorAll(".cart-box");
    let total = 0;
    cartBoxes.forEach(cartBox => {
        const priceElement = cartBox.querySelector(".cart-price");
        const quantityElement = cartBox.querySelector(".number");
        const price = priceElement.textContent.replace("$", "");
        const quantity = quantityElement.textContent;
        total += price * quantity;
    });
    totalPriceElement.textContent = `$${total}`;
}

let cartItemCount = 0;
const updateCartCount = change => {
    const cartItemCountBadge = document.querySelector(".cart-item-count");
    cartItemCount += change;
    if (cartItemCount > 0) {
        cartItemCountBadge.style.visibility = "visible";
        cartItemCountBadge.textContent = cartItemCount;
    } else {
        cartItemCountBadge.style.visibility = "hidden";
        cartItemCountBadge.textContent = "";
    }
}

const buyNowButton = document.querySelector(".btn-buy");
buyNowButton.addEventListener("click", () => {
    const cartContent = document.querySelector(".cart-content")
    const cartBoxes = cartContent.querySelectorAll(".cart-box");
    if (cartBoxes.length === 0) {
        alert("Your cart is empty. Please add items to your cart before buying.");
        return;
    }
    loader.style.display = "block";
    setTimeout(() => {
    cartBoxes.forEach(cartBox => cartBox.remove());
    cartItemCount = 0;
    updateCartCount(0);
    updateTotalPrice();
    
    loader.style.display = "none";
    alert("Thank you for your purchase!");
    }, 2000); // 2-second delay to simulate API call
})