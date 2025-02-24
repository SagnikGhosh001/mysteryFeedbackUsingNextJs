import {z} from 'zod'

export const verfifySchema=z.object({
    code:z.string().length(6,'verificatin code must be 6 digit')
})