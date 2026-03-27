document.addEventListener('DOMContentLoaded', () => {

    // Hamburger Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

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

    // Close menu when clicking on a nav link
    const navLinks = document.querySelectorAll('.nav-link');
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
    // // Join Form Submission (redirect to thank you page)
    // const joinForm = document.getElementById('joinForm');

    // if (joinForm) {
    //     joinForm.addEventListener('submit', function(e) {
    //         e.preventDefault();

    //         // Future: send data to backend / Google Sheets

    //         window.location.href = "thankyou.html";
    //     });
    // }
    
});