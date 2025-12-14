import { Post } from "../types/post";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function loadPosts(containerId = "posts", limit = 6): Promise<void> {
  const container: HTMLElement | null = document.getElementById(containerId);
  if (!container) return;

  const observerOptions: IntersectionObserverInit = { root: null, rootMargin: "0px", threshold: 0.15 };
  const revealObserver = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry: IntersectionObserverEntry): void => {
      const el = entry.target as HTMLElement;
      if (entry.isIntersecting) {
        el.classList.add("visible");
        revealObserver.unobserve(el);
      }
    });
  }, observerOptions);

  try {
    const resp: Response = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=${limit}`);
    if (!resp.ok) throw new Error("Network response was not ok");
    const data: Post[] = await resp.json();

    data.forEach((post: Post): void => {
      const div: HTMLDivElement = document.createElement("div");
      div.innerHTML = `<h3>${escapeHtml(post.title)}</h3><p>${escapeHtml(post.body)}</p>`;
      div.setAttribute("data-id", String(post.id));
      div.addEventListener("click", (): void => {
        div.classList.toggle("highlight");
      });
      container.appendChild(div);
      revealObserver.observe(div);
    });
  } catch (err) {
    const message: string = err instanceof Error ? err.message : String(err);
    console.error("Fetch error:", message);
  }
}

export default loadPosts;
