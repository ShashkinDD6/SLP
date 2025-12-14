"use strict";
const modal = document.getElementById("modal");
const openBtn = document.getElementById("openModal");
const closeBtn = document.getElementById("closeModal");
// Open modal
openBtn === null || openBtn === void 0 ? void 0 : openBtn.addEventListener("click", () => {
    if (!modal)
        return;
    modal.classList.add("show");
});
// Close modal (button)
closeBtn === null || closeBtn === void 0 ? void 0 : closeBtn.addEventListener("click", () => {
    if (!modal)
        return;
    modal.classList.remove("show");
});
// Close modal with Escape key
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && (modal === null || modal === void 0 ? void 0 : modal.classList.contains("show"))) {
        modal.classList.remove("show");
    }
});
// Close modal when clicking outside of it
window.addEventListener("click", (e) => {
    const target = e.target;
    if (!modal)
        return;
    if (target === modal) {
        modal.classList.remove("show");
    }
});
// Scroll listener (primitive type used)
window.addEventListener("scroll", () => {
    const scrollY = window.scrollY || window.pageYOffset;
    // small debug so student can see scroll events
    // (in production you'd probably throttle/debounce)
    console.log("Scroll position:", scrollY);
});
const observerOptions = { root: null, rootMargin: "0px", threshold: 0.15 };
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        const el = entry.target;
        if (entry.isIntersecting) {
            el.classList.add("visible");
            revealObserver.unobserve(el);
        }
    });
}, observerOptions);
// Fetch sample posts and display them; uses primitive types and handles errors
fetch("https://jsonplaceholder.typicode.com/posts?_limit=6")
    .then((response) => {
    if (!response.ok)
        throw new Error("Network response was not ok");
    return response.json();
})
    .then((data) => {
    const container = document.getElementById("posts");
    if (!container)
        return;
    data.forEach((post) => {
        const div = document.createElement("div");
        div.innerHTML = `<h3>${escapeHtml(post.title)}</h3><p>${escapeHtml(post.body)}</p>`;
        div.setAttribute("data-id", String(post.id));
        // click toggles a highlight class
        div.addEventListener("click", () => {
            div.classList.toggle("highlight");
        });
        container.appendChild(div);
        // observe for reveal animation
        revealObserver.observe(div);
    });
})
    .catch((err) => console.error("Fetch error:", err.message));
// simple escape to avoid injecting HTML from remote data
function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#039;");
}
// Additional interactive demo: smooth scroll to top on double-click header
const headerEl = document.getElementById("header");
headerEl === null || headerEl === void 0 ? void 0 : headerEl.addEventListener("dblclick", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});
