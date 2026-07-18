/* ============================================================
   MONO — A Study in Monochrome · main.js
   ============================================================ */
(() => {
  "use strict";

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const formatPrice = (n) => "€" + Number(n).toLocaleString("en-IE");

  /* ---------- Preloader ---------- */
  const preloader = $("#preloader");
  window.addEventListener("load", () => {
    setTimeout(() => {
      preloader.classList.add("is-done");
      document.body.classList.add("is-loaded");
    }, 900);
  });
  // Fallback in case load never fires (slow image CDN)
  setTimeout(() => {
    preloader.classList.add("is-done");
    document.body.classList.add("is-loaded");
  }, 4000);

  /* ---------- Custom cursor ---------- */
  const cursor = $("#cursor");
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.addEventListener("mousemove", (e) => {
      cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    });
    document.addEventListener("mouseover", (e) => {
      const view  = e.target.closest('[data-cursor="view"]');
      const hover = e.target.closest('[data-cursor="hover"], a, button');
      cursor.classList.toggle("is-view", !!view);
      cursor.classList.toggle("is-hover", !view && !!hover);
    });
  }

  /* ---------- Header hide-on-scroll ---------- */
  const header = $("#header");
  let lastY = 0;
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    header.classList.toggle("is-hidden", y > lastY && y > 320 && !menu.classList.contains("is-open"));
    lastY = y;
  }, { passive: true });

  /* ---------- Mobile menu ---------- */
  const burger = $("#burger");
  const menu   = $("#menu");
  const setMenu = (open) => {
    burger.classList.toggle("is-open", open);
    menu.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-hidden", String(!open));
    document.body.style.overflow = open ? "hidden" : "";
  };
  burger.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));
  $$(".menu__link").forEach((a) => a.addEventListener("click", () => setMenu(false)));

  /* ---------- Reveal on scroll ---------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach((el) => revealObserver.observe(el));

  /* ---------- Parallax media ---------- */
  const parallaxEls = $$("[data-parallax]");
  const heroMedia = $("#heroMedia");
  const parallax = () => {
    const vh = window.innerHeight;
    if (heroMedia) {
      heroMedia.style.transform = `translateY(${window.scrollY * 0.25}px)`;
    }
    parallaxEls.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > vh) return;
      const progress = (rect.top + rect.height / 2 - vh / 2) / vh; // -0.5..0.5-ish
      el.querySelector("img").style.transform = `scale(1.12) translateY(${progress * -6}%)`;
    });
  };
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.addEventListener("scroll", () => requestAnimationFrame(parallax), { passive: true });
    parallax();
  }

  /* ---------- Product filters ---------- */
  const filterBtns = $$(".filter");
  const cards = $$(".card");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => {
        b.classList.toggle("is-active", b === btn);
        b.setAttribute("aria-pressed", String(b === btn));
      });
      const value = btn.dataset.filter;
      cards.forEach((card) => {
        const show = value === "all" || card.dataset.category === value;
        card.classList.toggle("is-filtered", !show);
        if (show) card.classList.add("is-visible"); // skip re-reveal
      });
    });
  });

  /* ---------- Toast ---------- */
  const toast = $("#toast");
  let toastTimer;
  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
  };

  /* ---------- Cart ---------- */
  const CART_KEY = "mono-cart";
  const drawer = $("#drawer");
  const drawerBackdrop = $("#drawerBackdrop");
  const drawerItems = $("#drawerItems");
  const drawerTotal = $("#drawerTotal");
  const drawerCount = $("#drawerCount");
  const cartCount = $("#cartCount");

  let cart = [];
  try { cart = JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { cart = []; }

  const saveCart = () => localStorage.setItem(CART_KEY, JSON.stringify(cart));

  const renderCart = () => {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalSum = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

    cartCount.textContent = totalQty;
    drawerCount.textContent = `(${totalQty})`;
    drawerTotal.textContent = formatPrice(totalSum);

    if (!cart.length) {
      drawerItems.innerHTML = '<p class="drawer__empty">Your bag is empty — for now.</p>';
      return;
    }
    drawerItems.innerHTML = cart.map((item, i) => `
      <div class="bag-item">
        <img class="bag-item__img" src="${item.img}" alt="${item.name}" />
        <div>
          <p class="bag-item__name">${item.name}</p>
          <p class="bag-item__price">${formatPrice(item.price)}</p>
          <span class="bag-item__qty">
            <button data-qty="-1" data-index="${i}" aria-label="Decrease quantity">−</button>
            <span>${item.qty}</span>
            <button data-qty="1" data-index="${i}" aria-label="Increase quantity">+</button>
          </span>
        </div>
        <button class="bag-item__remove" data-remove="${i}">Remove</button>
      </div>
    `).join("");
  };

  drawerItems.addEventListener("click", (e) => {
    const qtyBtn = e.target.closest("[data-qty]");
    const removeBtn = e.target.closest("[data-remove]");
    if (qtyBtn) {
      const item = cart[+qtyBtn.dataset.index];
      item.qty += +qtyBtn.dataset.qty;
      if (item.qty <= 0) cart.splice(+qtyBtn.dataset.index, 1);
    } else if (removeBtn) {
      cart.splice(+removeBtn.dataset.remove, 1);
    } else return;
    saveCart();
    renderCart();
  });

  const addToCart = ({ name, price, img }) => {
    const existing = cart.find((item) => item.name === name);
    if (existing) existing.qty += 1;
    else cart.push({ name, price: +price, img, qty: 1 });
    saveCart();
    renderCart();
    cartCount.classList.remove("bump");
    void cartCount.offsetWidth;
    cartCount.classList.add("bump");
    showToast(`${name} — added to your bag`);
  };

  const setDrawer = (open) => {
    drawer.classList.toggle("is-open", open);
    drawer.setAttribute("aria-hidden", String(!open));
    drawerBackdrop.hidden = !open;
    requestAnimationFrame(() => drawerBackdrop.classList.toggle("is-open", open));
    document.body.style.overflow = open ? "hidden" : "";
  };
  $("#cartBtn").addEventListener("click", () => setDrawer(true));
  $("#drawerClose").addEventListener("click", () => setDrawer(false));
  drawerBackdrop.addEventListener("click", () => setDrawer(false));
  $("#checkoutBtn").addEventListener("click", () => {
    showToast(cart.length ? "This is a demo — no checkout, only style" : "Your bag is empty");
  });

  renderCart();

  /* ---------- Quick view modal ---------- */
  const modal = $("#modal");
  let modalProduct = null;

  const openModal = (card) => {
    modalProduct = {
      name: card.dataset.name,
      price: card.dataset.price,
      img: card.dataset.img,
    };
    $("#modalImg").src = modalProduct.img;
    $("#modalImg").alt = modalProduct.name;
    $("#modalName").textContent = modalProduct.name;
    $("#modalCat").textContent = card.querySelector(".card__meta").textContent;
    $("#modalPrice").textContent = formatPrice(modalProduct.price);
    $("#modalDesc").textContent = card.dataset.desc;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    $("#modalClose").focus();
  };
  const closeModal = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  $("#modalClose").addEventListener("click", closeModal);
  $("#modalBackdrop").addEventListener("click", closeModal);
  $("#modalAdd").addEventListener("click", () => {
    if (modalProduct) addToCart(modalProduct);
    closeModal();
  });
  $$(".size").forEach((btn) => btn.addEventListener("click", () => {
    $$(".size").forEach((b) => b.classList.toggle("is-active", b === btn));
  }));

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    closeModal();
    setDrawer(false);
    setMenu(false);
  });

  /* ---------- Card actions ---------- */
  $("#productGrid").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const card = btn.closest(".card");
    if (btn.dataset.action === "add") {
      addToCart({ name: card.dataset.name, price: card.dataset.price, img: card.dataset.img });
    } else {
      openModal(card);
    }
  });

  /* ---------- Lookbook drag scroll ---------- */
  const strip = $("#strip");
  let isDown = false, startX = 0, startScroll = 0, moved = false;
  strip.addEventListener("pointerdown", (e) => {
    isDown = true; moved = false;
    startX = e.clientX;
    startScroll = strip.scrollLeft;
    strip.setPointerCapture(e.pointerId);
  });
  strip.addEventListener("pointermove", (e) => {
    if (!isDown) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 5) {
      moved = true;
      strip.classList.add("is-dragging");
    }
    strip.scrollLeft = startScroll - dx;
  });
  const endDrag = () => {
    isDown = false;
    strip.classList.remove("is-dragging");
  };
  strip.addEventListener("pointerup", endDrag);
  strip.addEventListener("pointercancel", endDrag);

  /* ---------- Newsletter ---------- */
  const newsForm = $("#newsForm");
  const newsMsg = $("#newsMsg");
  newsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = $("#newsEmail").value.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    newsMsg.classList.toggle("is-error", !valid);
    if (!valid) {
      newsMsg.textContent = "Please enter a valid email address";
      return;
    }
    newsMsg.textContent = "Welcome to the maison — check your inbox";
    newsForm.reset();
  });

  /* ---------- Footer year ---------- */
  $("#year").textContent = new Date().getFullYear();
})();
