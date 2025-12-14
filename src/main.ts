
const modal: HTMLElement | null = document.getElementById("modal");
const openBtn: HTMLElement | null = document.getElementById("openModal");
const closeBtn: HTMLElement | null = document.getElementById("closeModal");

// Open modal
openBtn?.addEventListener("click", (): void => {
  if (!modal) return;
  modal.classList.add("show");
});

// Close modal (button)
closeBtn?.addEventListener("click", (): void => {
  if (!modal) return;
  modal.classList.remove("show");
});

// Close modal with Escape key
window.addEventListener("keydown", (e: KeyboardEvent): void => {
  if (e.key === "Escape" && modal?.classList.contains("show")) {
    modal.classList.remove("show");
  }
});

// Close modal when clicking outside of it
window.addEventListener("click", (e: MouseEvent): void => {
  const target = e.target as HTMLElement;
  if (!modal) return;
  if (target === modal) {
    modal.classList.remove("show");
  }
});

// Scroll listener (primitive type used)
window.addEventListener("scroll", (): void => {
  const scrollY: number = window.scrollY || window.pageYOffset;
  // small debug so student can see scroll events
  // (in production you'd probably throttle/debounce)
  console.log("Scroll position:", scrollY);
});

interface Post {
  id: number;
  title: string;
  body: string;
}

const observerOptions: IntersectionObserverInit = { root: null, rootMargin: "0px", threshold: 0.15 };

const revealObserver: IntersectionObserver = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
  entries.forEach((entry: IntersectionObserverEntry): void => {
    const el = entry.target as HTMLElement;
    if (entry.isIntersecting) {
      el.classList.add("visible");
      revealObserver.unobserve(el);
    }
  });
}, observerOptions);

// Fetch sample posts and display them; uses primitive types and handles errors
fetch("https://jsonplaceholder.typicode.com/posts?_limit=6")
  .then((response: Response) => {
    if (!response.ok) throw new Error("Network response was not ok");
    return response.json();
  })
  .then((data: Post[]): void => {
    const container: HTMLElement | null = document.getElementById("posts");
    if (!container) return;

    data.forEach((post: Post): void => {
      const div: HTMLDivElement = document.createElement("div");
      div.innerHTML = `<h3>${escapeHtml(post.title)}</h3><p>${escapeHtml(post.body)}</p>`;
      div.setAttribute("data-id", String(post.id));
      // click toggles a highlight class
      div.addEventListener("click", (): void => {
        div.classList.toggle("highlight");
      });
      container.appendChild(div);
      // observe for reveal animation
      revealObserver.observe(div);
    });
  })
  .catch((err: Error) => console.error("Fetch error:", err.message));

// simple escape to avoid injecting HTML from remote data
function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#039;");
}

// Additional interactive demo: smooth scroll to top on double-click header
const headerEl: HTMLElement | null = document.getElementById("header");
headerEl?.addEventListener("dblclick", (): void => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
