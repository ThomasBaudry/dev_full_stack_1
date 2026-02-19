import { writeFile, unlink, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname } from 'node:path';
import { v4 as uuidv4 } from 'uuid';
import * as productsRepo from '../repositories/productsRepository.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = join(__dirname, '../../uploads');

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

const MIME_TO_EXT = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

// Parse une image base64 du format "data:image/png;base64,iVBOR..."
const parseBase64Image = (dataUrl) => {
  const match = dataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!match) {
    const err = new Error('Format d\'image invalide');
    err.status = 422;
    throw err;
  }

  const mimeType = match[1];
  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    const err = new Error(`Type d'image non supporté : ${mimeType}. Types acceptés : jpeg, png, webp, gif`);
    err.status = 422;
    throw err;
  }

  const buffer = Buffer.from(match[2], 'base64');
  const ext = MIME_TO_EXT[mimeType];
  const filename = `${uuidv4()}${ext}`;

  return { buffer, filename, mimeType };
};

// Sauvegarde les images base64 sur le disque et retourne les métadonnées
const saveImages = async (images = []) => {
  await mkdir(UPLOADS_DIR, { recursive: true });
  const saved = [];

  for (let i = 0; i < images.length; i++) {
    const { buffer, filename, mimeType } = parseBase64Image(images[i]);
    const filePath = join(UPLOADS_DIR, filename);

    await writeFile(filePath, buffer);

    saved.push({
      filename,
      path: `/uploads/${filename}`,
      mime_type: mimeType,
    });
  }

  return saved;
};

// Supprime les fichiers images du disque
const removeImageFiles = async (images = []) => {
  const deletions = images.map((img) =>
    unlink(join(UPLOADS_DIR, img.filename)).catch(() => {})
  );
  await Promise.all(deletions);
};

export const listProducts = () =>
  productsRepo.getAllProducts();

export const getProduct = async (id) => {
  const product = await productsRepo.getProductById(id);
  if (!product) {
    const err = new Error('Produit non trouvé');
    err.status = 404;
    throw err;
  }
  return product;
};

export const createProduct = async ({ label, description, price, category, images }) => {
  const result = await productsRepo.createProduct({
    label,
    description,
    price: parseFloat(price),
    category,
  });

  const productId = result.lastID;

  // Sauvegarder les images si présentes
  const savedImages = await saveImages(images);
  for (const img of savedImages) {
    await productsRepo.addProductImage({ product_id: productId, ...img });
  }

  return productsRepo.getProductById(productId);
};

export const updateProduct = async (id, { label, description, price, category, images }) => {
  const existing = await productsRepo.getProductById(id);
  if (!existing) {
    const err = new Error('Produit non trouvé');
    err.status = 404;
    throw err;
  }

  await productsRepo.updateProduct(id, {
    label,
    description,
    price: parseFloat(price),
    category,
  });

  // Si de nouvelles images sont fournies, remplacer les anciennes
  if (images && images.length > 0) {
    const oldImages = await productsRepo.getProductImages(id);
    await productsRepo.deleteProductImages(id);
    await removeImageFiles(oldImages);

    const savedImages = await saveImages(images);
    for (const img of savedImages) {
      await productsRepo.addProductImage({ product_id: id, ...img });
    }
  }

  return productsRepo.getProductById(id);
};

export const deleteProduct = async (id) => {
  const existing = await productsRepo.getProductById(id);
  if (!existing) {
    const err = new Error('Produit non trouvé');
    err.status = 404;
    throw err;
  }

  const images = await productsRepo.getProductImages(id);
  await productsRepo.deleteProduct(id);
  await removeImageFiles(images);

  return { deleted: true };
};
