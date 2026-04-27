import { Request, Response, NextFunction } from "express";
import * as service from "./notifications.service";

export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await service.getNotifications(req.user!.userId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getUnread(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const count = await service.getUnreadCount(req.user!.userId);
    res.json({ success: true, data: { count } });
  } catch (err) {
    next(err);
  }
}

export async function markOne(req: Request, res: Response, next: NextFunction) {
  try {
    await service.markRead(req.params.id, req.user!.userId);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function markAll(req: Request, res: Response, next: NextFunction) {
  try {
    await service.markAllRead(req.user!.userId);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await service.deleteNotification(req.params.id, req.user!.userId);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
