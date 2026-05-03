import { Request, Response, NextFunction } from "express";
import * as service from "./users.service";

export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await service.getUsers(req.query as any);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getOne(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await service.getUserById(String(req.params.id));
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getDepartments(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = await service.getDepartments();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
