import { z } from 'zod';

import { COPY } from '@/constants/copy';

export const loginSchema = z.object({
  email: z.string().min(1, COPY.login.emailRequired).email(COPY.login.emailInvalid),
  password: z
    .string()
    .min(1, COPY.login.passwordRequired)
    .min(6, COPY.login.passwordTooShort),
});

export type LoginValues = z.infer<typeof loginSchema>;
