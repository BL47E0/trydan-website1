document.addEventListener('DOMContentLoaded', () => {

    // Hamburger Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active'); // Used for styling the 'X'
            
            const spans = hamburger.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // Close menu when clicking on a nav link
    const navLinks = document.querySelectorAll('.nav-link');
    if (navLinks.length > 0) {
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    const spans = hamburger.querySelectorAll('span');
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            });
        });
    }

    // Active Link Highlight on Scroll
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavLink() {
        let scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100; // Adjusted offset
            let sectionId = current.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector('.nav-menu a[href*=' + sectionId + ']').classList.add('active');
            } else {
                document.querySelector('.nav-menu a[href*=' + sectionId + ']').classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink);

    // Navbar Background on Scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 14, 26, 1)';
            navbar.style.boxShadow = '0 5px 20px rgba(0, 255, 136, 0.1)';
        } else {
            navbar.style.background = 'rgba(10, 14, 26, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
    
    // Fade-in effect for sections on scroll
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section').forEach(section => {
        sectionObserver.observe(section);
    });

     const showMoreBtn = document.getElementById('showMoreBtn');
    const moreAchievements = document.getElementById('moreAchievements');

    if (showMoreBtn && moreAchievements) {
        showMoreBtn.addEventListener('click', () => {
            // Toggle the 'visible' class on the container
            moreAchievements.classList.toggle('visible');
            
            // Change the button text
            if (moreAchievements.classList.contains('visible')) {
                showMoreBtn.textContent = 'Show Less';
            } else {
                showMoreBtn.textContent = 'Show More';
            }
        });
    }
    const joinForm = document.getElementById('joinForm');

    if (joinForm) {
        joinForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const submitBtn = joinForm.querySelector('button');

            // Disable button + change text
            submitBtn.disabled = true;
            submitBtn.textContent = "Submitting...";

            const data = {
                name: document.getElementById('name').value,
                usn: document.getElementById('usn').value,
                department: document.getElementById('department').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                domain: document.getElementById('domain').value,
                message: document.getElementById('message').value
            };

        fetch("https://script.google.com/macros/s/AKfycbw4yYp2JkzYWCciPJ_7pIoe_2pDdgOgyYRT5tDBE4yNod8vooxY-d8kWBtjSbT90CE8/exec", {
            method: "POST",
            mode: "no-cors",
            body: JSON.stringify(data)
        })
        .then(() => {
            window.location.href = "thankyou.html";
        })
        .catch(() => {
            alert("Error submitting form");

            // Re-enable button if something fails
            submitBtn.disabled = false;
            submitBtn.textContent = "Submit Application";
        });
    });
}
const slides = document.querySelectorAll(".slide");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");

if (slides.length > 0 && nextBtn && prevBtn) {

    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove("active"));
        slides[index].classList.add("active");
    }

    nextBtn.addEventListener("click", () => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    });

    prevBtn.addEventListener("click", () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    });
}

let currentSlideIndex = 0;

const fullViewer = document.getElementById("fullscreenViewer");
const fullImg = document.getElementById("fullImg");
const closeBtn = document.getElementById("closeBtn");

const fsPrev = document.querySelector(".fs-prev");
const fsNext = document.querySelector(".fs-next");

if (slides.length > 0) {

    slides.forEach((slide, index) => {
        slide.addEventListener("click", (e) => {
            e.stopPropagation();
            currentSlideIndex = index;
            fullViewer.style.display = "flex";
            fullImg.src = slides[currentSlideIndex].src;
        });
    });

    function updateFullscreen() {
        fullImg.src = slides[currentSlideIndex].src;
    }

    if (fsNext) {
        fsNext.addEventListener("click", (e) => {
            e.stopPropagation();
            currentSlideIndex = (currentSlideIndex + 1) % slides.length;
            updateFullscreen();
        });
    }

    if (fsPrev) {
        fsPrev.addEventListener("click", (e) => {
            e.stopPropagation();
            currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
            updateFullscreen();
        });
    }
}

if (closeBtn) {
    closeBtn.addEventListener("click", () => {
        fullViewer.style.display = "none";
    });
}

if (fullViewer) {
    fullViewer.addEventListener("click", () => {
        fullViewer.style.display = "none";
    });
}
});