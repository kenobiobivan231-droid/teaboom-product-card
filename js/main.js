/**
 * =============================================================================
 * Teaboom.ru — Product Card Component Script
 * Vanilla JavaScript (ES6+), Modular Architecture, High Accessibility
 * =============================================================================
 */

(function () {
  'use strict';

  /**
   * Product Packaging Data Source
   * Exact data specifications according to task guidelines:
   * 100g: 01306, 349,20 ₽ → 326,40 ₽
   * 500g: 01307, 1 646 ₽ → 1 432 ₽
   * 1000g: 01308, 2 592 ₽ → 2 064 ₽
   * 5000g: 01309, 8 710 ₽ → 6 320 ₽
   */
  const PRODUCT_DATA = {
    title: 'Ананасовый улун',
    category: 'Китайский светлый ароматизированный улун',
    variants: {
      '100': {
        weight: '100 г',
        weightNumeric: 100,
        sku: '01306',
        priceNumeric: 326.4,
        oldPriceNumeric: 349.2,
        priceDisplay: '326,40',
        oldPriceDisplay: '349,20',
        discountPercent: 7,
        savingsDisplay: '22,80',
        unitPriceDisplay: '326,40 ₽ / 100 г'
      },
      '500': {
        weight: '500 г',
        weightNumeric: 500,
        sku: '01307',
        priceNumeric: 1432,
        oldPriceNumeric: 1646,
        priceDisplay: '1 432',
        oldPriceDisplay: '1 646',
        discountPercent: 13,
        savingsDisplay: '214',
        unitPriceDisplay: '286,40 ₽ / 100 г'
      },
      '1000': {
        weight: '1000 г',
        weightNumeric: 1000,
        sku: '01308',
        priceNumeric: 2064,
        oldPriceNumeric: 2592,
        priceDisplay: '2 064',
        oldPriceDisplay: '2 592',
        discountPercent: 20,
        savingsDisplay: '528',
        unitPriceDisplay: '206,40 ₽ / 100 г'
      },
      '5000': {
        weight: '5000 г',
        weightNumeric: 5000,
        sku: '01309',
        priceNumeric: 6320,
        oldPriceNumeric: 8710,
        priceDisplay: '6 320',
        oldPriceDisplay: '8 710',
        discountPercent: 27,
        savingsDisplay: '2 390',
        unitPriceDisplay: '126,40 ₽ / 100 г'
      }
    }
  };

  /**
   * DOM Elements Cache
   */
  const elements = {
    // Packaging
    packagingInputs: document.querySelectorAll('input[name="packaging-weight"]'),
    selectedWeightText: document.getElementById('selected-weight-display'),

    // SKU & Meta
    skuValue: document.getElementById('product-sku-value'),

    // Pricing
    priceBlock: document.querySelector('.product-price'),
    priceValue: document.getElementById('product-price-current'),
    oldPriceValue: document.getElementById('product-price-old'),
    discountBadge: document.getElementById('product-discount-badge'),
    savingsValue: document.getElementById('product-savings-value'),
    unitPriceValue: document.getElementById('product-unit-price'),

    // Quantity
    quantityInput: document.getElementById('quantity-input'),
    quantityMinusBtn: document.getElementById('quantity-minus'),
    quantityPlusBtn: document.getElementById('quantity-plus'),

    // Actions
    addToCartBtn: document.getElementById('btn-add-to-cart'),
    addToCartText: document.getElementById('btn-add-to-cart-text'),
    favoriteBtn: document.getElementById('btn-favorite'),
    shareBtn: document.getElementById('btn-share'),

    // Header Counters
    headerCartBadge: document.getElementById('header-cart-badge'),
    headerWishlistBadge: document.getElementById('header-wishlist-badge'),

    // Gallery
    galleryMain: document.getElementById('gallery-main'),
    galleryMainImg: document.getElementById('gallery-main-img'),
    galleryThumbnails: document.querySelectorAll('.gallery__thumb-btn'),
    lightbox: document.getElementById('gallery-lightbox'),
    lightboxImg: document.getElementById('lightbox-img'),
    lightboxClose: document.getElementById('lightbox-close'),
    galleryZoomBtn: document.getElementById('gallery-zoom-btn'),

    // Accordions
    accordionHeaders: document.querySelectorAll('.tea-specs__accordion-header'),

    // Toast Notification
    toast: document.getElementById('action-toast'),
    toastTitle: document.getElementById('toast-title'),
    toastMessage: document.getElementById('toast-message'),
    toastClose: document.getElementById('toast-close'),

    // Sticky Bar (Mobile)
    stickyBar: document.getElementById('mobile-sticky-bar'),
    stickyPrice: document.getElementById('sticky-price'),
    stickyMeta: document.getElementById('sticky-meta'),
    stickyBtn: document.getElementById('sticky-cart-btn')
  };

  // State
  let currentWeight = '100';
  let cartTotalCount = 0;
  let isFavorite = false;
  let toastTimeoutId = null;

  /**
   * Format currency values nicely
   * @param {number} value
   * @returns {string}
   */
  function formatRubles(value) {
    return new Intl.NumberFormat('ru-RU', {
      maximumFractionDigits: 2,
      minimumFractionDigits: value % 1 === 0 ? 0 : 2
    }).format(value);
  }

  /**
   * Update all elements when packaging is selected
   * @param {string} weightKey
   */
  function setPackaging(weightKey) {
    const variant = PRODUCT_DATA.variants[weightKey];
    if (!variant) return;

    currentWeight = weightKey;

    // 1. Update SKU
    if (elements.skuValue) {
      elements.skuValue.textContent = variant.sku;
    }

    // 2. Trigger price block update animation
    if (elements.priceBlock) {
      elements.priceBlock.classList.remove('is-updating');
      // Reflow trigger for css animation replay
      void elements.priceBlock.offsetWidth;
      elements.priceBlock.classList.add('is-updating');
    }

    // 3. Update Prices
    if (elements.priceValue) {
      elements.priceValue.textContent = variant.priceDisplay;
    }

    if (elements.oldPriceValue) {
      elements.oldPriceValue.textContent = variant.oldPriceDisplay;
    }

    if (elements.discountBadge) {
      elements.discountBadge.textContent = `-${variant.discountPercent}%`;
    }

    if (elements.savingsValue) {
      elements.savingsValue.textContent = `Экономия: ${variant.savingsDisplay} ₽`;
    }

    if (elements.unitPriceValue) {
      elements.unitPriceValue.textContent = variant.unitPriceDisplay;
    }

    // 4. Update legend display
    if (elements.selectedWeightText) {
      elements.selectedWeightText.textContent = variant.weight;
    }

    // 5. Update mobile sticky bar
    if (elements.stickyPrice) {
      elements.stickyPrice.textContent = `${variant.priceDisplay} ₽`;
    }
    if (elements.stickyMeta) {
      elements.stickyMeta.textContent = `${PRODUCT_DATA.title} (${variant.weight}, арт. ${variant.sku})`;
    }
  }

  /**
   * Quantity Stepper Controller
   */
  function initQuantityControls() {
    if (!elements.quantityInput) return;

    const updateMinusState = () => {
      const val = parseInt(elements.quantityInput.value, 10) || 1;
      if (elements.quantityMinusBtn) {
        elements.quantityMinusBtn.disabled = val <= 1;
      }
    };

    if (elements.quantityMinusBtn) {
      elements.quantityMinusBtn.addEventListener('click', () => {
        let val = parseInt(elements.quantityInput.value, 10) || 1;
        if (val > 1) {
          elements.quantityInput.value = val - 1;
          updateMinusState();
        }
      });
    }

    if (elements.quantityPlusBtn) {
      elements.quantityPlusBtn.addEventListener('click', () => {
        let val = parseInt(elements.quantityInput.value, 10) || 1;
        if (val < 99) {
          elements.quantityInput.value = val + 1;
          updateMinusState();
        }
      });
    }

    elements.quantityInput.addEventListener('change', () => {
      let val = parseInt(elements.quantityInput.value, 10);
      if (isNaN(val) || val < 1) val = 1;
      if (val > 99) val = 99;
      elements.quantityInput.value = val;
      updateMinusState();
    });

    updateMinusState();
  }

  /**
   * Toast notification helper
   * @param {string} title
   * @param {string} message
   */
  function showToast(title, message) {
    if (!elements.toast) return;

    if (elements.toastTitle) elements.toastTitle.textContent = title;
    if (elements.toastMessage) elements.toastMessage.textContent = message;

    elements.toast.classList.add('is-visible');

    if (toastTimeoutId) {
      clearTimeout(toastTimeoutId);
    }

    toastTimeoutId = setTimeout(() => {
      elements.toast.classList.remove('is-visible');
    }, 3600);
  }

  if (elements.toastClose) {
    elements.toastClose.addEventListener('click', () => {
      elements.toast.classList.remove('is-visible');
    });
  }

  /**
   * Add To Cart Flow
   */
  function handleAddToCart() {
    const qty = parseInt(elements.quantityInput?.value, 10) || 1;
    const variant = PRODUCT_DATA.variants[currentWeight];
    if (!variant) return;

    cartTotalCount += qty;

    // Update header cart badge
    if (elements.headerCartBadge) {
      elements.headerCartBadge.textContent = cartTotalCount;
      elements.headerCartBadge.classList.add('bump');
      setTimeout(() => elements.headerCartBadge.classList.remove('bump'), 300);
    }

    // Button visual state
    if (elements.addToCartBtn) {
      elements.addToCartBtn.classList.add('is-added');
      if (elements.addToCartText) {
        elements.addToCartText.textContent = `В корзине (${qty} шт) ✓`;
      }

      setTimeout(() => {
        elements.addToCartBtn.classList.remove('is-added');
        if (elements.addToCartText) {
          elements.addToCartText.textContent = 'В корзину';
        }
      }, 2200);
    }

    // Also animate sticky mobile button if present
    if (elements.stickyBtn) {
      elements.stickyBtn.classList.add('is-added');
      const originalText = elements.stickyBtn.textContent;
      elements.stickyBtn.textContent = 'Добавлено ✓';
      setTimeout(() => {
        elements.stickyBtn.classList.remove('is-added');
        elements.stickyBtn.textContent = originalText;
      }, 2000);
    }

    // Total cost for notification
    const totalAmount = variant.priceNumeric * qty;
    const formattedTotal = formatRubles(totalAmount);

    showToast(
      'Товар добавлен в корзину!',
      `${PRODUCT_DATA.title} (${variant.weight}) × ${qty} шт. на сумму ${formattedTotal} ₽`
    );
  }

  /**
   * Wishlist / Favorite Toggle
   */
  function handleToggleFavorite() {
    isFavorite = !isFavorite;

    if (elements.favoriteBtn) {
      elements.favoriteBtn.classList.toggle('is-active', isFavorite);
      elements.favoriteBtn.setAttribute('aria-pressed', isFavorite ? 'true' : 'false');
    }

    if (elements.headerWishlistBadge) {
      elements.headerWishlistBadge.textContent = isFavorite ? '1' : '0';
      elements.headerWishlistBadge.classList.add('bump');
      setTimeout(() => elements.headerWishlistBadge.classList.remove('bump'), 300);
    }

    showToast(
      isFavorite ? 'Добавлено в избранное' : 'Удалено из избранного',
      isFavorite
        ? `${PRODUCT_DATA.title} сохранён в ваш список желаний.`
        : `${PRODUCT_DATA.title} удалён из списка желаний.`
    );
  }

  /**
   * Share Button
   */
  function handleShare() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('Ссылка скопирована', 'Адрес страницы скопирован в буфер обмена.');
      }).catch(() => {
        showToast('Поделиться товаром', window.location.href);
      });
    } else {
      showToast('Поделиться товаром', window.location.href);
    }
  }

  /**
   * Interactive Gallery & Lightbox
   */
  function initGallery() {
    // Thumbnails click
    elements.galleryThumbnails.forEach((btn) => {
      btn.addEventListener('click', () => {
        const fullSrc = btn.getAttribute('data-full-src');
        if (!fullSrc) return;

        elements.galleryThumbnails.forEach((t) => t.classList.remove('is-active'));
        btn.classList.add('is-active');

        if (elements.galleryMainImg) {
          elements.galleryMainImg.style.opacity = '0.4';
          setTimeout(() => {
            elements.galleryMainImg.src = fullSrc;
            elements.galleryMainImg.style.opacity = '1';
          }, 150);
        }
      });
    });

    // Zoom lens effect on desktop hover
    if (elements.galleryMain && elements.galleryMainImg) {
      elements.galleryMain.addEventListener('mousemove', (e) => {
        // Only run on desktop screens (>1024px)
        if (window.innerWidth < 1024) return;

        const rect = elements.galleryMain.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        elements.galleryMainImg.style.transformOrigin = `${x}% ${y}%`;
      });

      elements.galleryMain.addEventListener('mouseleave', () => {
        elements.galleryMainImg.style.transformOrigin = 'center center';
      });
    }

    // Lightbox open
    const openLightbox = () => {
      if (!elements.lightbox || !elements.lightboxImg || !elements.galleryMainImg) return;
      elements.lightboxImg.src = elements.galleryMainImg.src;
      elements.lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      if (!elements.lightbox) return;
      elements.lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
    };

    if (elements.galleryMain) {
      elements.galleryMain.addEventListener('click', (e) => {
        // Prevent opening if clicking on top action buttons
        if (e.target.closest('.gallery__floating-actions')) return;
        openLightbox();
      });
    }

    if (elements.galleryZoomBtn) {
      elements.galleryZoomBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openLightbox();
      });
    }

    if (elements.lightboxClose) {
      elements.lightboxClose.addEventListener('click', closeLightbox);
    }

    if (elements.lightbox) {
      elements.lightbox.addEventListener('click', (e) => {
        if (e.target === elements.lightbox) {
          closeLightbox();
        }
      });
    }

    // ESC key closes lightbox
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && elements.lightbox?.classList.contains('is-open')) {
        closeLightbox();
      }
    });
  }

  /**
   * Accordions for description & characteristics
   */
  function initAccordions() {
    elements.accordionHeaders.forEach((header) => {
      header.addEventListener('click', () => {
        const isExpanded = header.getAttribute('aria-expanded') === 'true';
        const contentId = header.getAttribute('aria-controls');
        const content = document.getElementById(contentId);

        if (!content) return;

        header.setAttribute('aria-expanded', !isExpanded);
        content.classList.toggle('is-open', !isExpanded);
      });
    });
  }

  /**
   * Mobile Sticky Bar Visibility via IntersectionObserver
   */
  function initStickyBar() {
    if (!elements.stickyBar || !elements.addToCartBtn) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // If the main CTA button is not intersecting (scrolled out of view)
          // and we scrolled down, show the sticky bar
          if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
            elements.stickyBar.classList.add('is-visible');
          } else {
            elements.stickyBar.classList.remove('is-visible');
          }
        });
      },
      { threshold: 0 }
    );

    observer.observe(elements.addToCartBtn);

    if (elements.stickyBtn) {
      elements.stickyBtn.addEventListener('click', handleAddToCart);
    }
  }

  /**
   * Initialize Everything on DOMContentLoaded
   */
  function init() {
    // 1. Packaging Radio Event Listeners
    elements.packagingInputs.forEach((input) => {
      input.addEventListener('change', (e) => {
        setPackaging(e.target.value);
      });
    });

    // 2. Quantity controls
    initQuantityControls();

    // 3. Actions
    if (elements.addToCartBtn) {
      elements.addToCartBtn.addEventListener('click', handleAddToCart);
    }

    if (elements.favoriteBtn) {
      elements.favoriteBtn.addEventListener('click', handleToggleFavorite);
    }

    if (elements.shareBtn) {
      elements.shareBtn.addEventListener('click', handleShare);
    }

    // 4. Gallery & Lightbox
    initGallery();

    // 5. Accordions
    initAccordions();

    // 6. Sticky Bar
    initStickyBar();

    // Initial load setup for default 100g variant
    setPackaging('100');
  }

  // Run when document is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
