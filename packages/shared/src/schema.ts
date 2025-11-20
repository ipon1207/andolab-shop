import z from 'zod';

export const janCodeSchema = z.object({
    janCode: z.string(),
});

export type JanCode = z.infer<typeof janCodeSchema>;
