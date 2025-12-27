/**
 * FemalePosture.com - Main JavaScript
 * Mobile-first, minimal animations, performance focused
 */

(function() {
  'use strict';

  // ==========================================================================
  // Mobile Navigation
  // ==========================================================================

  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navMobile = document.getElementById('nav-mobile');
  const menuIcon = mobileMenuBtn?.querySelector('.menu-icon');
  const closeIcon = mobileMenuBtn?.querySelector('.close-icon');

  if (mobileMenuBtn && navMobile) {
    mobileMenuBtn.addEventListener('click', function() {
      const isOpen = navMobile.classList.toggle('open');

      mobileMenuBtn.setAttribute('aria-expanded', isOpen);

      // Toggle icons
      if (menuIcon && closeIcon) {
        menuIcon.classList.toggle('hidden', isOpen);
        closeIcon.classList.toggle('hidden', !isOpen);
      }

      // Prevent body scroll when menu is open
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when clicking on a link
    navMobile.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        navMobile.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';

        if (menuIcon && closeIcon) {
          menuIcon.classList.remove('hidden');
          closeIcon.classList.add('hidden');
        }
      });
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && navMobile.classList.contains('open')) {
        navMobile.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';

        if (menuIcon && closeIcon) {
          menuIcon.classList.remove('hidden');
          closeIcon.classList.add('hidden');
        }
      }
    });
  }

  // ==========================================================================
  // Header Scroll Effect
  // ==========================================================================

  const siteHeader = document.getElementById('site-header');
  let lastScrollY = 0;

  if (siteHeader) {
    window.addEventListener('scroll', function() {
      const currentScrollY = window.scrollY;

      // Add shadow on scroll
      if (currentScrollY > 10) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }

      lastScrollY = currentScrollY;
    }, { passive: true });
  }

  // ==========================================================================
  // Smooth scroll for anchor links
  // ==========================================================================

  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');

      if (targetId === '#') return;

      const target = document.querySelector(targetId);

      if (target) {
        e.preventDefault();

        const headerHeight = siteHeader?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Update URL without scrolling
        history.pushState(null, null, targetId);
      }
    });
  });

  // ==========================================================================
  // External links - open in new tab
  // ==========================================================================

  document.querySelectorAll('a').forEach(function(link) {
    const href = link.getAttribute('href');

    if (href && href.startsWith('http') && !href.includes(window.location.hostname)) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });

  // ==========================================================================
  // Copy code blocks
  // ==========================================================================

  document.querySelectorAll('pre code').forEach(function(codeBlock) {
    const pre = codeBlock.parentElement;
    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';

    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    const copyButton = document.createElement('button');
    copyButton.className = 'btn btn-sm';
    copyButton.textContent = 'Copy';
    copyButton.style.position = 'absolute';
    copyButton.style.top = '0.5rem';
    copyButton.style.right = '0.5rem';
    copyButton.style.fontSize = '0.75rem';
    copyButton.style.padding = '0.25rem 0.5rem';

    wrapper.appendChild(copyButton);

    copyButton.addEventListener('click', function() {
      navigator.clipboard.writeText(codeBlock.textContent).then(function() {
        copyButton.textContent = 'Copied!';
        setTimeout(function() {
          copyButton.textContent = 'Copy';
        }, 2000);
      });
    });
  });

  // ==========================================================================
  // Lazy load images
  // ==========================================================================

  if ('loading' in HTMLImageElement.prototype) {
    // Browser supports native lazy loading
    document.querySelectorAll('img[data-src]').forEach(function(img) {
      img.src = img.dataset.src;
    });
  } else {
    // Fallback for older browsers
    const lazyImages = document.querySelectorAll('img[data-src]');

    if (lazyImages.length > 0) {
      const lazyImageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            lazyImageObserver.unobserve(img);
          }
        });
      });

      lazyImages.forEach(function(img) {
        lazyImageObserver.observe(img);
      });
    }
  }

  // ==========================================================================
  // Newsletter form handling
  // ==========================================================================

  const newsletterForms = document.querySelectorAll('.newsletter-form');

  newsletterForms.forEach(function(form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const input = form.querySelector('input[type="email"]');
      const button = form.querySelector('button');
      const originalText = button.textContent;

      // Simple validation
      if (!input.value || !input.value.includes('@')) {
        input.style.borderColor = '#E07A5F';
        return;
      }

      // Show loading state
      button.textContent = 'Subscribing...';
      button.disabled = true;

      // Simulate form submission (replace with actual endpoint)
      setTimeout(function() {
        button.textContent = 'Subscribed!';
        input.value = '';

        setTimeout(function() {
          button.textContent = originalText;
          button.disabled = false;
        }, 3000);
      }, 1000);
    });
  });

  // ==========================================================================
  // Table of Contents - Active state tracking
  // ==========================================================================

  const tocLinks = document.querySelectorAll('.toc-list a');
  const articleHeadings = document.querySelectorAll('.article-content h2, .article-content h3');

  if (tocLinks.length > 0 && articleHeadings.length > 0) {
    const observerOptions = {
      rootMargin: '-80px 0px -80% 0px'
    };

    const headingObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');

          tocLinks.forEach(function(link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            }
          });
        }
      });
    }, observerOptions);

    articleHeadings.forEach(function(heading) {
      headingObserver.observe(heading);
    });
  }

})();
