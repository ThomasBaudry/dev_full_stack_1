/**
 * Store Panier — localStorage.
 * Le panier est un tableau d'objets { productId, name, price, image, quantity }.
 */

const CART_KEY = 'cart';

/** Lit le panier. */
export const getCart = () => JSON.parse(localStorage.getItem(CART_KEY) || '[]');

/** Sauvegarde le panier et émet un événement. */
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
          name: product.libelle || product.label || product.name,
          price: product.prix || product.price,
          image: (product.images && product.images[0]) || '',
          quantity: 1,
        },
      ]);
};

/** Retire un produit du panier. */
export const removeFromCart = (productId) =>
  saveCart(getCart().filter((item) => item.productId !== productId));

/** Met à jour la quantité. Si qty <= 0, supprime. */
export const updateQuantity = (productId, quantity) =>
  quantity <= 0
    ? removeFromCart(productId)
    : saveCart(
        getCart().map((item) =>
          item.productId === productId ? { ...item, quantity } : item,
        ),
      );

/** Vide le panier. */
export const clearCart = () => saveCart([]);

/** Nombre total d'articles. */
export const getCartCount = () =>
  getCart().reduce((sum, item) => sum + item.quantity, 0);

/** Montant total. */
export const getCartTotal = () =>
  getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
