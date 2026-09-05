/* =========================================================
   HUNGRY POINT CAFE
   PREMIUM WEBSITE JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     CONFIGURATION
  ======================================================= */

  const WHATSAPP_NUMBER = "9779810487212";

  const CAFE_NAME = "Hungry Point Cafe";

  const CAFE_ADDRESS = "Sundarharaincha-3, Morang, Nepal";


  /* =======================================================
     HELPERS
  ======================================================= */

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

  const formatPrice = (price) =>
    `Rs. ${Number(price).toLocaleString("en-IN")}`;


  /* =======================================================
     PAGE LOADER
  ======================================================= */

  window.addEventListener("load", () => {

    const loader = $(".page-loader");

    if (loader) {
      setTimeout(() => {
        loader.classList.add("loaded");
      }, 500);
    }

  });


  /* =======================================================
     HEADER SCROLL EFFECT
  ======================================================= */

  const header = $(".site-header");

  const handleHeaderScroll = () => {

    if (!header) return;

    if (window.scrollY > 30) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

  };

  handleHeaderScroll();

  window.addEventListener(
    "scroll",
    handleHeaderScroll,
    { passive: true }
  );


  /* =======================================================
     MOBILE NAVIGATION
  ======================================================= */

  const menuToggle = $(".menu-toggle");
  const mainNav = $(".main-nav");
  const mobileOverlay = $(".mobile-overlay");

  const closeMobileMenu = () => {

    if (!menuToggle || !mainNav) return;

    menuToggle.classList.remove("active");
    mainNav.classList.remove("active");

    if (mobileOverlay) {
      mobileOverlay.classList.remove("active");
    }

  };

  const openMobileMenu = () => {

    if (!menuToggle || !mainNav) return;

    menuToggle.classList.add("active");
    mainNav.classList.add("active");

    if (mobileOverlay) {
      mobileOverlay.classList.add("active");
    }

  };

  if (menuToggle) {

    menuToggle.addEventListener("click", () => {

      if (mainNav.classList.contains("active")) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }

    });

  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener(
      "click",
      closeMobileMenu
    );
  }

  $$(".nav-link").forEach(link => {

    link.addEventListener("click", () => {
      closeMobileMenu();
    });

  });


  /* =======================================================
     ACTIVE NAVIGATION
  ======================================================= */

  const sections = $$("section[id]");
  const navLinks = $$(".nav-link");

  const updateActiveNav = () => {

    let current = "";

    sections.forEach(section => {

      const top =
        section.getBoundingClientRect().top;

      if (top <= 140) {
        current = section.id;
      }

    });

    navLinks.forEach(link => {

      const href = link.getAttribute("href");

      link.classList.toggle(
        "active",
        href === `#${current}`
      );

    });

  };

  window.addEventListener(
    "scroll",
    updateActiveNav,
    { passive: true }
  );


  /* =======================================================
     SCROLL REVEAL
  ======================================================= */

  const revealElements = $$(".reveal");

  if ("IntersectionObserver" in window) {

    const revealObserver =
      new IntersectionObserver(
        (entries, observer) => {

          entries.forEach(entry => {

            if (entry.isIntersecting) {

              entry.target.classList.add("visible");

              observer.unobserve(entry.target);

            }

          });

        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -40px 0px"
        }
      );

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });

  } else {

    revealElements.forEach(element => {
      element.classList.add("visible");
    });

  }


  /* =======================================================
     CART DATA
  ======================================================= */

  let cart = [];


  /* =======================================================
     CART ELEMENTS
  ======================================================= */

  const cartDrawer = $(".cart-drawer");
  const drawerOverlay = $(".drawer-overlay");
  const cartItemsContainer = $(".cart-items");
  const cartTotalElement = $(".cart-total strong");

  const cartOpenButtons = $$(
    "[data-cart-open]"
  );

  const cartCloseButtons = $$(
    "[data-cart-close]"
  );


  /* =======================================================
     OPEN CART
  ======================================================= */

  const openCart = () => {

    if (!cartDrawer) return;

    cartDrawer.classList.add("active");

    if (drawerOverlay) {
      drawerOverlay.classList.add("active");
    }

    document.body.classList.add("no-scroll");

    renderCart();

  };


  /* =======================================================
     CLOSE CART
  ======================================================= */

  const closeCart = () => {

    if (!cartDrawer) return;

    cartDrawer.classList.remove("active");

    if (drawerOverlay) {
      drawerOverlay.classList.remove("active");
    }

    document.body.classList.remove("no-scroll");

  };


  cartOpenButtons.forEach(button => {

    button.addEventListener(
      "click",
      openCart
    );

  });


  cartCloseButtons.forEach(button => {

    button.addEventListener(
      "click",
      closeCart
    );

  });


  if (drawerOverlay) {

    drawerOverlay.addEventListener(
      "click",
      closeCart
    );

  }


  /* =======================================================
     ADD TO CART
  ======================================================= */

  $$("[data-add-cart]").forEach(button => {

    button.addEventListener("click", () => {

      const name =
        button.dataset.name ||
        button.getAttribute("data-item") ||
        "Food Item";

      const price =
        Number(button.dataset.price) || 0;

      const emoji =
        button.dataset.emoji || "🍽️";

      const existing =
        cart.find(item => item.name === name);

      if (existing) {

        existing.quantity += 1;

      } else {

        cart.push({
          name,
          price,
          emoji,
          quantity: 1
        });

      }

      renderCart();

      showToast(
        "Added to cart",
        `${name} has been added.`
      );

    });

  });


  /* =======================================================
     REMOVE FROM CART
  ======================================================= */

  const removeFromCart = (index) => {

    if (
      index < 0 ||
      index >= cart.length
    ) return;

    const item = cart[index];

    cart.splice(index, 1);

    renderCart();

    showToast(
      "Removed",
      `${item.name} was removed from your cart.`
    );

  };


  /* =======================================================
     CHANGE QUANTITY
  ======================================================= */

  const changeQuantity = (
    index,
    amount
  ) => {

    if (
      index < 0 ||
      index >= cart.length
    ) return;

    cart[index].quantity += amount;

    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }

    renderCart();

  };


  /* =======================================================
     CART TOTAL
  ======================================================= */

  const getCartTotal = () => {

    return cart.reduce(
      (total, item) => {

        return total +
          item.price * item.quantity;

      },
      0
    );

  };


  /* =======================================================
     CART COUNT
  ======================================================= */

  const updateCartCount = () => {

    const count =
      cart.reduce(
        (total, item) =>
          total + item.quantity,
        0
      );

    $$("[data-cart-count]").forEach(
      element => {
        element.textContent = count;
      }
    );

  };


  /* =======================================================
     RENDER CART
  ======================================================= */

  const renderCart = () => {

    if (!cartItemsContainer) return;

    updateCartCount();

    if (cart.length === 0) {

      cartItemsContainer.innerHTML = `

        <div class="empty-cart">

          <div class="empty-cart-icon">
            🛒
          </div>

          <h3>Your cart is empty</h3>

          <p>
            Add something delicious from
            our menu and your order will
            appear here.
          </p>

          <button
            class="outline-btn"
            type="button"
            data-cart-browse
          >
            Browse Menu
          </button>

        </div>

      `;

      if (cartTotalElement) {
        cartTotalElement.textContent =
          formatPrice(0);
      }

      const browseButton =
        $("[data-cart-browse]");

      if (browseButton) {

        browseButton.addEventListener(
          "click",
          () => {

            closeCart();

            document
              .querySelector("#menu")
              ?.scrollIntoView({
                behavior: "smooth"
              });

          }
        );

      }

      return;
    }


    cartItemsContainer.innerHTML =
      cart.map((item, index) => `

        <div class="cart-item">

          <div class="cart-item-icon">
            ${item.emoji}
          </div>

          <div class="cart-item-info">

            <strong>
              ${escapeHTML(item.name)}
            </strong>

            <small>
              ${formatPrice(item.price)}
            </small>

            <div class="cart-quantity">

              <button
                class="quantity-btn"
                type="button"
                data-minus="${index}"
                aria-label="Decrease quantity"
              >
                −
              </button>

              <span class="quantity-value">
                ${item.quantity}
              </span>

              <button
                class="quantity-btn"
                type="button"
                data-plus="${index}"
                aria-label="Increase quantity"
              >
                +
              </button>

            </div>

          </div>

          <div>

            <div class="cart-item-price">
              ${formatPrice(
                item.price * item.quantity
              )}
            </div>

            <button
              type="button"
              data-remove="${index}"
              style="
                border:0;
                background:transparent;
                color:#77746d;
                font-size:9px;
                margin-top:7px;
                cursor:pointer;
              "
            >
              Remove
            </button>

          </div>

        </div>

      `).join("");


    const total = getCartTotal();

    if (cartTotalElement) {
      cartTotalElement.textContent =
        formatPrice(total);
    }


    $$("[data-minus]", cartItemsContainer)
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            changeQuantity(
              Number(button.dataset.minus),
              -1
            );

          }
        );

      });


    $$("[data-plus]", cartItemsContainer)
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            changeQuantity(
              Number(button.dataset.plus),
              1
            );

          }
        );

      });


    $$("[data-remove]", cartItemsContainer)
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            removeFromCart(
              Number(button.dataset.remove)
            );

          }
        );

      });

  };


  /* =======================================================
     ESCAPE HTML
  ======================================================= */

  function escapeHTML(value) {

    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  }


  /* =======================================================
     CHECKOUT MODAL
  ======================================================= */

  const checkoutOverlay =
    $(".checkout-overlay") ||
    $("[data-checkout-modal]");

  const checkoutModal =
    $(".checkout-modal");

  const openCheckoutButtons =
    $$("[data-checkout-open]");

  const closeCheckoutButtons =
    $$("[data-checkout-close]");


  const openCheckout = () => {

    if (cart.length === 0) {

      showToast(
        "Your cart is empty",
        "Please add an item first."
      );

      return;

    }

    closeCart();

    if (checkoutOverlay) {

      checkoutOverlay.classList.add("active");

    }

    document.body.classList.add("no-scroll");

    renderCheckoutSummary();

  };


  const closeCheckout = () => {

    if (checkoutOverlay) {

      checkoutOverlay.classList.remove("active");

    }

    document.body.classList.remove("no-scroll");

  };


  openCheckoutButtons.forEach(button => {

    button.addEventListener(
      "click",
      openCheckout
    );

  });


  closeCheckoutButtons.forEach(button => {

    button.addEventListener(
      "click",
      closeCheckout
    );

  });


  if (checkoutOverlay) {

    checkoutOverlay.addEventListener(
      "click",
      event => {

        if (
          event.target === checkoutOverlay
        ) {

          closeCheckout();

        }

      }
    );

  }


  /* =======================================================
     CHECKOUT SUMMARY
  ======================================================= */

  const renderCheckoutSummary = () => {

    const summary =
      $("[data-checkout-summary]") ||
      $(".checkout-summary");

    if (!summary) return;

    const rows =
      cart.map(item => `

        <div class="full-menu-row">

          <span>
            ${escapeHTML(item.name)}
            × ${item.quantity}
          </span>

          <strong>
            ${formatPrice(
              item.price * item.quantity
            )}
          </strong>

        </div>

      `).join("");


    const total = getCartTotal();


    const list =
      $("[data-summary-items]", summary);

    if (list) {

      list.innerHTML = rows;

    } else {

      const existingRows =
        $(".summary-items", summary);

      if (existingRows) {
        existingRows.innerHTML = rows;
      }

    }


    $$("[data-summary-total]")
      .forEach(element => {

        element.textContent =
          formatPrice(total);

      });

  };


  /* =======================================================
     CLEAR CART
  ======================================================= */

  $$("[data-clear-cart]").forEach(button => {

    button.addEventListener(
      "click",
      () => {

        cart = [];

        renderCart();

        renderCheckoutSummary();

        showToast(
          "Cart cleared",
          "All items have been removed."
        );

      }
    );

  });


  /* =======================================================
     CHECKOUT FORM
  ======================================================= */

  const checkoutForm =
    $("#checkoutForm");

  if (checkoutForm) {

    checkoutForm.addEventListener(
      "submit",
      event => {

        event.preventDefault();

        if (cart.length === 0) {

          showToast(
            "Cart is empty",
            "Please add an item first."
          );

          return;

        }


        const formData =
          new FormData(checkoutForm);


        const name =
          formData.get("name") ||
          formData.get("customerName") ||
          "";

        const phone =
          formData.get("phone") ||
          formData.get("customerPhone") ||
          "";

        const address =
          formData.get("address") ||
          "";

        const notes =
          formData.get("notes") ||
          "";

        const orderType =
          formData.get("orderType") ||
          formData.get("deliveryType") ||
          "Delivery";


        if (!name.trim()) {

          showToast(
            "Name required",
            "Please enter your name."
          );

          return;

        }


        if (!phone.trim()) {

          showToast(
            "Phone required",
            "Please enter your phone number."
          );

          return;

        }


        if (
          orderType.toLowerCase()
            .includes("delivery") &&
          !address.trim()
        ) {

          showToast(
            "Address required",
            "Please enter your delivery address."
          );

          return;

        }


        const message =
          createWhatsAppOrder({
            name,
            phone,
            address,
            notes,
            orderType
          });


        const whatsappURL =
          `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;


        window.open(
          whatsappURL,
          "_blank",
          "noopener,noreferrer"
        );


        showToast(
          "Order ready",
          "Opening WhatsApp..."
        );

      }
    );

  }


  /* =======================================================
     CREATE WHATSAPP ORDER
  ======================================================= */

  const createWhatsAppOrder = ({
    name,
    phone,
    address,
    notes,
    orderType
  }) => {

    const lines = [];

    lines.push(
      `Hello ${CAFE_NAME}!`
    );

    lines.push(
      `I would like to place an order.`
    );

    lines.push("");

    lines.push(
      `*Customer Details*`
    );

    lines.push(
      `Name: ${name}`
    );

    lines.push(
      `Phone: ${phone}`
    );

    lines.push(
      `Order Type: ${orderType}`
    );

    if (address.trim()) {

      lines.push(
        `Address: ${address}`
      );

    }

    lines.push("");

    lines.push(
      `*Order Details*`
    );


    cart.forEach((item, index) => {

      lines.push(
        `${index + 1}. ${item.name} × ${item.quantity} — ${formatPrice(
          item.price * item.quantity
        )}`
      );

    });


    lines.push("");

    lines.push(
      `*Total: ${formatPrice(getCartTotal())}*`
    );


    if (notes.trim()) {

      lines.push("");

      lines.push(
        `Notes: ${notes}`
      );

    }


    lines.push("");

    lines.push(
      `Cafe: ${CAFE_NAME}`
    );

    lines.push(
      `Location: ${CAFE_ADDRESS}`
    );


    return lines.join("\n");

  };


  /* =======================================================
     DIRECT WHATSAPP ORDER BUTTONS
  ======================================================= */

  $$("[data-whatsapp]").forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const message =
          button.dataset.message ||
          `Hello ${CAFE_NAME}! I would like to know more about your menu.`;

        const url =
          `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

        window.open(
          url,
          "_blank",
          "noopener,noreferrer"
        );

      }
    );

  });


  /* =======================================================
     MENU MODAL
  ======================================================= */

  const menuModalOverlay =
    $(".menu-modal-overlay") ||
    $("[data-menu-modal]");

  const openMenuButtons =
    $$("[data-menu-open]");

  const closeMenuButtons =
    $$("[data-menu-close]");


  const openMenuModal = () => {

    if (!menuModalOverlay) return;

    menuModalOverlay.classList.add("active");

    document.body.classList.add("no-scroll");

  };


  const closeMenuModal = () => {

    if (!menuModalOverlay) return;

    menuModalOverlay.classList.remove("active");

    document.body.classList.remove("no-scroll");

  };


  openMenuButtons.forEach(button => {

    button.addEventListener(
      "click",
      openMenuModal
    );

  });


  closeMenuButtons.forEach(button => {

    button.addEventListener(
      "click",
      closeMenuModal
    );

  });


  if (menuModalOverlay) {

    menuModalOverlay.addEventListener(
      "click",
      event => {

        if (
          event.target === menuModalOverlay
        ) {

          closeMenuModal();

        }

      }
    );

  }


  /* =======================================================
     SMOOTH ANCHOR LINKS
  ======================================================= */

  $$('a[href^="#"]').forEach(link => {

    link.addEventListener(
      "click",
      event => {

        const id =
          link.getAttribute("href");

        if (
          !id ||
          id === "#" ||
          id.length < 2
        ) return;


        const target =
          document.querySelector(id);

        if (!target) return;


        event.preventDefault();

        closeMobileMenu();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }
    );

  });


  /* =======================================================
     KEYBOARD CONTROLS
  ======================================================= */

  document.addEventListener(
    "keydown",
    event => {

      if (event.key !== "Escape") return;

      closeMobileMenu();
      closeCart();
      closeCheckout();
      closeMenuModal();

    }
  );


  /* =======================================================
     TOAST
  ======================================================= */

  let toastTimer = null;


  window.showToast = (
    title,
    message
  ) => {

    const toast =
      $(".toast");

    if (!toast) return;


    const titleElement =
      $(".toast strong", toast);

    const messageElement =
      $(".toast p", toast);


    if (titleElement) {
      titleElement.textContent = title;
    }

    if (messageElement) {
      messageElement.textContent = message;
    }


    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer =
      setTimeout(() => {

        toast.classList.remove("show");

      }, 3200);

  };


  /* =======================================================
     HERO PARALLAX
  ======================================================= */

  const heroVisual =
    $(".hero-visual");

  if (
    heroVisual &&
    window.matchMedia(
      "(min-width: 851px)"
    ).matches
  ) {

    window.addEventListener(
      "mousemove",
      event => {

        const x =
          (event.clientX /
            window.innerWidth -
            0.5) * 10;

        const y =
          (event.clientY /
            window.innerHeight -
            0.5) * 10;


        heroVisual.style.transform =
          `translate(${x}px, ${y}px)`;

      },
      { passive: true }
    );

  }


  /* =======================================================
     BUTTON RIPPLE
  ======================================================= */

  $$(
    ".primary-btn, .secondary-btn, .outline-btn"
  ).forEach(button => {

    button.addEventListener(
      "click",
      event => {

        const rect =
          button.getBoundingClientRect();

        const ripple =
          document.createElement("span");

        ripple.style.position =
          "absolute";

        ripple.style.left =
          `${event.clientX - rect.left}px`;

        ripple.style.top =
          `${event.clientY - rect.top}px`;

        ripple.style.width =
          "8px";

        ripple.style.height =
          "8px";

        ripple.style.borderRadius =
          "50%";

        ripple.style.background =
          "rgba(255,255,255,0.25)";

        ripple.style.transform =
          "translate(-50%, -50%) scale(0)";

        ripple.style.pointerEvents =
          "none";

        ripple.style.transition =
          "transform .55s ease, opacity .55s ease";

        button.style.position =
          "relative";

        button.style.overflow =
          "hidden";

        button.appendChild(ripple);


        requestAnimationFrame(() => {

          ripple.style.transform =
            "translate(-50%, -50%) scale(25)";

          ripple.style.opacity =
            "0";

        });


        setTimeout(() => {

          ripple.remove();

        }, 600);

      }
    );

  });


  /* =======================================================
     COUNTER ANIMATION
  ======================================================= */

  const counters =
    $$("[data-counter]");


  if (
    counters.length &&
    "IntersectionObserver" in window
  ) {

    const counterObserver =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            if (!entry.isIntersecting)
              return;


            const element =
              entry.target;

            const target =
              Number(
                element.dataset.counter
              );


            if (
              Number.isNaN(target)
            ) return;


            let start = 0;

            const duration = 1000;

            const startTime =
              performance.now();


            const animate =
              currentTime => {

                const progress =
                  Math.min(
                    (currentTime - startTime) /
                    duration,
                    1
                  );


                const eased =
                  1 -
                  Math.pow(
                    1 - progress,
                    3
                  );


                const value =
                  Math.floor(
                    start +
                    (target - start) *
                    eased
                  );


                element.textContent =
                  value;


                if (progress < 1) {

                  requestAnimationFrame(
                    animate
                  );

                }

              };


            requestAnimationFrame(
              animate
            );


            counterObserver.unobserve(
              element
            );

          });

        },
        {
          threshold: 0.7
        }
      );


    counters.forEach(counter => {

      counterObserver.observe(counter);

    });

  }


  /* =======================================================
     ORDER TYPE → ADDRESS
  ======================================================= */

  const orderTypeInputs =
    $$(
      'input[name="orderType"], input[name="deliveryType"]'
    );

  const addressGroup =
    $(
      '[data-address-group]'
    ) ||
    $(
      '#addressGroup'
    );


  const updateAddressVisibility = () => {

    if (
      !addressGroup ||
      orderTypeInputs.length === 0
    ) return;


    const selected =
      orderTypeInputs.find(
        input => input.checked
      );


    if (!selected) return;


    const value =
      selected.value.toLowerCase();


    const isDelivery =
      value.includes("delivery");


    addressGroup.style.display =
      isDelivery
        ? ""
        : "none";


    const input =
      $("input, textarea", addressGroup);


    if (input) {

      input.required =
        isDelivery;

    }

  };


  orderTypeInputs.forEach(input => {

    input.addEventListener(
      "change",
      updateAddressVisibility
    );

  });


  updateAddressVisibility();


  /* =======================================================
     MENU ITEM HOVER
  ======================================================= */

  $$(".food-card").forEach(card => {

    card.addEventListener(
      "mouseenter",
      () => {

        card.style.setProperty(
          "--mouse-x",
          "50%"
        );

        card.style.setProperty(
          "--mouse-y",
          "50%"
        );

      }
    );

  });


  /* =======================================================
     INITIALIZE
  ======================================================= */

  renderCart();

  updateActiveNav();

  updateAddressVisibility();


  console.log(
    `${CAFE_NAME} website initialized successfully.`
  );

});
