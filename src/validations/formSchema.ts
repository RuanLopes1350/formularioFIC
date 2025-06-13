import { z } from 'zod';

export const userSchema = z.object({
    name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    email: z.string().email('E-mail inválido').min(1, 'Campo E-mail não pode estar vazio'),
    gender: z.enum(['masculino', 'feminino'], {
        errorMap: () => ({ message: 'Selecione um gênero' })
    }),
    course: z.string().min(1, 'Selecione um curso'),
    observations: z.string().optional(),
    terms: z.literal(true, {
        errorMap: () => ({ message: 'Você deve aceitar os termos' })
    })
})

export type UserData = z.infer<typeof userSchema>;