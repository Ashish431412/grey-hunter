import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';

export const auditLog = (action: string, resource: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    res.on('finish', async () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          await prisma.auditLog.create({
            data: {
              userId: req.user?.id,
              action,
              resource,
              resourceId: req.params.id || null,
              ipAddress: req.ip,
              userAgent: req.headers['user-agent'],
              metadata: {
                method: req.method,
                url: req.originalUrl,
                status: res.statusCode
              }
            }
          });
        } catch (error) {
          console.error('Audit log failed', error);
        }
      }
    });
    next();
  };
};
