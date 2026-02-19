import { dbRun, dbGet, dbAll } from "../config/db.js";

export const getAllProducts = async () => {
  const products = await dbAll(`
    SELECT p.*, GROUP_CONCAT(pi.path) AS image_paths
    FROM products p
    LEFT JOIN product_images pi ON pi.product_id = p.id
    GROUP BY p.id
    ORDER BY p.id DESC
  `);

  return products.map((p) => ({
    ...p,
    image_paths: p.image_paths ? p.image_paths.split(",") : [],
  }));
};

export const getProductById = async (id) => {
  const product = await dbGet("SELECT * FROM products WHERE id = ?", [id]);
  if (!product) return null;

  const images = await dbAll(
    "SELECT id, filename, path, mime_type FROM product_images WHERE product_id = ?",
    [id],
  );

  return { ...product, images };
};

export const createProduct = ({ label, description, price, category }) =>
  dbRun(
    "INSERT INTO products (label, description, price, category) VALUES (?, ?, ?, ?)",
    [label, description, price, category],
  );

export const updateProduct = (id, { label, description, price, category }) =>
  dbRun(
    `UPDATE products SET label = ?, description = ?, price = ?, category = ? WHERE id = ?`,
    [label, description, price, category, id],
  );

export const deleteProduct = (id) =>
  dbRun("DELETE FROM products WHERE id = ?", [id]);

export const addProductImage = ({ product_id, filename, path, mime_type }) =>
  dbRun(
    "INSERT INTO product_images (product_id, filename, path, mime_type) VALUES (?, ?, ?, ?)",
    [product_id, filename, path, mime_type],
  );

export const getProductImages = (product_id) =>
  dbAll(
    "SELECT * FROM product_images WHERE product_id = ? ORDER BY id ASC",
    [product_id],
  );

export const getProductImageById = (id) =>
  dbGet("SELECT * FROM product_images WHERE id = ?", [id]);

export const deleteProductImageById = (id) =>
  dbRun("DELETE FROM product_images WHERE id = ?", [id]);

export const deleteProductImages = (product_id) =>
  dbRun("DELETE FROM product_images WHERE product_id = ?", [product_id]);
