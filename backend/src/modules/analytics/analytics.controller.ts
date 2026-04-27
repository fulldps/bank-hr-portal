import { Request, Response, NextFunction } from "express";
import * as service from "./analytics.service";

export async function getKpi(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await service.getKpi();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getWeeklyTrend(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = await service.getWeeklyTrend();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getPriorityStats(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = await service.getPriorityStats();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getDepartmentStats(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = await service.getDepartmentStats();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
