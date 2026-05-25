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

  /* Mobile sidebar drawer (opened by the header hamburger) */
  var sidebar = document.getElementById('sidebar');
  var hamburger = document.getElementById('nav-hamburger');
  var backdrop = document.getElementById('sidebar-backdrop');
  if (sidebar && hamburger) {
    var setDrawer = function (open) {
      sidebar.classList.toggle('is-open', open);
      if (backdrop) { backdrop.classList.toggle('is-visible', open); }
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
      hamburger.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      document.body.classList.toggle('nav-drawer-open', open);
    };
    hamburger.addEventListener('click', function () {
      setDrawer(!sidebar.classList.contains('is-open'));
    });
    if (backdrop) { backdrop.addEventListener('click', function () { setDrawer(false); }); }
    sidebar.addEventListener('click', function (e) {
      if (e.target.closest('a')) { setDrawer(false); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sidebar.classList.contains('is-open')) { setDrawer(false); }
    });
  }

  /* Index search — filters cards by full-text data-search attribute */
  /* Sidebar pattern filter (detail pages) */
  var search = document.getElementById('pattern-search');
  var sideItems = Array.prototype.slice.call(document.querySelectorAll('.sidebar-cat li'));
  if (search && sideItems.length) {
    var sideGroups = Array.prototype.slice.call(document.querySelectorAll('.sidebar-cat'));
    var sideEmpty = document.getElementById('sidebar-empty');

    var applyFilter = function (raw) {
      var q = (raw || '').trim().toLowerCase();
      var anyVisible = false;
      sideItems.forEach(function (li) {
        var a = li.querySelector('a');
        var match = q === '' || (a ? a.textContent.toLowerCase() : '').indexOf(q) !== -1;
        li.classList.toggle('is-hidden', !match);
        if (match) { anyVisible = true; }
      });
      sideGroups.forEach(function (g) {
        g.classList.toggle('is-hidden', g.querySelectorAll('li:not(.is-hidden)').length === 0);
      });
      if (sideEmpty) { sideEmpty.classList.toggle('is-hidden', anyVisible); }
    };

    var resetSearch = function () {
      search.value = '';
      applyFilter('');
      search.focus();
    };

    search.addEventListener('input', function () { applyFilter(search.value); });

    document.addEventListener('keydown', function (e) {
      if (e.key === '/' && document.activeElement !== search) {
        e.preventDefault();
        search.focus();
      } else if (e.key === 'Escape' && document.activeElement === search) {
        resetSearch();
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
