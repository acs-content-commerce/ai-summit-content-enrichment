import { createOptimizedPicture } from '../../scripts/aem.js';

function createModal() {
  const modal = document.createElement('div');
  modal.className = 'cards-modal';
  modal.innerHTML = `
    <div class="cards-modal-overlay"></div>
    <div class="cards-modal-content">
      <button class="cards-modal-close" aria-label="Close modal">&times;</button>
      <div class="cards-modal-body"></div>
    </div>
  `;
  document.body.appendChild(modal);
  return modal;
}

function setupTeamModals(block, ul) {
  const modal = createModal();
  const modalBody = modal.querySelector('.cards-modal-body');
  const modalOverlay = modal.querySelector('.cards-modal-overlay');
  const modalClose = modal.querySelector('.cards-modal-close');

  function closeModal() {
    modal.classList.remove('visible');
  }

  ul.querySelectorAll('li').forEach((li) => {
    const body = li.querySelector('.cards-card-body');
    if (!body) return;

    // Get all content after the first element (name/title) for the modal
    const allContent = [...body.children];
    const modalContent = allContent.slice(1); // Everything after the first element

    // Store modal content as data attribute
    if (modalContent.length > 0) {
      const modalHTML = modalContent.map((el) => el.outerHTML).join('');
      li.dataset.modalContent = modalHTML;

      // Hide the extra content in the card
      modalContent.forEach((el) => el.classList.add('cards-modal-hidden'));

      // Add cursor pointer to indicate clickable
      li.style.cursor = 'pointer';
    }

    // Click to open modal
    li.addEventListener('click', () => {
      if (li.dataset.modalContent) {
        modalBody.innerHTML = li.dataset.modalContent;
        modal.classList.add('visible');
      }
    });
  });

  // Close modal on overlay click
  modalOverlay.addEventListener('click', closeModal);

  // Close modal on close button click
  modalClose.addEventListener('click', closeModal);

  // Close modal on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.replaceChildren(ul);

  // Setup modals for team cards
  if (block.classList.contains('team')) {
    setupTeamModals(block, ul);

    // Add class for more than 5 cards to use standard 3-column layout
    const cardCount = ul.querySelectorAll('li').length;
    if (cardCount > 5) {
      block.classList.add('team-many');
    }
  }
}
