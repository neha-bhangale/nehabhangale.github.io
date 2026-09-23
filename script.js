/* ==========================================================================
   NEHA BHANGALE — PORTFOLIO SCRIPT
   Organized into small, independent features. Each one is wrapped so that
   if one part fails, the rest of the page still works.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ------------------------------------------------------------------
     1. MOBILE HAMBURGER MENU
     ------------------------------------------------------------------ */
  var navToggle = document.getElementById('nav-toggle');
  var navMenu = document.getElementById('nav-menu');

  function closeMenu() {
    navMenu.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
  }

  function openMenu() {
    navMenu.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Close menu');
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      var isOpen = navMenu.classList.contains('is-open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close the menu whenever a link inside it is clicked (mobile only)
    navMenu.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Close the menu if someone clicks outside of it
    document.addEventListener('click', function (event) {
      var clickedInsideNav = navMenu.contains(event.target) || navToggle.contains(event.target);
      if (!clickedInsideNav) {
        closeMenu();
      }
    });

    // Close the menu with the Escape key
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeMenu();
      }
    });
  }


  /* ------------------------------------------------------------------
     2. NAVBAR APPEARANCE ON SCROLL + ACTIVE LINK HIGHLIGHTING
     ------------------------------------------------------------------ */
  var header = document.getElementById('site-header');
  var navLinks = document.querySelectorAll('.nav-link');
  var sections = [];

  // Build a list of {id, link, element} for every section the navbar points to
  navLinks.forEach(function (link) {
    var id = link.getAttribute('href').replace('#', '');
    var section = document.getElementById(id);
    if (section) {
      sections.push({ id: id, link: link, element: section });
    }
  });

  function updateHeaderShadow() {
    if (window.scrollY > 8) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  // Helper so the "active section" check lines up with the sticky header height
  function scrollOffset() {
    return (header ? header.offsetHeight : 0) + 40;
  }

  function updateActiveLinkSafe() {
    var scrollPos = window.scrollY + scrollOffset();
    var current = sections[0];

    sections.forEach(function (item) {
      if (item.element.offsetTop <= scrollPos) {
        current = item;
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('is-active');
    });
    if (current) {
      current.link.classList.add('is-active');
    }
  }

  if (header) {
    window.addEventListener('scroll', function () {
      updateHeaderShadow();
      updateActiveLinkSafe();
    });
    updateHeaderShadow();
    updateActiveLinkSafe();
  }


  /* ------------------------------------------------------------------
     3. FADE-IN ON SCROLL (IntersectionObserver)
     ------------------------------------------------------------------ */
  var revealItems = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealItems.length) {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  } else {
    // No IntersectionObserver support (very old browser): just show everything
    revealItems.forEach(function (item) {
      item.classList.add('is-visible');
    });
  }


  /* ------------------------------------------------------------------
     4. CONTACT FORM VALIDATION
     No backend exists, so this only checks the fields and shows a
     confirmation message. It does not send an email anywhere.
     ------------------------------------------------------------------ */
  var form = document.getElementById('contact-form');
  var successMessage = document.getElementById('form-success');

  function setFieldError(fieldId, errorId, message) {
    var field = document.getElementById(fieldId);
    var errorEl = document.getElementById(errorId);
    var wrapper = field.closest('.form-field');

    errorEl.textContent = message;
    if (message) {
      wrapper.classList.add('has-error');
    } else {
      wrapper.classList.remove('has-error');
    }
  }

  function isValidEmail(value) {
    // Simple, readable pattern: something@something.something
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var nameField = document.getElementById('contact-name');
      var emailField = document.getElementById('contact-email');
      var messageField = document.getElementById('contact-message');

      var isValid = true;

      if (nameField.value.trim().length < 2) {
        setFieldError('contact-name', 'contact-name-error', 'Please enter your name.');
        isValid = false;
      } else {
        setFieldError('contact-name', 'contact-name-error', '');
      }

      if (!isValidEmail(emailField.value.trim())) {
        setFieldError('contact-email', 'contact-email-error', 'Please enter a valid email address.');
        isValid = false;
      } else {
        setFieldError('contact-email', 'contact-email-error', '');
      }

      if (messageField.value.trim().length < 10) {
        setFieldError('contact-message', 'contact-message-error', 'Please write a little more (at least 10 characters).');
        isValid = false;
      } else {
        setFieldError('contact-message', 'contact-message-error', '');
      }

      if (isValid) {
        successMessage.hidden = false;
        form.reset();
        // Move focus to the confirmation so screen reader users hear it
        successMessage.setAttribute('tabindex', '-1');
        successMessage.focus();
      } else {
        successMessage.hidden = true;
      }
    });
  }

});
