import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/database';
import { config } from '../../config/index';
import { AppError } from '../../utils/appError';
import crypto from 'crypto';

export class AuthService {
  static async register(data: any) {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      throw new AppError('Email already in use', 400);
    }
    
    const passwordHash = await bcrypt.hash(data.password, 10);
    
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        displayName: data.displayName
      }
    });
    
    return this.generateTokens(user.id);
  }

  static async login(data: any) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) {
      throw new AppError('Invalid email or password', 401);
    }

    if (!user.isActive) {
      throw new AppError('User account is inactive', 401);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });
    
    return this.generateTokens(user.id);
  }

  static async biometricRegister(userId: string, publicKey: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { biometricPublicKey: publicKey }
    });
  }

  static async biometricLogin(data: any) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !user.biometricPublicKey) {
      throw new AppError('Biometric login not setup for this user', 400);
    }

    const verify = crypto.createVerify('SHA256');
    verify.update(data.challenge);
    verify.end();
    
    const isValid = verify.verify(user.biometricPublicKey, data.signature, 'base64');
    if (!isValid) {
      throw new AppError('Invalid biometric signature', 401);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });
    
    return this.generateTokens(user.id);
  }

  static generateTokens(userId: string) {
    const accessToken = jwt.sign({ id: userId }, config.jwt.secret, { expiresIn: config.jwt.expiresIn as any });
    const refreshToken = jwt.sign({ id: userId }, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshExpiresIn as any });
    return { accessToken, refreshToken };
  }
}
