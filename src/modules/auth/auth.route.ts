import { Router } from "express";
import { validateAuth } from "./auth.validation";
import * as AuthController from "./auth.controller";

const router = Router();

router.post("/register", validateAuth, AuthController.register);
router.post("/login", validateAuth, AuthController.login);

export default router;
