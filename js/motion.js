(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var selector = [
    ".showcase-card",
    ".work-row",
    ".labs-card",
    ".labs-build",
    ".labs-method-step",
    ".about-section-block",
    ".ct-card",
    ".cs-toc-target",
    ".idx-contact"
  ].join(",");

  var all = Array.prototype.slice.call(document.querySelectorAll(selector));
  var nodes = all.filter(function (el) {
    return !all.some(function (other) {
      return other !== el && el.contains(other);
    });
  });

  if (!nodes.length || !("IntersectionObserver" in window)) return;

  var groups = new Map();
  nodes.forEach(function (el) {
    var rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return;
    var onScreen = rect.top < window.innerHeight * 0.92 && rect.bottom > 72;
    if (onScreen) return;
    var list = groups.get(el.parentElement) || [];
    list.push(el);
    groups.set(el.parentElement, list);
  });

  if (!groups.size) return;

  document.documentElement.classList.add("motion");

  var observed = [];
  groups.forEach(function (list) {
    list.forEach(function (el, index) {
      el.classList.add("reveal");
      el.style.setProperty("--reveal-delay", Math.min(index, 3) * 80 + "ms");
      observed.push(el);
    });
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -6% 0px", threshold: 0 });

  observed.forEach(function (el) { observer.observe(el); });
})();
