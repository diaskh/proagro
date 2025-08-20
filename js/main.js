(function () {
    // Модуль: Защита контента
    // const ContentProtection = (function () {
    //     // Используем CSS для запрета выделения вместо JS, чтобы не мешать доступности
    //     const style = document.createElement('style');
    //     style.textContent = `
    //         .no-select { user-select: none; }
    //         /* Предупреждение при попытке копирования */
    //         .copy-warning::after {
    //             content: 'Копирование ограничено. Свяжитесь с нами для получения информации.';
    //             position: fixed;
    //             top: 10px; right: 10px;
    //             background: #f44336; color: white;
    //             padding: 10px;
    //             border-radius: 5px;
    //             display: none;
    //             z-index: 1000;
    //         }
    //         .copy-warning.show::after { display: block; }
    //     `;
    //     document.head.appendChild(style);

    //     function init() {
    //         // Запрет контекстного меню
    //         document.addEventListener('contextmenu', e => {
    //             e.preventDefault();
    //             alert('Контекстное меню отключено!');
    //         });

    //         // Предупреждение при копировании
    //         document.addEventListener('copy', e => {
    //             e.preventDefault();
    //             document.body.classList.add('copy-warning');
    //             setTimeout(() => document.body.classList.remove('copy-warning'), 2000);
    //         });

    //         // Применяем CSS-класс для запрета выделения только к контенту
    //         document.querySelectorAll('.protected-content').forEach(el => el.classList.add('no-select'));
    //     }

    //     return { init };
    // })();

    // Модуль: Прокрутка
    const ScrollHandler = (function () {
        function initHeroScroll() {
            if (window.location.hash) {
                history.replaceState(null, null, window.location.pathname);
            }
            const hero = document.getElementById('hero');
            if (hero) {
                hero.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }

        function initSmoothScroll() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', e => {
                    e.preventDefault();
                    const target = document.querySelector(anchor.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        history.pushState(null, null, anchor.getAttribute('href'));
                    }
                });
            });
        }

        function initScrollToTop() {
            const btn = document.getElementById('scrollToTopBtn');
            if (btn) {
                btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
            }
        }

        return { init: () => {
            initHeroScroll();
            initSmoothScroll();
            initScrollToTop();
        }};
    })();

    // Модуль: Модальное окно
    const ModalHandler = (function () {
        const modal = document.getElementById('feedback-modal');
        const modalContent = document.getElementById('feedback-modal-content');
        const closeBtn = document.getElementById('close-feedback-modal');
        const openButtons = document.querySelectorAll('#hero-feedback-btn, #about-feedback-btn');

        function openModal() {
            if (modal && modalContent) {
                modal.style.display = 'flex';
                modal.setAttribute('role', 'dialog');
                modal.setAttribute('aria-modal', 'true');
                setTimeout(() => {
                    modalContent.style.opacity = '1';
                    modalContent.style.transform = 'scale(1)';
                }, 10);
                modalContent.focus();
            }
        }

        function closeModal() {
            if (modal && modalContent) {
                modalContent.style.opacity = '0';
                modalContent.style.transform = 'scale(0.96)';
                setTimeout(() => {
                    modal.style.display = 'none';
                    modal.removeAttribute('aria-modal');
                }, 300);
            }
        }

        function init() {
            if (modal && modalContent && closeBtn) {
                openButtons.forEach(btn => btn.addEventListener('click', openModal));
                closeBtn.addEventListener('click', closeModal);
                modal.addEventListener('click', e => e.target === modal && closeModal());
                modal.addEventListener('keydown', e => e.key === 'Escape' && closeModal());
            }
        }

        return { init };
    })();
    // Модуль: Прайс-лист
    const PricingHandler = (function () {
        function init() {
            const categories = document.querySelectorAll('.pricing-category');
            
            categories.forEach(category => {
                const header = category.querySelector('.pricing-category-header');
                
                header.addEventListener('click', () => {
                    // Close all other categories
                    categories.forEach(otherCategory => {
                        if (otherCategory !== category) {
                            otherCategory.classList.remove('active');
                        }
                    });
                    
                    // Toggle current category
                    category.classList.toggle('active');
                });
            });
        }

        return { init };
    })();
    // Модуль: Анимации
    const AnimationHandler = (function () {
        function initFadeIn() {
            document.querySelectorAll('.hero-fadein').forEach((el, i) => {
                setTimeout(() => el.classList.add('visible'), i * 180);
            });
        }

        function getCenterCoords(el) {
            const rect = el.getBoundingClientRect();
            return {
                left: rect.left + rect.width / 2 + window.scrollX,
                top: rect.top + rect.height / 2 + window.scrollY
            };
        }

        function animateMessengerMove(fromEl, toEl, cb) {
            const fromRect = fromEl.getBoundingClientRect();
            const toRect = toEl.getBoundingClientRect();
            const scrollY = window.scrollY;
            const scrollX = window.scrollX;

            const clone = fromEl.cloneNode(true);
            document.body.appendChild(clone);
            clone.classList.add('animating');
            clone.style.opacity = '1';
            clone.style.pointerEvents = 'none';
            clone.style.position = 'absolute';
            clone.style.left = (fromRect.left + scrollX) + 'px';
            clone.style.top = (fromRect.top + scrollY) + 'px';
            clone.style.width = fromRect.width + 'px';
            clone.style.height = fromRect.height + 'px';
            clone.style.margin = '0';
            clone.style.transition = 'left 0.7s cubic-bezier(.4,0,.2,1), top 0.7s cubic-bezier(.4,0,.2,1), opacity 0.5s';

            fromEl.style.opacity = '0';

            setTimeout(() => {
                clone.style.left = (toRect.left + scrollX) + 'px';
                clone.style.top = (toRect.top + scrollY) + 'px';
            }, 10);

            setTimeout(() => {
                clone.style.opacity = '0';
                setTimeout(() => {
                    clone.remove();
                    if (cb) cb();
                }, 200);
            }, 750);
        }

        function initMessengerAnimation() {
            const floating = document.getElementById('floating-messengers');
            const footer = document.getElementById('footer');
            const footerMessengers = document.getElementById('footer-messengers');
            const scrollToTopBtn = document.getElementById('scrollToTopBtn');

            let lastScroll = 0;
            const throttle = (fn, wait) => {
                let time = Date.now();
                return () => {
                    if ((time + wait - Date.now()) < 0) {
                        fn();
                        time = Date.now();
                    }
                };
            };

            const handleScroll = throttle(() => {
                if (scrollToTopBtn) {
                    scrollToTopBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
                }

                if (!floating || !footer || !footerMessengers) return;

                const rect = footer.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                const floatBtns = floating.querySelectorAll('.floating-messenger-btn');
                const footerBtns = footerMessengers.querySelectorAll('.footer-messenger-anim');

                if (rect.top < windowHeight - 120) {
                    if (floating.style.display !== 'none') {
                        animateMessengerMove(floatBtns[0], footerBtns[0], () => {
                            footerBtns[0].style.opacity = '1';
                            footerBtns[0].style.transform = 'translateY(0)';
                        });
                        setTimeout(() => {
                            animateMessengerMove(floatBtns[1], footerBtns[1], () => {
                                footerBtns[1].style.opacity = '1';
                                footerBtns[1].style.transform = 'translateY(0)';
                            });
                        }, 200);
                        floatBtns.forEach(btn => btn.style.opacity = '0');
                        setTimeout(() => floating.style.display = 'none', 800);
                    }
                    footerMessengers.style.display = 'flex';
                } else {
                    if (floating.style.display !== 'flex') {
                        floating.style.display = 'flex';
                        animateMessengerMove(footerBtns[0], floatBtns[0], () => floatBtns[0].style.opacity = '1');
                        setTimeout(() => {
                            animateMessengerMove(footerBtns[1], floatBtns[1], () => floatBtns[1].style.opacity = '1');
                        }, 200);
                        footerBtns.forEach(btn => {
                            btn.style.opacity = '0';
                            btn.style.transform = 'translateY(30px)';
                        });
                        setTimeout(() => footerMessengers.style.display = 'none', 800);
                    }
                }
            }, 100);

            window.addEventListener('scroll', handleScroll);
        }

        return { init: () => {
            initFadeIn();
            initMessengerAnimation();
        }};
    })();

    // Модуль: Портфолио (Каталог дронов)
    const PortfolioHandler = (function () {
        function initCollapsible() {
            document.querySelectorAll('.portfolio-collapsible').forEach(block => {
                const desc = block.querySelector('.portfolio-desc');
                const content = block.querySelector('.collapsible-content');
                const arrow = block.querySelector('.portfolio-toggle-arrow');
                let expanded = false;

                const toggleExpansion = () => {
                    expanded = !expanded;
                    
                    if (expanded) {
                        desc.classList.add('expanded');
                        content.style.maxHeight = content.scrollHeight + 'px';
                        content.style.overflow = 'visible';
                        if (arrow) {
                            arrow.style.transform = 'rotate(180deg)';
                        }
                    } else {
                        desc.classList.remove('expanded');
                        content.style.maxHeight = '0';
                        content.style.overflow = 'hidden';
                        if (arrow) {
                            arrow.style.transform = 'rotate(0deg)';
                        }
                    }
                };

                // Add click event to the whole collapsible block
                block.addEventListener('click', (e) => {
                    e.preventDefault();
                    toggleExpansion();
                });

                // Handle keyboard navigation
                block.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleExpansion();
                    }
                });
            });
        }

        return {
            init: initCollapsible
        };
    })();

    // Модуль: FAQ
    const FAQHandler = (function () {
        function init() {
            document.querySelectorAll('.faq-item').forEach(item => {
                const btn = item.querySelector('.faq-question');
                const answer = item.querySelector('.faq-answer');
                const arrow = item.querySelector('.faq-arrow');
                
                if (btn && answer && arrow) {
                    btn.addEventListener('click', () => {
                        const isExpanded = answer.style.maxHeight && answer.style.maxHeight !== '0px';
                        
                        // Close all other FAQ items
                        document.querySelectorAll('.faq-item').forEach(otherItem => {
                            if (otherItem !== item) {
                                const otherAnswer = otherItem.querySelector('.faq-answer');
                                const otherArrow = otherItem.querySelector('.faq-arrow');
                                if (otherAnswer && otherArrow) {
                                    otherAnswer.style.maxHeight = '0';
                                    otherAnswer.style.paddingBottom = '0';
                                    otherArrow.style.transform = 'rotate(0deg)';
                                    otherItem.classList.remove('active');
                                }
                            }
                        });
                        
                        // Toggle current item
                        if (isExpanded) {
                            // Close current item
                            answer.style.maxHeight = '0';
                            answer.style.paddingBottom = '0';
                            arrow.style.transform = 'rotate(0deg)';
                            item.classList.remove('active');
                        } else {
                            // Open current item
                            answer.style.maxHeight = answer.scrollHeight + 'px';
                            answer.style.paddingBottom = '1rem';
                            arrow.style.transform = 'rotate(180deg)';
                            item.classList.add('active');
                        }
                    });
                }
            });
        }

        return { init };
    })();

    // Модуль: Слайдер
    const SliderHandler = (function () {
        function init() {
            const slidesContainer = document.querySelector('.slides');
            const slides = document.querySelectorAll('.slide');
            const dotsContainer = document.querySelector('.dots');
            
            if (!slidesContainer || !slides.length || !dotsContainer) return;
            
            const images = slidesContainer.querySelectorAll('img');
            let currentIndex = 0;
            let isAnimating = false;
            let totalSlides = slides.length;

            // Предзагрузка всех изображений
            let loadedCount = 0;
            const totalImages = images.length;

            images.forEach(img => {
                const tempImg = new Image();
                tempImg.src = img.src;
                tempImg.onload = tempImg.onerror = () => {
                    loadedCount++;
                    if (loadedCount === totalImages) {
                        startSlider(); // Запускаем после полной загрузки
                    }
                };
            });

            // Функция запуска слайдера
            function startSlider() {
                // Клонируем первый слайд и добавляем в конец
                const firstSlide = slidesContainer.children[0].cloneNode(true);
                slidesContainer.appendChild(firstSlide);

                const dots = [];

                // Создание точек (только для оригинальных слайдов)
                for (let i = 0; i < totalSlides; i++) {
                    const dot = document.createElement('div');
                    dot.classList.add('dot');
                    if (i === 0) dot.classList.add('active');
                    dotsContainer.appendChild(dot);
                    dots.push(dot);
                }

                function updateDots(index) {
                    dots.forEach(dot => dot.classList.remove('active'));
                    dots[index % dots.length].classList.add('active');
                }

                function nextSlide() {
                    if (isAnimating) return;
                    isAnimating = true;
                    currentIndex++;

                    // Move exactly by slide width including padding
                    slidesContainer.style.transition = 'transform 0.6s ease-in-out';
                    slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;

                    setTimeout(() => {
                        // Если дошли до клонированного слайда
                        if (currentIndex === totalSlides) {
                            slidesContainer.style.transition = 'none';
                            slidesContainer.style.transform = 'translateX(0%)';
                            currentIndex = 0;
                        }
                        updateDots(currentIndex);
                        isAnimating = false;
                    }, 600);
                }

                // Initial setup to ensure no next slide is visible
                slidesContainer.style.transform = 'translateX(0%)';
                
                setInterval(nextSlide, 2000);
            }
        }

        return { init };
    })();

    // Модуль: Форма обратной связи
    const FormHandler = (function () {
        function init() {
            const modal = document.getElementById('feedback-modal');
            const modalContent = document.getElementById('feedback-modal-content');
            const closeButton = document.getElementById('close-feedback-modal');
            const form = document.getElementById('feedback-form');
            const phoneInput = document.getElementById('feedback-phone');
            const phoneError = document.getElementById('phone-error');
            const successMessage = document.getElementById('feedback-success');
            const aboutButton = document.getElementById('about-feedback-btn');
            const heroButton = document.getElementById('hero-feedback-btn');

            if (!modal || !form) return;

            // Показать модальное окно
            function showModal() {
                modal.style.display = 'flex';
                setTimeout(() => {
                    modal.style.opacity = '1';
                    if (modalContent) {
                        modalContent.style.opacity = '1';
                        modalContent.style.transform = 'scale(1)';
                    }
                }, 10);
            }

            // Скрыть модальное окно
            function hideModal() {
                modal.style.opacity = '0';
                if (modalContent) {
                    modalContent.style.opacity = '0';
                    modalContent.style.transform = 'scale(0.95)';
                }
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 300);
            }

            // Валидация номера телефона (+7 и 10 цифр)
            function validatePhone(phone) {
                const regex = /^\+7\d{10}$/;
                return regex.test(phone);
            }

            // Event listeners
            if (closeButton) {
                closeButton.addEventListener('click', hideModal);
            }

            modal.addEventListener('click', (e) => {
                if (e.target === modal) hideModal();
            });

            if (aboutButton) {
                aboutButton.addEventListener('click', showModal);
            }
            if (heroButton) {
                heroButton.addEventListener('click', showModal);
            }

            // Форматирование номера телефона при вводе
            if (phoneInput && phoneError) {
                phoneInput.addEventListener('input', () => {
                    let value = phoneInput.value.replace(/\D/g, '');
                    if (value.length > 0 && value[0] !== '7') {
                        value = '7' + value;
                    }
                    if (value.length > 11) {
                        value = value.slice(0, 11);
                    }
                    phoneInput.value = value.length > 0 ? `+${value}` : '';
                    phoneError.classList.add('hidden');
                });
            }

            // Обработка отправки формы
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                // Валидация телефона
                if (phoneInput && phoneError && !validatePhone(phoneInput.value)) {
                    phoneError.classList.remove('hidden');
                    return;
                }

                // Подготовка данных формы
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);

                try {
                    const response = await fetch('https://formspree.io/f/manjvkzr', {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    });

                    if (response.ok) {
                        form.reset();
                        if (successMessage) {
                            successMessage.classList.remove('hidden');
                        }
                        setTimeout(hideModal, 2000);
                    } else {
                        throw new Error('Ошибка отправки формы');
                    }
                } catch (error) {
                    if (phoneError) {
                        phoneError.textContent = 'Произошла ошибка. Попробуйте еще раз.';
                        phoneError.classList.remove('hidden');
                    }
                }
            });
        }

        return { init };
    })();

    // Модуль: Установка текущего года
    const YearHandler = (function () {
        function init() {
            const yearSpan = document.getElementById('currentYear');
            if (yearSpan) {
                yearSpan.textContent = new Date().getFullYear();
            }
        }

        return { init };
    })();

    // Инициализация всех модулей
    document.addEventListener('DOMContentLoaded', () => {
        ContentProtection.init();
        ScrollHandler.init();
        ModalHandler.init();
        AnimationHandler.init();
        PortfolioHandler.init();
        FAQHandler.init();
        SliderHandler.init();
        FormHandler.init();
        YearHandler.init();
        PricingHandler.init(); 
    });
})();