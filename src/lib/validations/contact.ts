import {z} from "zod"
export const contactSubjects=["Order Help","Delivery","Returns","Product Question","Fragrance Advice","Account Help","Other"] as const
export const contactSchema=z.object({name:z.string().trim().min(2,"Enter your name."),email:z.email("Enter a valid email address."),subject:z.enum(contactSubjects,{error:"Choose a subject."}),orderNumber:z.string().trim().max(40).optional(),message:z.string().trim().min(15,"Tell us a little more so we can help.").max(2000,"Keep your message under 2,000 characters.")})
export type ContactValues=z.infer<typeof contactSchema>
