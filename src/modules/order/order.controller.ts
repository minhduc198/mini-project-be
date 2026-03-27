import { Request, Response, NextFunction } from "express";
import * as Service from "./order.service";

export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await Service.getOrders(req.body);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

export const getOrderDetail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);
    const data = await Service.getOrderById(id);

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const createOrder = async (req: any, res: any) => {
  try {
    const payload = req.body;

    const order = await Service.createOrder(payload);

    res.json({
      success: true,
      data: order,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { id, data } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Missing order id" });
    }

    const result = await Service.updateOrder(Number(id), data);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    console.error("UPDATE ORDER ERROR:", err);
    return res.status(400).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  }
};

export const deleteOrders = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await Service.deleteOrders(req.body.ids);

    res.json({
      success: true,
    });
  } catch (err) {
    next(err);
  }
};
