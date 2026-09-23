import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '../../middleware/validate.middleware';
import { registerSchema, loginSchema, biometricRegisterSchema, biometricLoginSchema } from './auth.schema';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);
router.post('/biometric-register', authenticate, validate(biometricRegisterSchema), AuthController.biometricRegister);
router.post('/biometric-login', validate(biometricLoginSchema), AuthController.biometricLogin);

export default router;
