import { z } from 'zod';

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    visibility: z.enum(['PUBLIC', 'PRIVATE']).optional()
  })
});

export const createTaskSchema = z.object({
  body: z.object({
    boardId: z.string().uuid(),
    title: z.string().min(1),
    description: z.string().optional(),
    status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
    assigneeId: z.string().uuid().optional(),
    position: z.number()
  })
});
