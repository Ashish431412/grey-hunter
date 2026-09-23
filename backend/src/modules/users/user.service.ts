import { prisma } from '../../config/database';

export class UserService {
  static async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, displayName: true, role: true, avatarUrl: true, createdAt: true }
    });
  }

  static async updateUser(id: string, data: any) {
    return prisma.user.update({
      where: { id },
      data,
      select: { id: true, email: true, displayName: true, role: true, avatarUrl: true }
    });
  }
}
