export const getDeleteProductModalTemplate = () => `
  <div id="delete-modal" class="fixed inset-0 z-50 hidden items-center justify-center bg-[rgba(10,10,15,0.85)] backdrop-blur-[6px]">
    <div class="bg-[#111118] border border-[#252535] rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 opacity-0 [animation:slideIn_0.35s_cubic-bezier(0.16,1,0.3,1)_forwards]">
      <div class="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center
                  justify-center mx-auto mb-5">
        <svg class="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165
               L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772
               5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114
               1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964
               51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
        </svg>
      </div>
      <h3 class="font-display font-bold text-lg text-white text-center mb-2">Supprimer ce produit ?</h3>
      <p class="text-zinc-500 text-sm text-center mb-6">
        <span class="text-zinc-300 font-medium" id="delete-product-name">—</span>
        sera définitivement supprimé. Cette action est irréversible.
      </p>
      <div class="flex gap-3">
        <button id="delete-cancel"
          class="flex-1 py-2.5 rounded-xl border border-[#252535] text-zinc-400
                 hover:bg-[#1a1a26] hover:text-white transition-all duration-200 text-sm font-medium">
          Annuler
        </button>
        <button id="delete-confirm"
          class="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500
                 text-white transition-all duration-200 text-sm font-display font-semibold">
          Supprimer
        </button>
      </div>
    </div>
  </div>
`;
