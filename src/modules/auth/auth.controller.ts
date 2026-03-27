import { Request, Response, NextFunction } from "express";
import * as AuthService from "./auth.service";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    const user = await AuthService.register(email, password);

    res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    const result = await AuthService.login(email, password);

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
