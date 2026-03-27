import { Request, Response, NextFunction } from "express";
import * as Service from "./inventory.service";

export const getInventories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await Service.getInventories();

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const getInventoryDetail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);

    const inventory = await Service.getInventoryById(id);

    res.json({
      success: true,
      data: inventory,
    });
  } catch (err) {
    next(err);
  }
};

export const createInventory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await Service.createInventory(req.body.data);

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const updateInventory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id, data } = req.body;

    const result = await Service.updateInventory(id, data);

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteInventories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await Service.deleteInventories(req.body.ids);

    res.json({
      success: true,
    });
  } catch (err) {
    next(err);
  }
};
