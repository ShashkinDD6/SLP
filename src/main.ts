import setupModal from "./modules/modal";
import loadPosts from "./modules/posts";
import setupScrollListener from "./modules/scroll";

// Initialize all modules after DOM content loaded
document.addEventListener("DOMContentLoaded", (): void => {
  setupModal();
  void loadPosts();
  setupScrollListener();

  const headerEl: HTMLElement | null = document.getElementById("header");
  headerEl?.addEventListener("dblclick", (): void => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
