(function () {
  'use strict';

  /* Theme toggle */
  var toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  /* Search filter */
  var search = document.getElementById('pattern-search');
  var patterns = Array.prototype.slice.call(document.querySelectorAll('.pattern'));
  var catSections = Array.prototype.slice.call(document.querySelectorAll('.cat-section'));
  var sidebarCats = Array.prototype.slice.call(document.querySelectorAll('.sidebar-cat'));

  function applyFilter(q) {
    q = (q || '').trim().toLowerCase();
    var visibleByCat = {};
    patterns.forEach(function (el) {
      var match = q === '' || el.textContent.toLowerCase().indexOf(q) !== -1;
      el.classList.toggle('is-hidden', !match);
      if (match) { visibleByCat[el.getAttribute('data-cat')] = true; }
    });
    catSections.forEach(function (sec) {
      sec.classList.toggle('is-hidden', !visibleByCat[sec.getAttribute('data-cat')]);
    });
    sidebarCats.forEach(function (sc) {
      var cat = sc.getAttribute('data-cat');
      sc.classList.toggle('is-hidden', !visibleByCat[cat]);
      Array.prototype.forEach.call(sc.querySelectorAll('a[data-link]'), function (a) {
        var pat = document.getElementById(a.getAttribute('data-link'));
        var matched = pat && !pat.classList.contains('is-hidden');
        a.parentNode.classList.toggle('is-hidden', !matched);
      });
    });
  }

  if (search) {
    search.addEventListener('input', function () { applyFilter(search.value); });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && document.activeElement !== search) {
      e.preventDefault();
      if (search) search.focus();
    } else if (e.key === 'Escape' && document.activeElement === search) {
      search.value = '';
      applyFilter('');
    }
  });

  /* Scroll-spy: highlight the active pattern's sidebar link */
  var navLinks = {};
  Array.prototype.forEach.call(document.querySelectorAll('.sidebar-cat a[data-link]'), function (a) {
    navLinks[a.getAttribute('data-link')] = a;
  });
  if ('IntersectionObserver' in window && patterns.length) {
    var currentId = null;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          if (currentId && navLinks[currentId]) navLinks[currentId].classList.remove('is-active');
          currentId = entry.target.id;
          if (navLinks[currentId]) navLinks[currentId].classList.add('is-active');
        }
      });
    }, { rootMargin: '-80px 0px -70% 0px', threshold: 0 });
    patterns.forEach(function (p) { observer.observe(p); });
  }

  /* Copy buttons */
  function fallbackCopy(text, cb) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
    cb();
  }

  Array.prototype.forEach.call(document.querySelectorAll('.prompt__copy'), function (btn) {
    btn.addEventListener('click', function () {
      var pre = document.getElementById('prompt-' + btn.getAttribute('data-copy'));
      if (!pre) return;
      var text = pre.textContent;
      var done = function () {
        btn.textContent = 'Copied!';
        btn.classList.add('is-copied');
        setTimeout(function () {
          btn.textContent = 'Copy';
          btn.classList.remove('is-copied');
        }, 1500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function () { fallbackCopy(text, done); });
      } else {
        fallbackCopy(text, done);
      }
    });
  });
})();
