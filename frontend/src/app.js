import { renderDashboard } from "./pages/dashboardPage.js";

export function renderApp() {
  const root = document.querySelector("#app");
  if (!root) return;

  renderDashboard(root); // Temporaire pour voir le dashboard
  /*root.innerHTML = `
    <main class="container">
      <h1>Hello World</h1>
    </main>
  `;*/
}