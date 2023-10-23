import { z } from 'zod';

export const SigninDetails = z.object({
    username : z.string().min(3),
    password: z.string().min(3)
})

export const SignupDetails = z.object({
    username : z.string().min(3),
    password: z.string().min(3),
    email: z.string().email(),
    name: z.string()
})

export const signupInputs = z.object({
    username: z.string().min(3).transform((value: string): string => value.replace(/[^a-zA-Z0-9]/g, '')),
    password: z.string().min(6),
    token: z.string()
})

export const signinInputs = z.object({
    username: z.string().min(3).transform((value: string): string => value.replace(/[^a-zA-Z0-9]/g, '')),
    password: z.string().min(6),
})

export type GenericResponse = {
    err  ?: string,
    msg : string
    data?: any,
    len?: number
};

export type MovieSearchQueryParams = {
    movie_name: string,
    movie_rel_year: string
}

export type SignupType = z.infer<typeof SignupDetails>
export type SigninType = z.infer<typeof SigninDetails>
