import {z} from 'zod'

export const acceptedSchema=z.object({
    acceptMessages:z.boolean()
})