import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as service from "./shifts.service";

const CreateSchema = z.object({
  userId: z.string().uuid(),
  date: z.string(),
  type: z.enum(["morning", "evening", "night", "day_off", "vacation", "sick"]),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  overtimeMinutes: z.number().default(0),
});

const RejectSchema = z.object({
  reason: z.string().min(1),
});

export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await service.getShifts(req.query as any);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const body = CreateSchema.parse(req.body);
    const data = await service.createShift(body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function approve(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await service.approveShift(
      String(req.params.id),
      req.user!.userId,
    );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function reject(req: Request, res: Response, next: NextFunction) {
  try {
    const { reason } = RejectSchema.parse(req.body);
    const data = await service.rejectShift(
      String(req.params.id),
      reason,
      req.user!.userId,
    );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getOvertime(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = await service.getOvertimeStats();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
