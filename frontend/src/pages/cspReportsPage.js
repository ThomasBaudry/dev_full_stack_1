import { fetchCspReports } from '../api/cspApi.js';
import { escapeHtml } from '../utils.js';

const formatDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? escapeHtml(String(value)) : date.toLocaleString('fr-FR');
};

const reportRow = (report) => `
  <tr class="border-b border-[#1a1a2666] align-top">
    <td class="px-4 py-3 text-zinc-300 text-xs">${escapeHtml(formatDate(report.created_at))}</td>
    <td class="px-4 py-3 text-zinc-300 text-xs">${escapeHtml(report.effective_directive || report.violated_directive || '-')}</td>
    <td class="px-4 py-3 text-zinc-400 text-xs break-all">${escapeHtml(report.blocked_uri || '-')}</td>
    <td class="px-4 py-3 text-zinc-500 text-xs break-all">${escapeHtml(report.document_uri || '-')}</td>
  </tr>
`;

export const renderCspReportsPage = async (container) => {
  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-6 py-10">
      <div class="mb-8">
        <p class="text-zinc-600 text-sm font-display uppercase tracking-widest mb-1">Securite</p>
        <h1 class="font-display font-extrabold text-3xl text-white tracking-tight">Rapports CSP</h1>
        <p class="text-zinc-500 text-sm mt-1">Dernieres violations detectees par le navigateur.</p>
      </div>
      <div class="flex justify-center py-20">
        <div class="w-8 h-8 border-2 border-[#c8f04a] border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  `;

  try {
    const reports = await fetchCspReports();
    const list = Array.isArray(reports) ? reports : [];

    if (list.length === 0) {
      container.innerHTML = `
        <div class="max-w-7xl mx-auto px-6 py-10">
          <div class="mb-8">
            <p class="text-zinc-600 text-sm font-display uppercase tracking-widest mb-1">Securite</p>
            <h1 class="font-display font-extrabold text-3xl text-white tracking-tight">Rapports CSP</h1>
          </div>
          <div class="rounded-2xl border border-[#1a1a26] bg-[#111118] p-8 text-center">
            <p class="text-zinc-400 text-sm">Aucune violation CSP enregistree.</p>
          </div>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="max-w-7xl mx-auto px-6 py-10">
        <div class="mb-8">
          <p class="text-zinc-600 text-sm font-display uppercase tracking-widest mb-1">Securite</p>
          <h1 class="font-display font-extrabold text-3xl text-white tracking-tight">Rapports CSP</h1>
          <p class="text-zinc-500 text-sm mt-1"><span class="text-zinc-300">${list.length}</span> rapport${list.length > 1 ? 's' : ''}</p>
        </div>

        <div class="overflow-x-auto rounded-2xl border border-[#1a1a26] bg-[#111118]">
          <table class="w-full min-w-[860px]">
            <thead class="bg-[#0f0f16] border-b border-[#1a1a26]">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-display font-semibold text-zinc-500 uppercase tracking-widest">Date</th>
                <th class="px-4 py-3 text-left text-xs font-display font-semibold text-zinc-500 uppercase tracking-widest">Directive</th>
                <th class="px-4 py-3 text-left text-xs font-display font-semibold text-zinc-500 uppercase tracking-widest">Ressource bloquee</th>
                <th class="px-4 py-3 text-left text-xs font-display font-semibold text-zinc-500 uppercase tracking-widest">Document</th>
              </tr>
            </thead>
            <tbody>
              ${list.map(reportRow).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `
      <div class="max-w-7xl mx-auto px-6 py-10">
        <div class="mb-8">
          <h1 class="font-display font-extrabold text-3xl text-white tracking-tight">Rapports CSP</h1>
        </div>
        <div class="rounded-2xl border border-red-900/40 bg-red-900/10 p-6 text-center">
          <p class="text-red-400 text-sm">Impossible de charger les rapports CSP.</p>
          <p class="text-red-500/60 text-xs mt-1">${escapeHtml(err.message || 'Erreur inconnue')}</p>
        </div>
      </div>
    `;
  }
};
