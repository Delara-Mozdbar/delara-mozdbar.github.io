(function () {
  var toc = document.querySelector(".cs-toc");
  if (!toc) return;

  var links = Array.prototype.slice.call(toc.querySelectorAll('a[href^="#"]'));
  var sections = links
    .map(function (link) {
      return document.getElementById(link.getAttribute("href").slice(1));
    })
    .filter(Boolean);

  if (!sections.length) return;

  var list = toc.querySelector(".cs-toc-list");
  var activeId = "";

  function marker() {
    var styles = getComputedStyle(document.body);
    var nav = parseFloat(styles.getPropertyValue("--nav-h")) || 80;
    var bar = parseFloat(styles.getPropertyValue("--toc-bar")) || 0;
    return Math.max(nav + bar + 36, window.innerHeight * 0.34);
  }

  function reveal(link) {
    if (!list || list.scrollWidth <= list.clientWidth + 1) return;
    var item = link.parentElement;
    var itemRect = item.getBoundingClientRect();
    var listRect = list.getBoundingClientRect();
    var delta =
      itemRect.left + itemRect.width / 2 - (listRect.left + listRect.width / 2);
    list.scrollTo({ left: list.scrollLeft + delta, behavior: "smooth" });
  }

  function setActive(id) {
    if (!id || id === activeId) return;
    activeId = id;
    var current = null;
    links.forEach(function (link) {
      var on = link.getAttribute("href") === "#" + id;
      link.classList.toggle("is-active", on);
      if (on) {
        link.setAttribute("aria-current", "location");
        current = link;
      } else {
        link.removeAttribute("aria-current");
      }
    });
    if (current) reveal(current);
  }

  var frame = 0;
  function update() {
    frame = 0;
    var line = marker();
    var current = sections[0];
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].getBoundingClientRect().top <= line) current = sections[i];
    }
    var nearBottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    if (nearBottom) current = sections[sections.length - 1];
    setActive(current.id);
  }

  function requestUpdate() {
    if (frame) return;
    frame = window.requestAnimationFrame(update);
  }

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  update();
})();
