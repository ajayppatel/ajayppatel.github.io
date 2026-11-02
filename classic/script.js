/* Minimal scroll fade-in */
(function () {
  'use strict';

  var els = document.querySelectorAll('.fade-in');
  if (!els.length) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in--visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  els.forEach(function (el) {
    observer.observe(el);
  });
})();
