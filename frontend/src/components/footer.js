/**
 * Composant Footer.
 */

export const renderFooter = () => {
  const container = document.getElementById('footer');
  container.innerHTML = `
    <footer class="bg-dark text-light text-center py-3 mt-5">
      <div class="container">
        <p class="mb-0">&copy; ${new Date().getFullYear()} Ma Boutique &mdash; Projet Full Stack</p>
      </div>
    </footer>
  `;
};
