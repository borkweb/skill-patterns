(function () {
  'use strict';

  /* Theme toggle */
  var toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  /* Index search — filters cards by full-text data-search attribute */
  var search = document.getElementById('pattern-search');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.pcard'));
  if (search && cards.length) {
    var sections = Array.prototype.slice.call(document.querySelectorAll('.cat-section'));
    var noResults = document.getElementById('no-results');

    var applyFilter = function (q) {
      q = (q || '').trim().toLowerCase();
      var anyVisible = false;
      cards.forEach(function (c) {
        var match = q === '' || (c.getAttribute('data-search') || '').indexOf(q) !== -1;
        c.classList.toggle('is-hidden', !match);
        if (match) { anyVisible = true; }
      });
      sections.forEach(function (s) {
        s.classList.toggle('is-hidden', s.querySelectorAll('.pcard:not(.is-hidden)').length === 0);
      });
      if (noResults) { noResults.classList.toggle('is-hidden', anyVisible); }
    };

    search.addEventListener('input', function () { applyFilter(search.value); });

    document.addEventListener('keydown', function (e) {
      if (e.key === '/' && document.activeElement !== search) {
        e.preventDefault();
        search.focus();
      } else if (e.key === 'Escape' && document.activeElement === search) {
        search.value = '';
        applyFilter('');
      }
    });
  }

  /* Copy buttons (detail pages) */
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
