import { jest } from "@jest/globals";

// Mocks
const mockRepo = {
  getAllProducts: jest.fn(),
  getProductById: jest.fn(),
  createProduct: jest.fn(),
  updateProduct: jest.fn(),
  deleteProduct: jest.fn(),
  addProductImage: jest.fn(),
  getProductImages: jest.fn(),
  deleteProductImages: jest.fn(),
};

const mockWriteFile = jest.fn().mockResolvedValue(undefined);
const mockUnlink = jest.fn().mockResolvedValue(undefined);

jest.unstable_mockModule(
  "../src/repositories/productsRepository.js",
  () => mockRepo,
);

jest.unstable_mockModule("node:fs/promises", () => ({
  writeFile: mockWriteFile,
  unlink: mockUnlink,
}));

const {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = await import("../src/services/productsService.js");

// Image base64 minimale valide (1x1 pixel PNG)
const VALID_BASE64_PNG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

describe("Products Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Listes de tous les produits

  describe("listProducts", () => {
    it("délègue à getAllProducts du repository", async () => {
      const products = [{ id: 1, label: "A" }];
      mockRepo.getAllProducts.mockResolvedValue(products);

      const result = await listProducts();

      expect(mockRepo.getAllProducts).toHaveBeenCalledTimes(1);
      expect(result).toEqual(products);
    });
  });

  // Récupération d'un produit

  describe("getProduct", () => {
    it("retourne le produit s'il existe", async () => {
      const product = { id: 1, label: "A", images: [] };
      mockRepo.getProductById.mockResolvedValue(product);

      const result = await getProduct(1);

      expect(result).toEqual(product);
    });

    it("lance une erreur 404 si le produit n'existe pas", async () => {
      mockRepo.getProductById.mockResolvedValue(null);

      await expect(getProduct(999)).rejects.toMatchObject({
        message: "Produit non trouvé",
        status: 404,
      });
    });
  });

  // Création d'un produit

  describe("createProduct", () => {
    it("crée un produit sans images", async () => {
      mockRepo.createProduct.mockResolvedValue({ lastID: 5 });
      mockRepo.getProductById.mockResolvedValue({
        id: 5,
        label: "Test",
        images: [],
      });

      const result = await createProduct({
        label: "Test",
        description: "Desc",
        price: "19.99",
        category: "cat1",
      });

      expect(mockRepo.createProduct).toHaveBeenCalledWith({
        label: "Test",
        description: "Desc",
        price: 19.99,
        category: "cat1",
      });
      expect(result.id).toBe(5);
    });

    it("crée un produit avec des images base64", async () => {
      mockRepo.createProduct.mockResolvedValue({ lastID: 6 });
      mockRepo.addProductImage.mockResolvedValue({ lastID: 1 });
      mockRepo.getProductById.mockResolvedValue({
        id: 6,
        label: "Avec image",
        images: [{}],
      });

      const result = await createProduct({
        label: "Avec image",
        description: "Desc",
        price: "25",
        category: "cat1",
        images: [VALID_BASE64_PNG],
      });

      expect(mockWriteFile).toHaveBeenCalledTimes(1);
      expect(mockRepo.addProductImage).toHaveBeenCalledTimes(1);
      expect(mockRepo.addProductImage).toHaveBeenCalledWith(
        expect.objectContaining({
          product_id: 6,
          mime_type: "image/png",
        }),
      );
      expect(result.id).toBe(6);
    });

    it("convertit le prix en float", async () => {
      mockRepo.createProduct.mockResolvedValue({ lastID: 7 });
      mockRepo.getProductById.mockResolvedValue({ id: 7 });

      await createProduct({
        label: "Prix string",
        description: "",
        price: "42.50",
        category: "cat1",
      });

      expect(mockRepo.createProduct).toHaveBeenCalledWith(
        expect.objectContaining({ price: 42.5 }),
      );
    });

    it("lance une erreur 422 pour un format d'image invalide", async () => {
      mockRepo.createProduct.mockResolvedValue({ lastID: 8 });

      await expect(
        createProduct({
          label: "Bad image",
          description: "",
          price: "10",
          category: "cat1",
          images: ["not-a-valid-base64"],
        }),
      ).rejects.toMatchObject({
        status: 422,
      });
    });

    it("lance une erreur 422 pour un type MIME non supporté", async () => {
      mockRepo.createProduct.mockResolvedValue({ lastID: 9 });

      await expect(
        createProduct({
          label: "Bad mime",
          description: "",
          price: "10",
          category: "cat1",
          images: ["data:image/bmp;base64,dGVzdA=="],
        }),
      ).rejects.toMatchObject({
        status: 422,
      });
    });
  });

  // Modification d'un produit

  describe("updateProduct", () => {
    it("met à jour un produit existant sans images", async () => {
      const existing = { id: 1, label: "Old", images: [] };
      mockRepo.getProductById
        .mockResolvedValueOnce(existing) // Si il existe
        .mockResolvedValueOnce({ id: 1, label: "New", images: [] }); // retour final

      const result = await updateProduct(1, {
        label: "New",
        description: "Updated",
        price: "30",
        category: "cat2",
      });

      expect(mockRepo.updateProduct).toHaveBeenCalledWith(1, {
        label: "New",
        description: "Updated",
        price: 30,
        category: "cat2",
      });
      expect(result.label).toBe("New");
    });

    it("remplace les anciennes images par les nouvelles", async () => {
      const oldImages = [{ filename: "old.jpg", path: "/uploads/old.jpg" }];
      mockRepo.getProductById
        .mockResolvedValueOnce({ id: 1, images: oldImages })
        .mockResolvedValueOnce({ id: 1, images: [{}] });
      mockRepo.getProductImages.mockResolvedValue(oldImages);
      mockRepo.deleteProductImages.mockResolvedValue({});
      mockRepo.addProductImage.mockResolvedValue({});

      await updateProduct(1, {
        label: "A",
        description: "B",
        price: "10",
        category: "cat1",
        images: [VALID_BASE64_PNG],
      });

      expect(mockRepo.deleteProductImages).toHaveBeenCalledWith(1);
      expect(mockUnlink).toHaveBeenCalledTimes(1);
      expect(mockWriteFile).toHaveBeenCalledTimes(1);
      expect(mockRepo.addProductImage).toHaveBeenCalledTimes(1);
    });

    it("lance une erreur 404 si le produit n'existe pas", async () => {
      mockRepo.getProductById.mockResolvedValue(null);

      await expect(
        updateProduct(999, {
          label: "X",
          description: "",
          price: "10",
          category: "cat1",
        }),
      ).rejects.toMatchObject({
        message: "Produit non trouvé",
        status: 404,
      });
    });
  });

  // Suppression produit

  describe("deleteProduct", () => {
    it("supprime un produit existant et ses fichiers images", async () => {
      const images = [{ filename: "img1.jpg" }, { filename: "img2.png" }];
      mockRepo.getProductById.mockResolvedValue({ id: 1, images });
      mockRepo.getProductImages.mockResolvedValue(images);
      mockRepo.deleteProduct.mockResolvedValue({ changes: 1 });

      const result = await deleteProduct(1);

      expect(mockRepo.deleteProduct).toHaveBeenCalledWith(1);
      expect(mockUnlink).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ deleted: true });
    });

    it("lance une erreur 404 si le produit n'existe pas", async () => {
      mockRepo.getProductById.mockResolvedValue(null);

      await expect(deleteProduct(999)).rejects.toMatchObject({
        message: "Produit non trouvé",
        status: 404,
      });
    });
  });
});
