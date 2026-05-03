import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as service from "./tasks.service";

const CreateSchema = z.object({
  title: z.string().min(1).max(500),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "critical"]),
  status: z.enum(["todo", "in_progress", "review", "done"]).default("todo"),
  assigneeId: z.string().uuid().optional(),
  dueDate: z.string().optional(),
  ticketId: z.string().uuid().optional(),
  tags: z.array(z.string()).optional(),
});

const UpdateSchema = CreateSchema.partial();

export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await service.getTasks(req.query as any);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getOne(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await service.getTaskById(String(req.params.id));
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const body = CreateSchema.parse(req.body);
    const data = await service.createTask(body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const body = UpdateSchema.parse(req.body);
    const data = await service.updateTask(String(req.params.id), body);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await service.deleteTask(String(req.params.id));
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
