/**
 * Module Panier côté client — stockage localStorage.
 * Le panier est un tableau d'objets { productId, name, price, image, quantity }.
 * Toutes les fonctions sont pures ou retournent le nouveau panier.
 */

const CART_KEY = 'cart';

/** Lit le panier depuis localStorage. */
export const getCart = () => JSON.parse(localStorage.getItem(CART_KEY) || '[]');

/** Sauvegarde le panier dans localStorage. */
const saveCart = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent('cart-updated', { detail: cart }));
  return cart;
};

/** Ajoute un produit au panier (ou incrémente la quantité). */
export const addToCart = (product) => {
  const cart = getCart();
  const idx = cart.findIndex((item) => item.productId === product.id);
  return idx >= 0
    ? saveCart(cart.map((item, i) =>
        i === idx ? { ...item, quantity: item.quantity + 1 } : item,
      ))
    : saveCart([
        ...cart,
        {
          productId: product.id,
          name: product.libelle || product.name,
          price: product.prix || product.price,
          image: (product.images && product.images[0]) || '',
          quantity: 1,
        },
      ]);
};

/** Retire un produit du panier. */
export const removeFromCart = (productId) =>
  saveCart(getCart().filter((item) => item.productId !== productId));

/** Met à jour la quantité d'un produit. Si qty <= 0, supprime l'article. */
export const updateQuantity = (productId, quantity) =>
  quantity <= 0
    ? removeFromCart(productId)
    : saveCart(
        getCart().map((item) =>
          item.productId === productId ? { ...item, quantity } : item,
        ),
      );

/** Vide entièrement le panier. */
export const clearCart = () => saveCart([]);

/** Retourne le nombre total d'articles dans le panier. */
export const getCartCount = () =>
  getCart().reduce((sum, item) => sum + item.quantity, 0);

/** Retourne le montant total du panier. */
export const getCartTotal = () =>
  getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
