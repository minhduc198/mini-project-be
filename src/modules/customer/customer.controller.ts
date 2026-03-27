import { Request, Response, NextFunction } from "express";
import * as Service from "./customer.service";

export const getCustomers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await Service.getCustomers(req.body);

    res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

export const createCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await Service.createCustomer(req.body.data);

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const updateCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id, data } = req.body;

    const result = await Service.updateCustomer(id, data);

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteCustomers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await Service.deleteCustomers(req.body.ids);

    res.json({
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

export const getCustomerDetail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);

    const customer = await Service.getCustomerById(id);

    res.json({
      success: true,
      data: customer,
    });
  } catch (err) {
    next(err);
  }
};
