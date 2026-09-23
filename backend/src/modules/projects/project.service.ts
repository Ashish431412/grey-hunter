import { prisma } from '../../config/database';

export class ProjectService {
  static async createProject(userId: string, data: any) {
    return prisma.project.create({
      data: {
        ...data,
        ownerId: userId,
        members: {
          create: {
            userId,
            role: 'OWNER'
          }
        }
      }
    });
  }

  static async getProjects(userId: string) {
    return prisma.project.findMany({
      where: {
        members: {
          some: { userId }
        }
      }
    });
  }
}
