import { jest } from "@jest/globals";

// Mock de la couche base de données
const mockDbRun = jest.fn();
const mockDbGet = jest.fn();
const mockDbAll = jest.fn();

jest.unstable_mockModule("../src/config/db.js", () => ({
  dbRun: mockDbRun,
  dbGet: mockDbGet,
  dbAll: mockDbAll,
}));

const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductImage,
  getProductImages,
  getProductImageById,
  deleteProductImageById,
  deleteProductImages,
} = await import("../src/repositories/productsRepository.js");

describe("Products Repository", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Récupérations des produits

  describe("getAllProducts", () => {
    it("retourne tous les produits avec image_paths en tableau", async () => {
      mockDbAll.mockResolvedValue([
        {
          id: 1,
          label: "Produit A",
          price: 10,
          category: "cat1",
          image_paths: "/uploads/a.jpg,/uploads/b.jpg",
        },
        {
          id: 2,
          label: "Produit B",
          price: 20,
          category: "cat2",
          image_paths: null,
        },
      ]);

      const products = await getAllProducts();

      expect(mockDbAll).toHaveBeenCalledTimes(1);
      expect(products).toHaveLength(2);
      expect(products[0].image_paths).toEqual([
        "/uploads/a.jpg",
        "/uploads/b.jpg",
      ]);
      expect(products[1].image_paths).toEqual([]);
    });

    it("retourne un tableau vide quand il n'y a pas de produits", async () => {
      mockDbAll.mockResolvedValue([]);

      const products = await getAllProducts();

      expect(products).toEqual([]);
    });
  });

  // Récupération d'un produit par son ID

  describe("getProductById", () => {
    it("retourne le produit avec ses images", async () => {
      mockDbGet.mockResolvedValue({
        id: 1,
        label: "Produit A",
        price: 10,
        category: "cat1",
      });
      mockDbAll.mockResolvedValue([
        {
          id: 1,
          filename: "a.jpg",
          path: "/uploads/a.jpg",
          mime_type: "image/jpeg",
        },
      ]);

      const product = await getProductById(1);

      expect(mockDbGet).toHaveBeenCalledWith(
        "SELECT * FROM products WHERE id = ?",
        [1],
      );
      expect(product).toEqual({
        id: 1,
        label: "Produit A",
        price: 10,
        category: "cat1",
        images: [
          {
            id: 1,
            filename: "a.jpg",
            path: "/uploads/a.jpg",
            mime_type: "image/jpeg",
          },
        ],
      });
    });

    it("retourne null si le produit n'existe pas", async () => {
      mockDbGet.mockResolvedValue(undefined);

      const product = await getProductById(999);

      expect(product).toBeNull();
      expect(mockDbAll).not.toHaveBeenCalled();
    });
  });

  // Création d'un produit

  describe("createProduct", () => {
    it("insère un produit et retourne lastID", async () => {
      mockDbRun.mockResolvedValue({ lastID: 5, changes: 1 });

      const result = await createProduct({
        label: "Nouveau",
        description: "Desc",
        price: 29.99,
        category: "cat1",
      });

      expect(mockDbRun).toHaveBeenCalledWith(
        "INSERT INTO products (label, description, price, category) VALUES (?, ?, ?, ?)",
        ["Nouveau", "Desc", 29.99, "cat1"],
      );
      expect(result).toEqual({ lastID: 5, changes: 1 });
    });
  });

  // Modification d'un produit
  describe("updateProduct", () => {
    it("met à jour un produit existant", async () => {
      mockDbRun.mockResolvedValue({ lastID: 0, changes: 1 });

      const result = await updateProduct(1, {
        label: "Modifié",
        description: "Nouvelle desc",
        price: 15.5,
        category: "cat2",
      });

      expect(mockDbRun).toHaveBeenCalledWith(
        "UPDATE products SET label = ?, description = ?, price = ?, category = ? WHERE id = ?",
        ["Modifié", "Nouvelle desc", 15.5, "cat2", 1],
      );
      expect(result.changes).toBe(1);
    });
  });

  // Suppression d'un produit

  describe("deleteProduct", () => {
    it("supprime un produit par id", async () => {
      mockDbRun.mockResolvedValue({ lastID: 0, changes: 1 });

      const result = await deleteProduct(1);

      expect(mockDbRun).toHaveBeenCalledWith(
        "DELETE FROM products WHERE id = ?",
        [1],
      );
      expect(result.changes).toBe(1);
    });
  });

  // Ajout d'une image à un produit

  describe("addProductImage", () => {
    it("insère une image liée à un produit", async () => {
      mockDbRun.mockResolvedValue({ lastID: 10, changes: 1 });

      const result = await addProductImage({
        product_id: 1,
        filename: "img.jpg",
        path: "/uploads/img.jpg",
        mime_type: "image/jpeg",
      });

      expect(mockDbRun).toHaveBeenCalledWith(
        "INSERT INTO product_images (product_id, filename, path, mime_type) VALUES (?, ?, ?, ?)",
        [1, "img.jpg", "/uploads/img.jpg", "image/jpeg"],
      );
      expect(result.lastID).toBe(10);
    });
  });

  // Récupération de toutes les images liées à un produit

  describe("getProductImages", () => {
    it("retourne les images d'un produit", async () => {
      const images = [
        {
          id: 1,
          filename: "a.jpg",
          path: "/uploads/a.jpg",
          mime_type: "image/jpeg",
        },
        {
          id: 2,
          filename: "b.png",
          path: "/uploads/b.png",
          mime_type: "image/png",
        },
      ];
      mockDbAll.mockResolvedValue(images);

      const result = await getProductImages(1);

      expect(mockDbAll).toHaveBeenCalledWith(
        "SELECT * FROM product_images WHERE product_id = ? ORDER BY id ASC",
        [1],
      );
      expect(result).toEqual(images);
    });
  });

  // Récupération d'une image par son ID

  describe("getProductImageById", () => {
    it("retourne une image par son id", async () => {
      const image = { id: 1, product_id: 1, filename: "a.jpg", path: "/uploads/a.jpg", mime_type: "image/jpeg" };
      mockDbGet.mockResolvedValue(image);

      const result = await getProductImageById(1);

      expect(mockDbGet).toHaveBeenCalledWith(
        "SELECT * FROM product_images WHERE id = ?",
        [1],
      );
      expect(result).toEqual(image);
    });

    it("retourne undefined si l'image n'existe pas", async () => {
      mockDbGet.mockResolvedValue(undefined);

      const result = await getProductImageById(999);

      expect(result).toBeUndefined();
    });
  });

  // Suppression d'une image par son ID

  describe("deleteProductImageById", () => {
    it("supprime une image par son id", async () => {
      mockDbRun.mockResolvedValue({ lastID: 0, changes: 1 });

      const result = await deleteProductImageById(5);

      expect(mockDbRun).toHaveBeenCalledWith(
        "DELETE FROM product_images WHERE id = ?",
        [5],
      );
      expect(result.changes).toBe(1);
    });
  });

  // Suppression des images sur un produit

  describe("deleteProductImages", () => {
    it("supprime toutes les images d'un produit", async () => {
      mockDbRun.mockResolvedValue({ lastID: 0, changes: 3 });

      const result = await deleteProductImages(1);

      expect(mockDbRun).toHaveBeenCalledWith(
        "DELETE FROM product_images WHERE product_id = ?",
        [1],
      );
      expect(result.changes).toBe(3);
    });
  });
});
