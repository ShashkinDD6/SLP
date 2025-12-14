export function setupScrollListener(): void {
  window.addEventListener("scroll", (): void => {
    const scrollY: number = window.scrollY || window.pageYOffset;
    console.log("Scroll position:", scrollY);
  });
}

export default setupScrollListener;
