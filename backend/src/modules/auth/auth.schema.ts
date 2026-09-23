import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    displayName: z.string().min(2)
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string()
  })
});

export const biometricRegisterSchema = z.object({
  body: z.object({
    publicKey: z.string()
  })
});

export const biometricLoginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    signature: z.string(),
    challenge: z.string()
  })
});
