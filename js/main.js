(function () {
    // Модуль: Защита контента
    const ContentProtection = (function () {
        // Используем CSS для запрета выделения вместо JS, чтобы не мешать доступности
        const style = document.createElement('style');
        style.textContent = `
            .no-select { user-select: none; }
            /* Предупреждение при попытке копирования */
            .copy-warning::after {
                content: 'Копирование ограничено. Свяжитесь с нами для получения информации.';
                position: fixed;
                top: 10px; right: 10px;
                background: #f44336; color: white;
                padding: 10px;
                border-radius: 5px;
                display: none;
                z-index: 1000;
            }
            .copy-warning.show::after { display: block; }
        `;
        document.head.appendChild(style);

        function init() {
            // Запрет контекстного меню
            document.addEventListener('contextmenu', e => {
                e.preventDefault();
                alert('Контекстное меню отключено!');
            });

            // Предупреждение при копировании
            document.addEventListener('copy', e => {
                e.preventDefault();
                document.body.classList.add('copy-warning');
                setTimeout(() => document.body.classList.remove('copy-warning'), 2000);
            });

            // Применяем CSS-класс для запрета выделения только к контенту
            document.querySelectorAll('.protected-content').forEach(el => el.classList.add('no-select'));
        }

        return { init };
    })();

    // Модуль: Навигация
    const NavigationHandler = (function () {
        function initMobileMenu() {
            const mobileMenuBtn = document.getElementById('mobile-menu-btn');
            const mobileMenu = document.getElementById('mobile-menu');
            
            if (mobileMenuBtn && mobileMenu) {
                mobileMenuBtn.addEventListener('click', () => {
                    const isHidden = mobileMenu.classList.contains('hidden');
                    if (isHidden) {
                        mobileMenu.classList.remove('hidden');
                        mobileMenuBtn.setAttribute('aria-expanded', 'true');
                    } else {
                        mobileMenu.classList.add('hidden');
                        mobileMenuBtn.setAttribute('aria-expanded', 'false');
                    }
                });

                // Close mobile menu when clicking on nav links
                document.querySelectorAll('.mobile-nav-link').forEach(link => {
                    link.addEventListener('click', () => {
                        mobileMenu.classList.add('hidden');
                        mobileMenuBtn.setAttribute('aria-expanded', 'false');
                    });
                });

                // Close mobile menu when clicking outside
                document.addEventListener('click', (e) => {
                    if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                        mobileMenu.classList.add('hidden');
                        mobileMenuBtn.setAttribute('aria-expanded', 'false');
                    }
                });
            }
        }

        function initSmoothScroll() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', e => {
                    e.preventDefault();
                    const target = document.querySelector(anchor.getAttribute('href'));
                    if (target) {
                        // Account for fixed header height
                        const headerHeight = document.getElementById('header').offsetHeight;
                        const targetPosition = target.offsetTop - headerHeight - 20;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                        
                        history.pushState(null, null, anchor.getAttribute('href'));
                    }
                });
            });
        }

        return { init: () => {
            initMobileMenu();
            initSmoothScroll();
        }};
    })();

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

        function initScrollToTop() {
            const btn = document.getElementById('scrollToTopBtn');
            if (btn) {
                btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
            }
        }

        return { init: () => {
            initHeroScroll();
            initScrollToTop();
        }};
    })();

    // Модуль: Модальное окно
    const ModalHandler = (function () {
        const modal = document.getElementById('feedback-modal');
        const modalContent = document.getElementById('feedback-modal-content');
        const closeBtn = document.getElementById('close-feedback-modal');
        const openButtons = document.querySelectorAll('#hero-feedback-btn, #about-feedback-btn, #training-feedback-btn');

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

    // Модуль: Портфолио (Каталог дронов) и Прайс-лист
    const PortfolioHandler = (function () {
        function initCollapsible() {
            // Handle both portfolio and pricing collapsible sections
            const portfolioBlocks = document.querySelectorAll('.portfolio-collapsible');
            const pricingBlocks = document.querySelectorAll('.pricing-collapsible');
            
            // Helper function to check if we're on mobile
            const isMobile = () => window.innerWidth <= 768;
            
            // Helper function to toggle a specific block
            const toggleBlock = (block, expanded, type = 'portfolio') => {
                const desc = block.querySelector(type === 'portfolio' ? '.portfolio-desc' : '.pricing-desc');
                const content = block.querySelector('.collapsible-content');
                const arrow = block.querySelector(type === 'portfolio' ? '.portfolio-toggle-arrow' : '.pricing-toggle-arrow');
                
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

            // Initialize portfolio blocks with synchronous behavior
            portfolioBlocks.forEach((block, index) => {
                let expanded = false;

                const toggleExpansion = () => {
                    expanded = !expanded;
                    
                    if (isMobile()) {
                        // On mobile: toggle only this block
                        toggleBlock(block, expanded, 'portfolio');
                    } else {
                        // On desktop: toggle all portfolio blocks synchronously
                        portfolioBlocks.forEach((otherBlock, otherIndex) => {
                            toggleBlock(otherBlock, expanded, 'portfolio');
                            if (otherIndex !== index) {
                                otherBlock.setAttribute('data-expanded', expanded.toString());
                            }
                        });
                    }
                    
                    block.setAttribute('data-expanded', expanded.toString());
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

            // Initialize pricing blocks with synchronous behavior
            pricingBlocks.forEach((block, index) => {
                let expanded = false;

                const toggleExpansion = () => {
                    expanded = !expanded;
                    
                    if (isMobile()) {
                        // On mobile: toggle only this block
                        toggleBlock(block, expanded, 'pricing');
                    } else {
                        // On desktop: toggle all pricing blocks synchronously
                        pricingBlocks.forEach((otherBlock, otherIndex) => {
                            toggleBlock(otherBlock, expanded, 'pricing');
                            if (otherIndex !== index) {
                                otherBlock.setAttribute('data-expanded', expanded.toString());
                            }
                        });
                    }
                    
                    block.setAttribute('data-expanded', expanded.toString());
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

    // Модуль: Product Slider (Каталог дронов)
    const ProductSliderHandler = (function () {
        function init() {
            const sliderNode = document.querySelector('.product-slider.embla');
            if (!sliderNode) return;

            const prevBtn = sliderNode.querySelector('.product-nav-prev');
            const nextBtn = sliderNode.querySelector('.product-nav-next');
            const dotsContainer = sliderNode.querySelector('.product-dots');
            
            const emblaApi = EmblaCarousel(sliderNode, { loop: false });

            if (dotsContainer) {
                dotsContainer.innerHTML = '';
                const snapList = emblaApi.scrollSnapList();
                const dots = [];

                snapList.forEach((_, index) => {
                    const dot = document.createElement('div');
                    dot.classList.add('product-dot');
                    if (index === 0) dot.classList.add('active');
                    dot.addEventListener('click', () => emblaApi.scrollTo(index));
                    dotsContainer.appendChild(dot);
                    dots.push(dot);
                });

                const onSelect = () => {
                    const previous = emblaApi.previousScrollSnap();
                    const selected = emblaApi.selectedScrollSnap();
                    if (dots[previous]) dots[previous].classList.remove('active');
                    if (dots[selected]) dots[selected].classList.add('active');
                };

                emblaApi.on('select', onSelect);
                emblaApi.on('reInit', onSelect);
            }

            if (prevBtn) prevBtn.addEventListener('click', () => emblaApi.scrollPrev());
            if (nextBtn) nextBtn.addEventListener('click', () => emblaApi.scrollNext());

            // Initialize thumbnail image switching for each slide
            const slides = sliderNode.querySelectorAll('.product-slide');
            slides.forEach(slide => {
                initThumbnailSwitching(slide);
            });

            // Make product CTA buttons open the modal
            const productCTAs = sliderNode.querySelectorAll('.product-cta');
            const modal = document.getElementById('feedback-modal');
            const modalContent = document.getElementById('feedback-modal-content');

            productCTAs.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (modal && modalContent) {
                        modal.style.display = 'flex';
                        modal.setAttribute('role', 'dialog');
                        modal.setAttribute('aria-modal', 'true');
                        setTimeout(() => {
                            modalContent.style.opacity = '1';
                            modalContent.style.transform = 'scale(1)';
                        }, 10);
                    }
                });
            });
        }

        // Internal image switching via thumbnails (tap only, no swipe)
        function initThumbnailSwitching(slideElement) {
            const mainImageContainer = slideElement.querySelector('.product-main-image');
            const thumbnails = slideElement.querySelectorAll('.thumbnail');
            const mainImages = slideElement.querySelectorAll('.product-main-image img');

            if (!mainImageContainer || thumbnails.length === 0) return;

            thumbnails.forEach((thumb, index) => {
                thumb.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent bubble to slider

                    // Update active thumbnail
                    thumbnails.forEach(t => t.classList.remove('active'));
                    thumb.classList.add('active');

                    // Update active main image
                    mainImages.forEach(img => img.classList.remove('active'));
                    if (mainImages[index]) {
                        mainImages[index].classList.add('active');
                    }
                });
            });
        }

        return { init };
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
            const sliderNodes = document.querySelectorAll('.slider.embla');
            if (sliderNodes.length === 0) return;

            sliderNodes.forEach(emblaNode => {
                const dotsContainer = emblaNode.querySelector('.dots');
                const options = { loop: true };
                let plugins = [];
                if (typeof EmblaCarouselAutoplay !== 'undefined') {
                    plugins = [EmblaCarouselAutoplay({ delay: 3000, stopOnInteraction: false })];
                }
                const emblaApi = EmblaCarousel(emblaNode, options, plugins);
                
                if (dotsContainer) {
                    dotsContainer.innerHTML = '';
                    const snapList = emblaApi.scrollSnapList();
                    const dots = [];

                    snapList.forEach((_, index) => {
                        const dot = document.createElement('div');
                        dot.classList.add('dot');
                        if (index === 0) dot.classList.add('active');
                        // Embla dots
                        dot.addEventListener('click', () => {
                            emblaApi.scrollTo(index);
                            if (plugins.length > 0) plugins[0].reset();
                        });
                        dotsContainer.appendChild(dot);
                        dots.push(dot);
                    });

                    const onSelect = () => {
                        const previous = emblaApi.previousScrollSnap();
                        const selected = emblaApi.selectedScrollSnap();
                        if (dots[previous]) dots[previous].classList.remove('active');
                        if (dots[selected]) dots[selected].classList.add('active');
                    };

                    emblaApi.on('select', onSelect);
                    emblaApi.on('reInit', onSelect);
                }
            });
        }

        return { init };
    })();

    // Модуль: Advantages Mobile Slider
    const AdvantagesSliderHandler = (function () {
        function init() {
            // Only initialize on mobile
            if (window.innerWidth >= 768) return;

            const sliderNodes = document.querySelectorAll('.advantages-slider.embla');
            if (sliderNodes.length === 0) return;

            sliderNodes.forEach(emblaNode => {
                const dotsContainer = emblaNode.querySelector('.advantages-dots');
                if (!dotsContainer) return;
                
                // Clear dots if previously initialized
                dotsContainer.innerHTML = '';

                const emblaApi = EmblaCarousel(emblaNode, { loop: false });
                
                const snapList = emblaApi.scrollSnapList();
                const dots = [];

                snapList.forEach((_, index) => {
                    const dot = document.createElement('div');
                    dot.classList.add('advantage-dot');
                    if (index === 0) dot.classList.add('active');
                    dot.addEventListener('click', () => emblaApi.scrollTo(index));
                    dotsContainer.appendChild(dot);
                    dots.push(dot);
                });

                const onSelect = () => {
                    const previous = emblaApi.previousScrollSnap();
                    const selected = emblaApi.selectedScrollSnap();
                    if (dots[previous]) dots[previous].classList.remove('active');
                    if (dots[selected]) dots[selected].classList.add('active');
                };

                emblaApi.on('select', onSelect);
                emblaApi.on('reInit', onSelect);
            });
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
        NavigationHandler.init();
        ScrollHandler.init();
        ModalHandler.init();
        AnimationHandler.init();
        PortfolioHandler.init();
        ProductSliderHandler.init();
        FAQHandler.init();
        SliderHandler.init();
        AdvantagesSliderHandler.init();
        FormHandler.init();
        YearHandler.init();
        PricingHandler.init();
    });

    // Reinitialize advantages slider on resize
    window.addEventListener('resize', () => {
        if (window.innerWidth < 768) {
            const dotsContainer = document.querySelector('.advantages-dots');
            if (dotsContainer && dotsContainer.children.length === 0) {
                AdvantagesSliderHandler.init();
            }
        }
    });
})();