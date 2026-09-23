import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const tokens = await AuthService.register(req.body);
      res.status(201).json({ status: 'success', data: tokens });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const tokens = await AuthService.login(req.body);
      res.status(200).json({ status: 'success', data: tokens });
    } catch (error) {
      next(error);
    }
  }

  static async biometricRegister(req: Request, res: Response, next: NextFunction) {
    try {
      await AuthService.biometricRegister(req.user!.id, req.body.publicKey);
      res.status(200).json({ status: 'success', message: 'Biometric setup complete' });
    } catch (error) {
      next(error);
    }
  }

  static async biometricLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const tokens = await AuthService.biometricLogin(req.body);
      res.status(200).json({ status: 'success', data: tokens });
    } catch (error) {
      next(error);
    }
  }
}
