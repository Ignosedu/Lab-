/* ==========================================================================
   QHOF - MAIN & GLOBAL SCRIPT (Slider, Cart, Notifications, Token Auth & Game Creation)
   ========================================================================== */

const ALL_GAMES = {
  'pol': { id: 'pol', title: 'Planet of Lana', price: 19.99, image: 'assets/images/pol.png', tags: ['Adventure', 'Puzzle', 'Platformer'] },
  'spider': { id: 'spider', title: "Spider-Man: Miles Morales", price: 49.99, image: 'assets/images/spider.png', tags: ['Action', 'Adventure'] },
  'forza': { id: 'forza', title: 'Forza Horizon 5', price: 59.99, image: 'assets/images/forza.png', tags: ['Racing', 'Open World'] },
  'litn': { id: 'litn', title: 'Little Nightmares II', price: 29.99, image: 'assets/images/litn.png', tags: ['Adventure', 'Puzzle', 'Horror'] },
  'unravel': { id: 'unravel', title: 'Unravel', price: 19.99, image: 'assets/images/unravel.png', tags: ['Platformer', 'Puzzle'] },
  'stray': { id: 'stray', title: 'Stray', price: 29.99, image: 'assets/images/stray.png', tags: ['Adventure', 'Cat'] }
};

// Відновлюємо токен із localStorage при завантаженні сторінки
let token = localStorage.getItem('qhof_token') || "";

class QHOFApp {
  constructor() {
    this.cart = JSON.parse(localStorage.getItem('qhof_cart')) || [];
    this.notifications = [
      { id: 1, type: 'discount', icon: 'fa-percent', title: 'Special Discount 🔥', text: 'Spider-Man: Miles Morales is 20% OFF this week!', time: '10m ago', unread: true },
      { id: 2, type: 'social', icon: 'fa-user-plus', title: 'Friend Request 💬', text: 'Alex_Gamer99 sent you a friend request.', time: '1h ago', unread: true },
      { id: 3, type: 'achievement', icon: 'fa-trophy', title: 'New Achievement 🏆', text: 'You unlocked "Silent Explorer" in Planet of Lana!', time: '3h ago', unread: true }
    ];

    this.currentSlide = 0;
    this.slides = Object.values(ALL_GAMES);

    this.initDrawers();
    this.bindEvents();
    this.initSlider();
    this.fixSidebarLinks();
    this.updateAuthUI();
  }

  // Створення DOM-структури Кошика та Дзвіночка
  initDrawers() {
    if (!document.getElementById('cartDrawer')) {
      const cartHTML = `
        <div class="cart-drawer-overlay" id="cartOverlay"></div>
        <aside class="cart-drawer" id="cartDrawer">
          <div class="cart-drawer-header">
            <h3><i class="fa-solid fa-cart-shopping"></i> Shopping Cart</h3>
            <button class="cart-close-btn" id="closeCartBtn">&times;</button>
          </div>
          <div class="cart-items-list" id="cartItemsList"></div>
          <div class="cart-drawer-footer">
            <div class="cart-total-row">
              <span>Total:</span>
              <span class="cart-total-price" id="cartTotalPrice">$0.00</span>
            </div>
            <button class="btn-checkout" onclick="alert('Proceeding to checkout!')">
              Checkout <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </aside>
      `;
      document.body.insertAdjacentHTML('beforeend', cartHTML);
    }

    if (!document.getElementById('notifDrawer')) {
      const notifHTML = `
        <div class="notif-drawer-overlay" id="notifOverlay"></div>
        <aside class="notif-drawer" id="notifDrawer">
          <div class="notif-drawer-header">
            <h3><i class="fa-solid fa-bell"></i> Notifications & News</h3>
            <button class="notif-close-btn" id="closeNotifBtn">&times;</button>
          </div>
          <div class="notif-actions-bar">
            <button id="markAllReadBtn" class="btn-text-action">Mark all as read</button>
            <button id="clearNotifsBtn" class="btn-text-action danger">Clear all</button>
          </div>
          <div class="notif-items-list" id="notifItemsList"></div>
        </aside>
      `;
      document.body.insertAdjacentHTML('beforeend', notifHTML);
    }

    this.renderCartItems();
    this.renderNotifications();
    this.updateBadges();
  }

  // Оновлення стану кнопок авторизації та додавання гри
  updateAuthUI() {
    const openAuthBtn = document.getElementById('openAuthModalBtn');
    const openAddGameBtn = document.getElementById('openAddGameModalBtn');

    if (token) {
      if (openAuthBtn) {
        openAuthBtn.innerHTML = `<i class="fa-solid fa-right-from-bracket"></i> <span>Sign Out</span>`;
        openAuthBtn.onclick = (e) => {
          e.preventDefault();
          signOut();
        };
      }
      if (openAddGameBtn) {
        openAddGameBtn.style.display = 'inline-flex';
      }
    } else {
      if (openAuthBtn) {
        openAuthBtn.innerHTML = `<i class="fa-solid fa-right-to-bracket"></i> <span>Sign In</span>`;
        openAuthBtn.onclick = (e) => {
          e.preventDefault();
          const authModal = document.getElementById('authModal');
          if (authModal) authModal.classList.add('active');
        };
      }
      if (openAddGameBtn) {
        openAddGameBtn.style.display = 'none';
      }
    }
  }

  bindEvents() {
    // Модальне вікно входу
    const authModal = document.getElementById('authModal');
    const closeAuthBtn = document.getElementById('closeAuthModalBtn');

    if (closeAuthBtn && authModal) {
      closeAuthBtn.onclick = () => authModal.classList.remove('active');
    }
    if (authModal) {
      authModal.onclick = (e) => { if (e.target === authModal) authModal.classList.remove('active'); };
    }

    // Модальне вікно додавання гри
    const addGameModal = document.getElementById('addGameModal');
    const openAddGameBtn = document.getElementById('openAddGameModalBtn');
    const closeAddGameBtn = document.getElementById('closeAddGameModalBtn');

    if (openAddGameBtn && addGameModal) {
      openAddGameBtn.onclick = (e) => {
        e.preventDefault();
        if (!token) {
          alert('Будь ласка, увійдіть у свій акаунт, щоб мати можливість додавати ігри!');
          if (authModal) authModal.classList.add('active');
          return;
        }
        addGameModal.classList.add('active');
      };
    }
    if (closeAddGameBtn && addGameModal) {
      closeAddGameBtn.onclick = () => addGameModal.classList.remove('active');
    }
    if (addGameModal) {
      addGameModal.onclick = (e) => { if (e.target === addGameModal) addGameModal.classList.remove('active'); };
    }

    // Клік на аватар
    document.querySelectorAll('.user-avatar').forEach(avatar => {
      avatar.style.cursor = 'pointer';
      avatar.title = 'View Profile';
      avatar.onclick = () => window.location.href = 'profile.html';
    });

    // Кошик
    document.querySelectorAll('.action-btn[aria-label="Cart"]').forEach(btn => {
      btn.style.position = 'relative';
      btn.innerHTML = `<i class="fa-solid fa-cart-shopping"></i><span class="cart-badge">0</span>`;
      btn.onclick = (e) => {
        e.preventDefault();
        this.toggleCart();
      };
    });

    const closeCartBtn = document.getElementById('closeCartBtn');
    const cartOverlay = document.getElementById('cartOverlay');
    if (closeCartBtn) closeCartBtn.onclick = () => this.closeCart();
    if (cartOverlay) cartOverlay.onclick = () => this.closeCart();

    // Дзвіночок
    document.querySelectorAll('.action-btn[aria-label="Notifications"]').forEach(btn => {
      btn.style.position = 'relative';
      btn.innerHTML = `<i class="fa-solid fa-bell"></i><span class="notif-badge">0</span>`;
      btn.onclick = (e) => {
        e.preventDefault();
        this.toggleNotif();
      };
    });

    const closeNotifBtn = document.getElementById('closeNotifBtn');
    const notifOverlay = document.getElementById('notifOverlay');
    if (closeNotifBtn) closeNotifBtn.onclick = () => this.closeNotif();
    if (notifOverlay) notifOverlay.onclick = () => this.closeNotif();

    const markReadBtn = document.getElementById('markAllReadBtn');
    const clearNotifsBtn = document.getElementById('clearNotifsBtn');
    if (markReadBtn) {
      markReadBtn.onclick = () => {
        this.notifications.forEach(n => n.unread = false);
        this.renderNotifications();
        this.updateBadges();
      };
    }
    if (clearNotifsBtn) {
      clearNotifsBtn.onclick = () => {
        this.notifications = [];
        this.renderNotifications();
        this.updateBadges();
      };
    }

    // Сайдбар
    const sidebar = document.getElementById('sidebar');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const closeSidebarBtn = document.getElementById('closeSidebarBtn');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    if (mobileMenuToggle && sidebar) {
      mobileMenuToggle.onclick = () => {
        sidebar.classList.add('active');
        if (sidebarOverlay) sidebarOverlay.classList.add('active');
      };
    }

    const closeNav = () => {
      if (sidebar) sidebar.classList.remove('active');
      if (sidebarOverlay) sidebarOverlay.classList.remove('active');
    };

    if (closeSidebarBtn) closeSidebarBtn.onclick = closeNav;
    if (sidebarOverlay) sidebarOverlay.onclick = closeNav;
  }

  fixSidebarLinks() {
    const pageLinks = {
      'home': 'index.html',
      'library': 'library.html',
      'store': 'store.html',
      'wishlist': 'wishlist.html',
      'bootstrap': 'bootstrap.html'
    };

    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
      const text = link.textContent.trim().toLowerCase();
      for (const [key, url] of Object.entries(pageLinks)) {
        if (text.includes(key)) {
          link.setAttribute('href', url);
          break;
        }
      }
    });
  }

  initSlider() {
    const heroCard = document.getElementById('heroCard');
    if (!heroCard) return;

    const heroTitle = document.getElementById('heroTitle');
    const heroTags = document.getElementById('heroTags');
    const heroPrice = document.getElementById('heroPrice');
    const prevBtn = document.getElementById('heroPrevBtn');
    const nextBtn = document.getElementById('heroNextBtn');
    const dots = document.querySelectorAll('#dotsNav .dot');

    const updateSlide = (idx) => {
      this.currentSlide = idx;
      const game = this.slides[this.currentSlide];

      document.body.style.backgroundImage = `url('${game.image}')`;
      heroCard.style.backgroundImage = `url('${game.image}')`;
      heroCard.setAttribute('data-id', game.id);

      if (heroTitle) heroTitle.textContent = game.title;
      if (heroPrice) heroPrice.textContent = `$${game.price}`;
      if (heroTags && game.tags) {
        heroTags.innerHTML = game.tags.map(t => `<span class="tag">${t}</span>`).join('');
      }

      dots.forEach((dot, i) => dot.classList.toggle('active', i === this.currentSlide));
    };

    heroCard.onclick = (e) => {
      if (e.target.closest('.carousel-control')) return;
      const gameId = heroCard.getAttribute('data-id') || 'pol';
      window.location.href = `game.html?id=${gameId}`;
    };

    if (prevBtn) {
      prevBtn.onclick = (e) => {
        e.stopPropagation();
        const prev = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        updateSlide(prev);
      };
    }

    if (nextBtn) {
      nextBtn.onclick = (e) => {
        e.stopPropagation();
        const next = (this.currentSlide + 1) % this.slides.length;
        updateSlide(next);
      };
    }

    dots.forEach(dot => {
      dot.onclick = (e) => {
        const idx = parseInt(e.target.getAttribute('data-index'), 10);
        if (!isNaN(idx)) updateSlide(idx);
      };
    });
  }

  toggleCart() {
    document.getElementById('cartDrawer').classList.toggle('active');
    document.getElementById('cartOverlay').classList.toggle('active');
  }

  closeCart() {
    document.getElementById('cartDrawer').classList.remove('active');
    document.getElementById('cartOverlay').classList.remove('active');
  }

  addItem(gameId) {
    const game = ALL_GAMES[gameId];
    if (!game) return;

    const existing = this.cart.find(item => item.id === gameId);
    if (existing) existing.quantity += 1;
    else this.cart.push({ ...game, quantity: 1 });

    this.saveCart();
    this.toggleCart();
  }

  removeItem(gameId) {
    this.cart = this.cart.filter(item => item.id !== gameId);
    this.saveCart();
  }

  changeQuantity(gameId, delta) {
    const item = this.cart.find(i => i.id === gameId);
    if (item) {
      item.quantity += delta;
      if (item.quantity <= 0) this.removeItem(gameId);
      else this.saveCart();
    }
  }

  saveCart() {
    localStorage.setItem('qhof_cart', JSON.stringify(this.cart));
    this.updateBadges();
    this.renderCartItems();
  }

  renderCartItems() {
    const list = document.getElementById('cartItemsList');
    const totalEl = document.getElementById('cartTotalPrice');
    if (!list) return;

    if (this.cart.length === 0) {
      list.innerHTML = `
        <div class="cart-empty-state">
          <i class="fa-solid fa-basket-shopping"></i>
          <p>Your cart is empty</p>
        </div>
      `;
      if (totalEl) totalEl.textContent = '$0.00';
      return;
    }

    list.innerHTML = this.cart.map(item => `
      <div class="cart-item-card">
        <img src="${item.image}" alt="${item.title}" class="cart-item-thumb">
        <div class="cart-item-details">
          <h4 class="cart-item-title">${item.title}</h4>
          <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
          <div class="cart-qty-controls">
            <button onclick="window.globalApp.changeQuantity('${item.id}', -1)">-</button>
            <span>${item.quantity}</span>
            <button onclick="window.globalApp.changeQuantity('${item.id}', 1)">+</button>
          </div>
        </div>
        <button class="cart-item-remove" onclick="window.globalApp.removeItem('${item.id}')"><i class="fa-solid fa-trash-can"></i></button>
      </div>
    `).join('');

    const total = this.cart.reduce((s, i) => s + (i.price * i.quantity), 0).toFixed(2);
    if (totalEl) totalEl.textContent = `$${total}`;
  }

  toggleNotif() {
    document.getElementById('notifDrawer').classList.toggle('active');
    document.getElementById('notifOverlay').classList.toggle('active');
  }

  closeNotif() {
    document.getElementById('notifDrawer').classList.remove('active');
    document.getElementById('notifOverlay').classList.remove('active');
  }

  renderNotifications() {
    const list = document.getElementById('notifItemsList');
    if (!list) return;

    if (this.notifications.length === 0) {
      list.innerHTML = `
        <div class="cart-empty-state">
          <i class="fa-solid fa-bell-slash"></i>
          <p>No notifications yet</p>
        </div>
      `;
      return;
    }

    list.innerHTML = this.notifications.map(n => `
      <div class="notif-card ${n.unread ? 'unread' : ''}">
        <div class="notif-icon"><i class="fa-solid ${n.icon}"></i></div>
        <div class="notif-content">
          <h4>${n.title}</h4>
          <p>${n.text}</p>
          <span class="notif-time">${n.time}</span>
        </div>
      </div>
    `).join('');
  }

  updateBadges() {
    const cartCount = this.cart.reduce((sum, i) => sum + i.quantity, 0);
    document.querySelectorAll('.cart-badge').forEach(b => {
      b.textContent = cartCount;
      b.style.display = cartCount > 0 ? 'flex' : 'none';
    });

    const unreadNotifs = this.notifications.filter(n => n.unread).length;
    document.querySelectorAll('.notif-badge').forEach(b => {
      b.textContent = unreadNotifs;
      b.style.display = unreadNotifs > 0 ? 'flex' : 'none';
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.globalApp = new QHOFApp();
  window.globalCart = window.globalApp;
});

// ==========================================================================
// ЛОГІКА АВТОРИЗАЦІЇ ЗА LOGIN ТА СТВОРЕННЯ ІГОР ЧЕРЕЗ ТОКЕН U LOCALSTORAGE
// ==========================================================================

async function signIn() {
  const userName = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('https://backend-for-students-production.up.railway.app/api/login', {
      method: 'POST',
      body: JSON.stringify({ username: userName, password: password }),
      headers: { 'Content-Type': 'application/json; charset=UTF-8' }
    });
    const responseText = await response.text();
    let result = {};

    if (responseText) {
      try {
        result = JSON.parse(responseText);
        if (result.token) {
          token = result.token;
          localStorage.setItem('qhof_token', token); // Зберігаємо токен у localStorage
        }
      } catch (e) {}
    }

    if (!response.ok) {
      throw new Error(result.message || `Sign-in failed (${response.status}).`);
    }

    alert('Signed in successfully! Token saved in localStorage.');
    const authModal = document.getElementById('authModal');
    if (authModal) authModal.classList.remove('active');
    
    if (window.globalApp) window.globalApp.updateAuthUI();
  } catch (error) {
    console.error('Sign-in failed:', error);
    alert(error instanceof Error ? error.message : 'Sign-in failed.');
  }
}

function signOut() {
  token = "";
  localStorage.removeItem('qhof_token'); // Видаляємо токен
  alert('You have been signed out.');
  if (window.globalApp) window.globalApp.updateAuthUI();
}

async function addNewGame(event) {
  event.preventDefault();

  if (!token) {
    alert('Помилка: Ви не авторизовані! Увійдіть у свій акаунт.');
    const authModal = document.getElementById('authModal');
    if (authModal) authModal.classList.add('active');
    return;
  }

  const name = document.getElementById('newGameName').value;
  const price = parseFloat(document.getElementById('newGamePrice').value);
  const description = document.getElementById('newGameDesc').value;
  const category = document.getElementById('newGameCategory').value || 'game';

  const data = { name, price, description, category };

  try {
    const response = await fetch('https://backend-for-students-production.up.railway.app/api/items', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${token}` // Передаємо токен
      }
    });

    const result = await response.json();

    if (response.ok) {
      alert(`Успішно додано нову гру: "${name}"!`);
      const addModal = document.getElementById('addGameModal');
      if (addModal) addModal.classList.remove('active');
      document.getElementById('addGameForm').reset();
    } else {
      alert('Помилка авторизації або додавання: ' + (result.message || response.statusText));
    }
  } catch (error) {
    console.error('Failed to add game:', error);
    alert('Помилка відправки запиту до сервера.');
  }
}