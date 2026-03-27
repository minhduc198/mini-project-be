import { Request, Response, NextFunction } from "express";
import * as Service from "./product.service";

/**
 * GET LIST
 */
export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await Service.getProducts(req.body);

    res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET DETAIL
 */
export const getProductDetail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);

    const product = await Service.getProductById(id);

    res.json({
      success: true,
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * CREATE
 */
export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await Service.createProduct(req.body.data);

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * UPDATE
 */
export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id, data } = req.body;

    const result = await Service.updateProduct(id, data);

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE
 */
export const deleteProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await Service.deleteProducts(req.body.ids);

    res.json({
      success: true,
    });
  } catch (err) {
    next(err);
  }
};
