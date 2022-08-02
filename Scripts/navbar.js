const navSlide = () => {
    const navbar_icon = document.querySelector('.navbar__icon');
    const nav = document.querySelector('#navbar_menu');
    const navbar_items = document.querySelectorAll('.navbar__item');

    navbar_icon.addEventListener('click', () => {
        nav.classList.toggle('navbar_menu__active');
    });
}

navSlide();