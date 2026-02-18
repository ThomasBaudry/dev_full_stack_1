export const getAddProductModalTemplate = () => `
  <div id="add-modal" class="fixed inset-0 z-50 hidden items-center justify-center bg-[rgba(10,10,15,0.85)] backdrop-blur-[6px]">
    <div class="bg-[#111118] border border-[#252535] rounded-2xl shadow-2xl w-full max-w-lg mx-4
                opacity-0 [animation:slideIn_0.35s_cubic-bezier(0.16,1,0.3,1)_forwards] max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between px-6 py-4 border-b border-[#1a1a26] sticky top-0 bg-[#111118] z-10">
        <h3 class="font-display font-bold text-lg text-white">Ajouter un produit</h3>
        <button id="add-modal-close"
          class="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-600
                 hover:bg-[#1a1a26] hover:text-white transition-all duration-200">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      <div class="px-6 py-5 space-y-4">
        <div>
          <label class="block text-xs font-display font-semibold text-zinc-500 uppercase tracking-widest mb-2">
            Libellé <span class="text-[#c8f04a]">*</span>
          </label>
          <input id="add-f-label" type="text" placeholder="Nom du produit"
            class="w-full px-4 py-2.5 rounded-xl bg-[#1a1a26] border border-[#252535]
                   text-white placeholder-zinc-600 text-sm focus:outline-none
                   focus:border-[#c8f04a88] focus:ring-1 focus:ring-[#c8f04a22] transition-all duration-200" />
        </div>
        <div>
          <label class="block text-xs font-display font-semibold text-zinc-500 uppercase tracking-widest mb-2">
            Description <span class="text-[#c8f04a]">*</span>
          </label>
          <textarea id="add-f-description" rows="3" placeholder="Décrivez le produit..."
            class="w-full px-4 py-2.5 rounded-xl bg-[#1a1a26] border border-[#252535]
                   text-white placeholder-zinc-600 text-sm focus:outline-none
                   focus:border-[#c8f04a88] focus:ring-1 focus:ring-[#c8f04a22]
                   transition-all duration-200 resize-none"></textarea>
        </div>
        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="block text-xs font-display font-semibold text-zinc-500 uppercase tracking-widest mb-2">
              Prix (€) <span class="text-[#c8f04a]">*</span>
            </label>
            <input id="add-f-price" type="number" min="0" step="0.01" placeholder="0.00"
              class="w-full px-4 py-2.5 rounded-xl bg-[#1a1a26] border border-[#252535]
                     text-white placeholder-zinc-600 text-sm focus:outline-none
                     focus:border-[#c8f04a88] focus:ring-1 focus:ring-[#c8f04a22] transition-all duration-200" />
          </div>
          <div>
            <label class="block text-xs font-display font-semibold text-zinc-500 uppercase tracking-widest mb-2">
              Catégorie <span class="text-[#c8f04a]">*</span>
            </label>
            <input id="add-f-category" type="text" placeholder="Ex: Alimentation"
              class="w-full px-4 py-2.5 rounded-xl bg-[#1a1a26] border border-[#252535]
                     text-white placeholder-zinc-600 text-sm focus:outline-none
                     focus:border-[#c8f04a88] focus:ring-1 focus:ring-[#c8f04a22] transition-all duration-200" />
          </div>
          <div>
            <label class="block text-xs font-display font-semibold text-zinc-500 uppercase tracking-widest mb-2">
              Stock <span class="text-[#c8f04a]">*</span>
            </label>
            <input id="add-f-stock" type="number" min="0" step="1" placeholder="0"
              class="w-full px-4 py-2.5 rounded-xl bg-[#1a1a26] border border-[#252535]
                     text-white placeholder-zinc-600 text-sm focus:outline-none
                     focus:border-[#c8f04a88] focus:ring-1 focus:ring-[#c8f04a22] transition-all duration-200" />
          </div>
        </div>
        <div>
          <label class="block text-xs font-display font-semibold text-zinc-500 uppercase tracking-widest mb-2">
            Images <span class="text-zinc-600 normal-case font-normal">(max 5)</span>
          </label>
          <div class="border-2 border-dashed border-[#252535] rounded-xl p-5 text-center
                      hover:border-[#c8f04a66] hover:bg-[#c8f04a08] transition-all duration-200
                      cursor-pointer relative group">
            <input id="add-f-images" type="file" accept="image/*" multiple
              class="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
            <svg class="w-6 h-6 text-zinc-700 group-hover:text-[#c8f04a66] mx-auto mb-2 transition-colors duration-200"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0
                   0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
            </svg>
            <p class="text-zinc-600 text-xs">Glissez vos images ou <span class="text-[#c8f04a99]">parcourir</span></p>
          </div>
          <div id="add-image-previews" class="flex flex-wrap gap-2 mt-2"></div>
        </div>
        <p id="add-form-error" class="hidden text-red-400 text-xs py-2 px-3 rounded-lg bg-red-500/10 border border-red-500/20"></p>
        <div class="flex gap-3 pt-1">
          <button id="add-cancel"
            class="flex-1 py-2.5 rounded-xl border border-[#252535] text-zinc-400
                   hover:bg-[#1a1a26] hover:text-white transition-all duration-200 text-sm font-medium">
            Annuler
          </button>
          <button id="add-submit"
            class="flex-1 py-2.5 rounded-xl bg-[#c8f04a] hover:bg-[#b5e030] text-[#0a0a0f]
                   font-display font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-[#c8f04a22]">
            Ajouter
          </button>
        </div>
      </div>
    </div>
  </div>
`;
