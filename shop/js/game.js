document.addEventListener('DOMContentLoaded', () => {
  // Перевірка: якщо ми НЕ на сторінці деталізації гри — зупиняємо виконання
  const gameHero = document.getElementById('gameHero');
  if (!gameHero) return;

  const gamesDatabase = {
    'pol': {
      title: 'Planet of Lana',
      price: '\$19.99',
      tags: ['Adventure', 'Puzzle', 'Platformer'],
      image: 'assets/images/pol.png',
      developer: 'Wishfully',
      publisher: 'Thunderful Publishing',
      releaseDate: 'May 23, 2023',
      rating: '⭐ 4.9 / 5.0',
      description: 'Planet of Lana is a cinematic puzzle adventure story framed by an epic sci-fi saga. A young girl and her loyal companion embark on a rescue mission through a colorful world full of cold machines and unfamiliar creatures.',
      reviews: [
        { name: 'Alex_Gamer99', rating: 5, text: 'Incredible visuals, breathtaking music, and emotional storytelling. Must play!' },
        { name: 'Sophia_Sky', rating: 5, text: 'A gorgeous puzzle platformer with wonderful atmospheres and companion mechanics.' }
      ]
    },
    'spider': {
      title: "Spider-Man: Miles Morales",
      price: '\$49.99',
      tags: ['Action', 'Adventure', 'Open World'],
      image: 'assets/images/spider.png',
      developer: 'Insomniac Games',
      publisher: 'PlayStation PC LLC',
      releaseDate: 'Nov 18, 2022',
      rating: '⭐ 4.8 / 5.0',
      description: 'Experience the rise of Miles Morales as the new hero masters incredible, explosive new powers to become his own Spider-Man.',
      reviews: [
        { name: 'WebSlinger_21', rating: 5, text: 'Ray tracing and 60fps on PC look mind-blowing. Web-swinging feels incredible!' },
        { name: 'ShadowNinja', rating: 4, text: 'Great storyline and bio-electric venom attacks are super fun to use.' }
      ]
    },
    'forza': {
      title: 'Forza Horizon 5',
      price: '\$59.99',
      tags: ['Racing', 'Open World', 'Driving'],
      image: 'assets/images/forza.png',
      developer: 'Playground Games',
      publisher: 'Xbox Game Studios',
      releaseDate: 'Nov 9, 2021',
      rating: '⭐ 4.9 / 5.0',
      description: 'Your Ultimate Horizon Adventure awaits! Explore the vibrant landscapes of Mexico in hundreds of world class cars.',
      reviews: [
        { name: 'SpeedDemon_UK', rating: 5, text: 'The best open-world racing game ever created. Graphics are photorealistic!' },
        { name: 'V8_Turbine', rating: 5, text: 'Enormous car roster, dynamic seasons, and seamless multiplayer.' }
      ]
    },
    'litn': {
      title: 'Little Nightmares II',
      price: '\$29.99',
      tags: ['Adventure', 'Puzzle', 'Horror'],
      image: 'assets/images/litn.png',
      developer: 'Tarsier Studios',
      publisher: 'Bandai Namco Entertainment',
      releaseDate: 'Feb 11, 2021',
      rating: '⭐ 4.7 / 5.0',
      description: 'Return to a world of charming horror in Little Nightmares II as Mono, a young boy trapped in a distorted world.',
      reviews: [
        { name: 'CyberDoge', rating: 5, text: 'Terrifying, creative, and atmosphere is 10/10.' }
      ]
    },
    'unravel': {
      title: 'Unravel',
      price: '\$19.99',
      tags: ['Platformer', 'Puzzle'],
      image: 'assets/images/unravel.png',
      developer: 'Coldwood Interactive',
      publisher: 'Electronic Arts',
      releaseDate: 'Feb 9, 2016',
      rating: '⭐ 4.6 / 5.0',
      description: 'Unravel introduces Yarny, a character made from a single thread of yarn in a physics-based puzzle platformer.',
      reviews: [
        { name: 'YarnLover', rating: 5, text: 'Touching story, adorable character, and wholesome physics puzzles.' }
      ]
    },
    'stray': {
      title: 'Stray',
      price: '\$29.99',
      tags: ['Adventure', 'Third-Person', 'Cat'],
      image: 'assets/images/stray.png',
      developer: 'BlueTwelve Studio',
      publisher: 'Annapurna Interactive',
      releaseDate: 'Jul 19, 2022',
      rating: '⭐ 4.9 / 5.0',
      description: 'Lost, alone and separated from family, a stray cat must untangle an ancient mystery to escape a long-forgotten cybercity.',
      reviews: [
        { name: 'CatPerson_Meow', rating: 5, text: 'Meow button is legendary! Beautiful neon cyberpunk world.' }
      ]
    }
  };

  const urlParams = new URLSearchParams(window.location.search);
  const gameId = urlParams.get('id') || 'pol';
  const game = gamesDatabase[gameId] || gamesDatabase['pol'];

  document.title = `QHOF — ${game.title}`;
  document.body.style.backgroundImage = `url('${game.image}')`;
  gameHero.style.backgroundImage = `url('${game.image}')`;

  const setElText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  setElText('gameTitle', game.title);
  setElText('gamePrice', game.price);
  setElText('buyCardPrice', game.price);
  setElText('gameDescription', game.description);
  setElText('gameDeveloper', game.developer);
  setElText('gamePublisher', game.publisher);
  setElText('gameReleaseDate', game.releaseDate);
  setElText('gameRating', game.rating);

  const tagsContainer = document.getElementById('gameTags');
  if (tagsContainer) {
    tagsContainer.innerHTML = game.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
  }

  const reviewsContainer = document.getElementById('gameReviewsContainer');
  if (reviewsContainer && game.reviews) {
    reviewsContainer.innerHTML = game.reviews.map(rev => `
      <div class="review-card">
        <div class="review-header">
          <div class="reviewer-avatar avatar-1"></div>
          <div>
            <h4 class="reviewer-name">${rev.name}</h4>
            <div class="stars">
              ${'<i class="fa-solid fa-star"></i>'.repeat(rev.rating)}
            </div>
          </div>
        </div>
        <p class="review-text">"${rev.text}"</p>
      </div>
    `).join('');
  }

  const btnBuyNow = document.getElementById('btnBuyNow');
  if (btnBuyNow) {
    btnBuyNow.onclick = () => {
      if (window.globalApp) {
        window.globalApp.addItem(gameId);
      } else {
        alert(`Added ${game.title} to Cart!`);
      }
    };
  }

  const btnWishlist = document.getElementById('btnWishlist');
  if (btnWishlist) {
    btnWishlist.onclick = () => alert(`Added ${game.title} to your Wishlist!`);
  }
});