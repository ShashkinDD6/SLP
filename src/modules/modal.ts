/* Modal module
   Exports setupModal which wires modal open/close behavior
*/
export function setupModal(modalId = "modal", openId = "openModal", closeId = "closeModal"): void {
  const modal: HTMLElement | null = document.getElementById(modalId);
  const openBtn: HTMLElement | null = document.getElementById(openId);
  const closeBtn: HTMLElement | null = document.getElementById(closeId);

  function open(): void {
    if (!modal) return;
    modal.classList.add("show");
  }

  function close(): void {
    if (!modal) return;
    modal.classList.remove("show");
  }

  openBtn?.addEventListener("click", (): void => open());
  closeBtn?.addEventListener("click", (): void => close());

  // Close on Escape
  window.addEventListener("keydown", (e: KeyboardEvent): void => {
    if (e.key === "Escape" && modal?.classList.contains("show")) close();
  });

  // Click outside modal to close (if clicking the modal wrapper itself)
  window.addEventListener("click", (e: MouseEvent): void => {
    const target = e.target as HTMLElement;
    if (!modal) return;
    if (target === modal) close();
  });
}

export default setupModal;
