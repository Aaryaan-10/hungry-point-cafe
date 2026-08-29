```javascript
/* =========================================================
   HUNGRY POINT CAFE
   CART + CHECKOUT + WHATSAPP ORDER SYSTEM
   ========================================================= */


/* ================= CONFIG ================= */

const WHATSAPP_NUMBER = "9779810487212";


/* ================= CART ================= */

let cart = JSON.parse(localStorage.getItem("hungryPointCart")) || [];


/* ================= ELEMENTS ================= */

const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const openCartBtn = document.getElementById("openCart");
const closeCartBtn = document.getElementById("closeCart");

const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

const checkoutBtn = document.getElementById("checkoutBtn");

const checkoutOverlay = document.getElementById("checkoutOverlay");
const closeCheckoutBtn = document.getElementById("closeCheckout");

const checkoutForm = document.getElementById("checkoutForm");

const checkoutSummaryItems =
  document.getElementById("checkoutSummaryItems");

const checkoutTotal =
  document.getElementById("checkoutTotal");

const addressGroup =
  document.getElementById("addressGroup");

const customerAddress =
  document.getElementById("customerAddress");

const menuPreview =
  document.getElementById("menuPreview");

const modal =
  document.getElementById("modal");

const modalClose =
  document.getElementById("modalClose");

const menuToggle =
  document.getElementById("menuToggle");

const navLinks =
  document.getElementById("navLinks");

const heroOrderBtn =
  document.getElementById("heroOrderBtn");

const deliveryOrderBtn =
  document.getElementById("deliveryOrderBtn");

const browseMenuBtn =
  document.getElementById("browseMenuBtn");

const year =
  document.getElementById("year");


/* ================= YEAR ================= */

if (year) {
  year.textContent = new Date().getFullYear();
}


/* ================= SAVE CART ================= */

function saveCart() {

  localStorage.setItem(
    "hungryPointCart",
    JSON.stringify(cart)
  );

}


/* ================= FORMAT MONEY ================= */

function money(amount) {

  return `Rs. ${amount.toLocaleString("en-IN")}`;

}


/* ================= ADD TO CART ================= */

function addToCart(name, price) {

  const existingItem =
    cart.find(item => item.name === name);

  if (existingItem) {

    existingItem.quantity += 1;

  } else {

    cart.push({
      name: name,
      price: Number(price),
      quantity: 1
    });

  }

  saveCart();

  renderCart();

  showAddedMessage(name);

}


/* ================= REMOVE ITEM ================= */

function removeFromCart(name) {

  cart =
    cart.filter(item => item.name !== name);

  saveCart();

  renderCart();

}


/* ================= CHANGE QUANTITY ================= */

function changeQuantity(name, change) {

  const item =
    cart.find(item => item.name === name);

  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {

    removeFromCart(name);

    return;

  }

  saveCart();

  renderCart();

}


/* ================= CART TOTAL ================= */

function getCartTotal() {

  return cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

}


/* ================= CART ITEM COUNT ================= */

function getCartCount() {

  return cart.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

}


/* ================= RENDER CART ================= */

function renderCart() {

  if (!cartItems) return;


  /* Cart count */

  if (cartCount) {

    cartCount.textContent =
      getCartCount();

  }


  /* Total */

  if (cartTotal) {

    cartTotal.textContent =
      money(getCartTotal());

  }


  /* Checkout button */

  if (checkoutBtn) {

    checkoutBtn.disabled =
      cart.length === 0;

  }


  /* Empty cart */

  if (cart.length === 0) {

    cartItems.innerHTML = `

      <div class="empty-cart">

        <div>🛒</div>

        <h3>
          Your cart is empty
        </h3>

        <p>
          Add something delicious from the menu.
        </p>

        <button
          class="btn primary"
          id="browseMenuBtn"
          type="button"
        >
          Browse Menu
        </button>

      </div>

    `;

    const newBrowseBtn =
      document.getElementById("browseMenuBtn");

    if (newBrowseBtn) {

      newBrowseBtn.addEventListener(
        "click",
        () => {

          closeCart();

          document
            .getElementById("menu")
            ?.scrollIntoView({
              behavior: "smooth"
            });

        }
      );

    }

    return;

  }


  /* Render items */

  cartItems.innerHTML = cart.map(item => {

    const itemTotal =
      item.price * item.quantity;

    return `

      <div class="cart-item">

        <div class="cart-item-info">

          <h4>
            ${escapeHTML(item.name)}
          </h4>

          <span>
            ${money(item.price)} each
          </span>

        </div>


        <div class="cart-item-right">

          <strong>
            ${money(itemTotal)}
          </strong>


          <div class="quantity-controls">

            <button
              type="button"
              class="quantity-btn"
              data-action="decrease"
              data-name="${escapeAttribute(item.name)}"
              aria-label="Decrease ${escapeAttribute(item.name)} quantity"
            >
              −
            </button>


            <span>
              ${item.quantity}
            </span>


            <button
              type="button"
              class="quantity-btn"
              data-action="increase"
              data-name="${escapeAttribute(item.name)}"
              aria-label="Increase ${escapeAttribute(item.name)} quantity"
            >
              +
            </button>

          </div>

        </div>

      </div>

    `;

  }).join("");


  /* Quantity buttons */

  cartItems
    .querySelectorAll(".quantity-btn")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const name =
            button.dataset.name;

          const action =
            button.dataset.action;

          changeQuantity(
            name,
            action === "increase"
              ? 1
              : -1
          );

        }
      );

    });

}


/* ================= OPEN CART ================= */

function openCart() {

  if (!cartDrawer || !cartOverlay) return;

  cartDrawer.classList.add("active");
  cartOverlay.classList.add("active");

  cartDrawer.setAttribute(
    "aria-hidden",
    "false"
  );

  cartOverlay.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.classList.add("cart-open");

}


/* ================= CLOSE CART ================= */

function closeCart() {

  if (!cartDrawer || !cartOverlay) return;

  cartDrawer.classList.remove("active");
  cartOverlay.classList.remove("active");

  cartDrawer.setAttribute(
    "aria-hidden",
    "true"
  );

  cartOverlay.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.classList.remove("cart-open");

}


/* ================= CHECKOUT ================= */

function openCheckout() {

  if (cart.length === 0) {

    openCart();

    return;

  }

  closeCart();

  renderCheckoutSummary();

  checkoutOverlay?.classList.add("active");

  checkoutOverlay?.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.classList.add(
    "checkout-open"
  );

}


/* ================= CLOSE CHECKOUT ================= */

function closeCheckout() {

  checkoutOverlay?.classList.remove(
    "active"
  );

  checkoutOverlay?.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.classList.remove(
    "checkout-open"
  );

}


/* ================= CHECKOUT SUMMARY ================= */

function renderCheckoutSummary() {

  if (!checkoutSummaryItems) return;


  checkoutSummaryItems.innerHTML =
    cart.map(item => {

      return `

        <div class="summary-item">

          <span>
            ${escapeHTML(item.name)}
            × ${item.quantity}
          </span>

          <strong>
            ${money(
              item.price * item.quantity
            )}
          </strong>

        </div>

      `;

    }).join("");


  if (checkoutTotal) {

    checkoutTotal.textContent =
      money(getCartTotal());

  }

}


/* ================= ORDER TYPE ================= */

function updateOrderType() {

  const selected =
    document.querySelector(
      'input[name="orderType"]:checked'
    );

  if (!selected) return;


  if (selected.value === "Pickup") {

    addressGroup?.classList.add(
      "hidden"
    );

    if (customerAddress) {

      customerAddress.required =
        false;

    }

  } else {

    addressGroup?.classList.remove(
      "hidden"
    );

    if (customerAddress) {

      customerAddress.required =
        true;

    }

  }

}


/* ================= WHATSAPP ORDER ================= */

function sendWhatsAppOrder(event) {

  event.preventDefault();


  if (cart.length === 0) {

    alert(
      "Your cart is empty. Please add an item first."
    );

    return;

  }


  const customerName =
    document
      .getElementById("customerName")
      ?.value
      .trim();


  const customerPhone =
    document
      .getElementById("customerPhone")
      ?.value
      .trim();


  const orderType =
    document
      .querySelector(
        'input[name="orderType"]:checked'
      )
      ?.value || "Delivery";


  const address =
    customerAddress
      ?.value
      .trim() || "";


  const notes =
    document
      .getElementById("orderNotes")
      ?.value
      .trim() || "";


  if (!customerName) {

    alert(
      "Please enter your name."
    );

    return;

  }


  if (!customerPhone) {

    alert(
      "Please enter your phone number."
    );

    return;

  }


  if (
    orderType === "Delivery" &&
    !address
  ) {

    alert(
      "Please enter your delivery address."
    );

    return;

  }


  /* Build item list */

  const orderLines =
    cart.map(item => {

      const total =
        item.price * item.quantity;

      return `• ${item.name} × ${item.quantity} — ${money(total)}`;

    });


  /* Build WhatsApp message */

  let message =

`🍽️ *NEW HUNGRY POINT CAFE ORDER*

👤 *Customer:* ${customerName}
📞 *Phone:* ${customerPhone}

📦 *Order Type:* ${orderType}

🛒 *ORDER ITEMS*
${orderLines.join("\n")}

💰 *TOTAL:* ${money(getCartTotal())}`;


  if (orderType === "Delivery") {

    message +=

`\n\n📍 *Delivery Address:*
${address}`;

  }


  if (notes) {

    message +=

`\n\n📝 *Special Instructions:*
${notes}`;

  }


  message +=

`\n\n━━━━━━━━━━━━━━
Thank you for ordering from Hungry Point Cafe! ❤️`;


  /* Encode message */

  const encodedMessage =
    encodeURIComponent(message);


  /* WhatsApp URL */

  const whatsappURL =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;


  /* Open WhatsApp */

  window.open(
    whatsappURL,
    "_blank",
    "noopener,noreferrer"
  );


}


/* ================= ESCAPE HTML ================= */

function escapeHTML(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


function escapeAttribute(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

}


/* ================= ADDED MESSAGE ================= */

function showAddedMessage(name) {

  const message =
    document.createElement("div");

  message.className =
    "cart-toast";

  message.innerHTML = `
    <span>✓</span>
    ${escapeHTML(name)} added to cart
  `;

  document.body.appendChild(message);


  setTimeout(() => {

    message.classList.add(
      "show"
    );

  }, 20);


  setTimeout(() => {

    message.classList.remove(
      "show"
    );

    setTimeout(() => {

      message.remove();

    }, 300);

  }, 1800);

}


/* ================= ADD BUTTONS ================= */

document
  .querySelectorAll(".add-btn")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const name =
          button.dataset.name;

        const price =
          Number(button.dataset.price);

        addToCart(
          name,
          price
        );

      }
    );

  });


/* ================= CART EVENTS ================= */

openCartBtn?.addEventListener(
  "click",
  openCart
);

closeCartBtn?.addEventListener(
  "click",
  closeCart
);

cartOverlay?.addEventListener(
  "click",
  closeCart
);


/* ================= CHECKOUT EVENTS ================= */

checkoutBtn?.addEventListener(
  "click",
  openCheckout
);

closeCheckoutBtn?.addEventListener(
  "click",
  closeCheckout
);


checkoutOverlay?.addEventListener(
  "click",
  event => {

    if (
      event.target === checkoutOverlay
    ) {

      closeCheckout();

    }

  }
);


/* ================= FORM EVENTS ================= */

checkoutForm?.addEventListener(
  "submit",
  sendWhatsAppOrder
);


document
  .querySelectorAll(
    'input[name="orderType"]'
  )
  .forEach(radio => {

    radio.addEventListener(
      "change",
      updateOrderType
    );

  });


/* ================= HERO ORDER ================= */

heroOrderBtn?.addEventListener(
  "click",
  () => {

    if (cart.length > 0) {

      openCart();

    } else {

      document
        .getElementById("menu")
        ?.scrollIntoView({
          behavior: "smooth"
        });

    }

  }
);


/* ================= DELIVERY ORDER ================= */

deliveryOrderBtn?.addEventListener(
  "click",
  () => {

    if (cart.length > 0) {

      openCart();

    } else {

      document
        .getElementById("menu")
        ?.scrollIntoView({
          behavior: "smooth"
        });

    }

  }
);


/* ================= MENU BROWSE ================= */

browseMenuBtn?.addEventListener(
  "click",
  () => {

    closeCart();

    document
      .getElementById("menu")
      ?.scrollIntoView({
        behavior: "smooth"
      });

  }
);


/* ================= MOBILE MENU ================= */

menuToggle?.addEventListener(
  "click",
  () => {

    const isOpen =
      navLinks?.classList.toggle(
        "active"
      );


    menuToggle.setAttribute(
      "aria-expanded",
      String(!!isOpen)
    );

  }
);


/* Close mobile navigation */

navLinks
  ?.querySelectorAll("a")
  .forEach(link => {

    link.addEventListener(
      "click",
      () => {

        navLinks.classList.remove(
          "active"
        );

        menuToggle?.setAttribute(
          "aria-expanded",
          "false"
        );

      }
    );

  });


/* ================= MENU IMAGE MODAL ================= */

menuPreview?.addEventListener(
  "click",
  () => {

    modal?.classList.add(
      "active"
    );

    modal?.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.classList.add(
      "modal-open"
    );

  }
);


modalClose?.addEventListener(
  "click",
  closeMenuModal
);


modal?.addEventListener(
  "click",
  event => {

    if (
      event.target === modal
    ) {

      closeMenuModal();

    }

  }
);


function closeMenuModal() {

  modal?.classList.remove(
    "active"
  );

  modal?.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.classList.remove(
    "modal-open"
  );

}


/* ================= ESC KEY ================= */

document.addEventListener(
  "keydown",
  event => {

    if (event.key !== "Escape") return;

    closeCart();
    closeCheckout();
    closeMenuModal();

  }
);


/* ================= SCROLL REVEAL ================= */

const revealElements =
  document.querySelectorAll(
    ".reveal"
  );


if (
  "IntersectionObserver" in window
) {

  const observer =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (
            entry.isIntersecting
          ) {

            entry.target.classList.add(
              "visible"
            );

            observer.unobserve(
              entry.target
            );

          }

        });

      },
      {
        threshold: 0.12
      }
    );


  revealElements.forEach(
    element =>
      observer.observe(element)
  );

} else {

  revealElements.forEach(
    element =>
      element.classList.add(
        "visible"
      )
  );

}


/* ================= INITIALIZE ================= */

renderCart();

updateOrderType();
```
