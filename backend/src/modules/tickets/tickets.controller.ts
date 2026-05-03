import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as service from "./tickets.service";

const CreateSchema = z.object({
  title: z.string().min(1).max(500),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "critical"]),
  status: z
    .enum(["backlog", "todo", "in_progress", "review", "done"])
    .default("todo"),
  assigneeId: z.string().uuid().optional(),
  dueDate: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

const UpdateSchema = CreateSchema.partial().extend({
  status: z
    .enum(["backlog", "todo", "in_progress", "review", "done"])
    .optional(),
});

export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await service.getTickets(req.query as any);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getOne(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await service.getTicketById(String(req.params.id));
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const body = CreateSchema.parse(req.body);
    const data = await service.createTicket({
      ...body,
      authorId: req.user!.userId,
    });
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const body = UpdateSchema.parse(req.body);
    const data = await service.updateTicket(String(req.params.id), body);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await service.deleteTicket(String(req.params.id));
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
