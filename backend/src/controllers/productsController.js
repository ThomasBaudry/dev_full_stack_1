import * as productsService from '../services/productsService.js';

export const index = async (req, res, next) => {
  try {
    const products = await productsService.listProducts();
    res.json(products);
  } catch (err) {
    next(err);
  }
};

export const show = async (req, res, next) => {
  try {
    const product = await productsService.getProduct(Number(req.params.id));
    res.json(product);
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const product = await productsService.createProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const product = await productsService.updateProduct(Number(req.params.id), req.body);
    res.json(product);
  } catch (err) {
    next(err);
  }
};

export const destroy = async (req, res, next) => {
  try {
    await productsService.deleteProduct(Number(req.params.id));
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
