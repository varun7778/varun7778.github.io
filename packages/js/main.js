/*==================== MENU SHOW Y HIDDEN ====================*/
const navMenu = document.getElementById("nav-menu"),
  navToggle = document.getElementById("nav-toggle"),
  navClose = document.getElementById("nav-close");

/*===== MENU SHOW =====*/
/* Validate if constant exists */
if (navToggle) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.add("show-menu");
  });
}

/*===== MENU HIDDEN =====*/
/* Validate if constant exists */
if (navClose) {
  navClose.addEventListener("click", () => {
    navMenu.classList.remove("show-menu");
  });
}

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll(".nav__link");

function linkAction() {
  const navMenu = document.getElementById("nav-menu");
  // When we click on each nav__link, we remove the show-menu class
  navMenu.classList.remove("show-menu");
}
navLink.forEach((n) => n.addEventListener("click", linkAction));

/*==================== ACCORDION SKILLS ====================*/
const skillsContent = document.getElementsByClassName("skills__content"),
  skillsHeader = document.querySelectorAll(".skills__header");

function toggleSkills() {
  let itemClass = this.parentNode.className;

  for (i = 0; i < skillsContent.length; i++) {
    skillsContent[i].className = "skills__content skills__close";
  }
  if (itemClass === "skills__content skills__close") {
    this.parentNode.className = "skills__content skills__open";
  }
}

skillsHeader.forEach((el) => {
  el.addEventListener("click", toggleSkills);
});

/*==================== EXPERIENCE TABS ====================*/
const tabs = document.querySelectorAll("[data-target]"),
  tabContents = document.querySelectorAll("[data-content]");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = document.querySelector(tab.dataset.target);

    tabContents.forEach((tabContent) => {
      tabContent.classList.remove("experience__active");
    });
    target.classList.add("experience__active");

    tabs.forEach((tab) => {
      tab.classList.remove("experience__active");
    });
    tab.classList.add("experience__active");
  });
});

/*==================== PROJECTS MODAL ====================*/
const modalViews = document.querySelectorAll(".projects__modal"),
  modalBtns = document.querySelectorAll(".projects__button"),
  modalCloses = document.querySelectorAll(".projects__modal-close");

let modal = function (modalClick) {
  modalViews[modalClick].classList.add("active-modal");
};

modalBtns.forEach((modalBtn, i) => {
  modalBtn.addEventListener("click", () => {
    modal(i);
  });
});

modalCloses.forEach((modalClose) => {
  modalClose.addEventListener("click", () => {
    modalViews.forEach((modalView) => {
      modalView.classList.remove("active-modal");
    });
  });
});

/*==================== PROJECT SWIPER  ====================*/
let swiperProjects = new Swiper(".projects__container", {
  cssMode: true,
  loop: true,

  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },

  /* mousewheel: true,
  keyboard: true, */
});

/*==================== SKILL SWIPER  ====================*/
const logo_container = document.getElementById('logo_container');
const skill_pagination = document.getElementById('skill_pagination');
let itemsPerPage;
let items = [];
let sliderVar;

async function fetchItems() {
  return fetch('packages/data/skills.json') // Fetch the JSON file
    .then(response => response.json()) // Parse the JSON response
    .then(data => {
      items = data; // Assign the fetched data to the items array
    })
    .catch(error => console.error('Error fetching data:', error));
}

function calculateItemsPerPage() {
  if(window.screen.width<=380)
  {
    itemsPerPage = 12;
  }
  if(window.screen.width>=380 && window.screen.width<568)
  {
    itemsPerPage = 12;
  }
  if(window.screen.width>=568 && window.screen.width<768)
  {
    itemsPerPage = 16;
  }
  if(window.screen.width>=768)
  {
    itemsPerPage = 20;
  }
}

function displayItems(pageNumber) {
  logo_container.innerHTML = ''; // Clear container

  const startIndex = (pageNumber - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const itemsToDisplay = items.slice(startIndex, endIndex);

  itemsToDisplay.forEach(item => {
    const card = document.createElement('div');
    card.classList.add('card');

    const img = document.createElement('img');
    img.src = item.imageSrc;
    img.alt = item.altText;

    const p = document.createElement('p');
    p.textContent = item.text;

    card.appendChild(img);
    card.appendChild(p);

    logo_container.appendChild(card);
  });
}

function init() {
  const slider = document.querySelector('.slider');

  if (!slider) {
    console.warn('Could not get slider element!')
    return;
  }

  sliderVar = new Slider(slider);
}

class Slider {
  constructor(sliderEl) {
    this.sliderEl = sliderEl;
    this.slides = this.sliderEl.querySelectorAll('.card');
    this.slideCount = Math.ceil(items.length / itemsPerPage);
    this.bulletsContainer = this.sliderEl.querySelector('.slider__bullets');
    this.arrows = {
      prev: this.sliderEl.querySelector('.slider__arrow--prev'),
      next: this.sliderEl.querySelector('.slider__arrow--next'),
    }
    this.bullets = [];

    this.activeIndex = 1; // Start from 1

    this._initializeSlider();
  }

  /* Initialize the slider by creating necessary elements and updating the UI */
  _initializeSlider = () => {
    this._createBullets();
    this._addBulletsToSlider();
    this._addEventListeners();

    this._updateUI();
  }

  /************ SETUP FUNCTIONS *****/

  /* Create one bullet element corresponding to each of the slides */
  _createBullets = () => {
    this.bullets = [];
    for (let i = 1; i <= this.slideCount; i++) { // Start from 1
      const bullet = document.createElement('button');
      bullet.classList.add('slider__bullet');
      this.bullets.push(bullet);
    }
  }

  /* Add the bullet elements to the slider */
  _addBulletsToSlider = () => {
    this.bulletsContainer.innerHTML = '';
    this.bullets.forEach((bullet) => {
      this.bulletsContainer.appendChild(bullet);
    })
  }

  /* Add event listeners to the slider arrows */
  _addEventListeners = () => {
    this.arrows.prev.addEventListener('click', this._onPrevArrowClick);
    this.arrows.next.addEventListener('click', this._onNextArrowClick);
  }

  /* Go to previous slide on the prev arrow is clicked */
  _onPrevArrowClick = () => {
    this.activeIndex = this.activeIndex - 1;
    if (this.activeIndex < 1) { // Check for lower boundary
      this.activeIndex = this.slideCount;
    }

    this._updateUI();
  }

  /* Go to next slide when the next arrow is clicked */
  _onNextArrowClick = () => {
    this.activeIndex = (this.activeIndex % this.slideCount) + 1; // Start from 1
    this._updateUI();
  }

  /************ UPDATE FUNCTIONS *****/

  _updateOnResize = () => {
    this.slideCount = Math.ceil(items.length / itemsPerPage);
    this._createBullets();
    this._addBulletsToSlider();
    this._updateUI();
  }

  /* Update the whole UI according to the current state */
  _updateUI = () => {
    this._updateActiveBullet();
    this._updateArrowsUI();
    this._updateSlidesUI();
  }

  /* Update the active bullet attribute */
  _updateActiveBullet = () => {
    this.bullets.forEach((bullet, index) => {
      index + 1 === this.activeIndex // Start from 1
        ? bullet.setAttribute('active', '')
      : bullet.removeAttribute('active');
    })
  }

  /* Update the arrows disabled attribute so they are only clickable when relevant */
  _updateArrowsUI = () => {
    this.activeIndex === 1 // Start from 1
      ? this.arrows.prev.setAttribute('disabled', '')
      : this.arrows.prev.removeAttribute('disabled');

    this.activeIndex === this.slideCount // End at slideCount
      ? this.arrows.next.setAttribute('disabled', '')
      : this.arrows.next.removeAttribute('disabled');
  }

  /* Update the active slide */
  _updateSlidesUI = () => {
    for (let i = 1; i <= this.slideCount; i++) { // Start from 1
      if(i === this.activeIndex)
        displayItems(i);
    }
  }
}

// Fetch items from JSON and then display them
fetchItems()
  .then(() => {
    calculateItemsPerPage();
    init();
    displayItems(1);
  })
  .catch(error => console.error('Error:', error));


// Update items per page on window resize
window.addEventListener('resize', () => {
  calculateItemsPerPage();
  if (sliderVar) {
    sliderVar._updateOnResize();
  }
  displayItems(1);
});


/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll("section[id]");

function scrollActive() {
  const scrollY = window.pageYOffset;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 50;
    sectionId = current.getAttribute("id");

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      document
        .querySelector(".nav__menu a[href*=" + sectionId + "]")
        .classList.add("active-link");
    } else {
      document
        .querySelector(".nav__menu a[href*=" + sectionId + "]")
        .classList.remove("active-link");
    }
  });
}
window.addEventListener("scroll", scrollActive);

/*==================== CHANGE BACKGROUND HEADER ====================*/
function scrollHeader() {
  const nav = document.getElementById("header");
  // When the scroll is greater than 200 viewport height, add the scroll-header class to the header tag
  if (this.scrollY >= 80) nav.classList.add("scroll-header");
  else nav.classList.remove("scroll-header");
}
window.addEventListener("scroll", scrollHeader);

/*==================== SHOW SCROLL UP ====================*/
function scrollUp() {
  const scrollUp = document.getElementById("scroll-up");
  // When the scroll is higher than 560 viewport height, add the show-scroll class to the a tag with the scroll-top class
  if (this.scrollY >= 560) scrollUp.classList.add("show-scroll");
  else scrollUp.classList.remove("show-scroll");
}
window.addEventListener("scroll", scrollUp);

/*==================== DARK LIGHT THEME ====================*/

const themeButton = document.getElementById("theme-button");
const darkTheme = "dark-theme";
const iconTheme = "uil-sun";

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem("selected-theme");
const selectedIcon = localStorage.getItem("selected-icon");

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () =>
  document.body.classList.contains(darkTheme) ? "dark" : "light";
const getCurrentIcon = () =>
  themeButton.classList.contains(iconTheme) ? "uil-moon" : "uil-sun";

// We validate if the user previously chose a topic
if (selectedTheme) {
  // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
  document.body.classList[selectedTheme === "dark" ? "add" : "remove"](
    darkTheme
  );
  themeButton.classList[selectedIcon === "uil-moon" ? "add" : "remove"](
    iconTheme
  );
}

// Activate / deactivate the theme manually with the button
themeButton.addEventListener("click", () => {
  // Add or remove the dark / icon theme
  document.body.classList.toggle(darkTheme);
  themeButton.classList.toggle(iconTheme);
  // We save the theme and the current icon that the user chose
  localStorage.setItem("selected-theme", getCurrentTheme());
  localStorage.setItem("selected-icon", getCurrentIcon());
});


/*==================== Cursor ====================*/

const coords = { x: 0, y: 0 };
const circles = document.querySelectorAll(".circle");

const colors = [
  "#ff6b6b",
  "#fd5f68",
  "#f95365",
  "#f64761",
  "#f33b5e",
  "#f02f5b",
  "#ed2258",
  "#e91655",
  "#e60a52",
  "#e3004f",
  "#e0004b",
  "#d80048",
  "#d50045",
  "#d20042",
  "#cf003f",
  "#cc003c",
  "#c90038",
  "#c60035",
  "#c30032",
  "#c0002f"
];

document.body.style.cursor = 'none';

circles.forEach(function (circle, index) {
  circle.x = 0;
  circle.y = 0;
  circle.style.backgroundColor = colors[index % colors.length];
});

window.addEventListener("mousemove", function(e){
  coords.x = e.clientX;
  coords.y = e.clientY;
  
});

function animateCircles() {
  
  let x = coords.x;
  let y = coords.y;
  
  circles.forEach(function (circle, index) {
    circle.style.left = x - 12 + "px";
    circle.style.top = y - 12 + "px";
    
    circle.style.scale = (circles.length - index) / circles.length;
    
    circle.x = x;
    circle.y = y;

    const nextCircle = circles[index + 1] || circles[0];
    x += (nextCircle.x - x) * 0.3;
    y += (nextCircle.y - y) * 0.3;
  });
 
  requestAnimationFrame(animateCircles);
}

animateCircles();

/*==================== Disable Cursor ====================*/
const Cursorcircles = document.querySelectorAll('[id*=cursor]');
// Function to check if cursor is pointer
function isCursorPointer(e) {
  return e.target.style.cursor === 'pointer' || window.getComputedStyle(e.target).cursor === 'pointer' || window.screen.width <= 568;
}

function handleMouseMove(e) {
  for (const Cursorcircle of Cursorcircles) {
    if (isCursorPointer(e)) {
      Cursorcircle.style.display = 'none';
    } 
    else {
      Cursorcircle.style.display = 'block';
    }
  }
}

document.addEventListener('mousemove', handleMouseMove);

/*==================== FadeIn Animation ====================*/
var observer = new IntersectionObserver(
	function (entries) {
		entries.forEach(function (entry) {
			var el = entry.target;
			if (entry.isIntersecting) {
				el.classList.add("animate");
				return;
			}
		});
	},
	{ threshold: 0.2 }
);

document.querySelectorAll(".animation").forEach(function (i) {
	if (i) {
		observer.observe(i);
	}
});