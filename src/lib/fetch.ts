import { createFetch, createSchema } from "@better-fetch/fetch";
import { z } from "zod";

export const fetchSchema = createSchema({
    "@get/dashboard/recipient/count": {
        output: z.object({
            count: z.number(),
        })
    },
    "@get/dashboard/recipient/list": {
        query: z.object({
            page: z.number().optional(),
            limit: z.number().optional(),
        }),
        output: z.object({
            recipients: z.array(
                z.object({
                    gameUserId: z.string(),
                    name: z.string(),
                    image: z.string().nullable(),
                    firstName: z.string(),
                    lastName: z.string(),
                    title: z.string(),
                    gender: z.string(),
                    birthDate: z.string().nullable(),
                })
            ),
            rowCount: z.number(),
        })
    },
    "@get/dashboard/custom-level/list": {
        query: z.object({
            page: z.number().optional(),
            limit: z.number().optional(),
        }),
        output: z.object({
            customLevels: z.array(
                z.object({
                    id: z.string(),
                    type: z.string(),
                    subtype: z.string(),
                    name: z.string(),
                    description: z.string(),
                })
            ),
            rowCount: z.number(),
        })
    },
    "@get/dashboard/custom-level/by-id": {
        query: z.object({
            customLevelId: z.string(),
        }),
        output: z.object({
            id: z.string(),
            type: z.string(),
            subtype: z.string(),
            name: z.string(),
            description: z.string(),
            stage: z.array(z.object({
                number: z.number(),
                target: z.string(),
                description: z.string(),
                image: z.string(),
            })),
        })
    },
    "@post/dashboard/custom-level/create": {
        input: z.object({
            type: z.string(),
            subtype: z.string(),
            name: z.string(),
            description: z.string(),
            stage: z.array(z.object({
                number: z.number(),
                target: z.string(),
                description: z.string(),
                image: z.string(),
            }))
        }),
        output: z.object({
            message: z.string().optional(),
            error: z.string().optional(),
        })
    },
    "@post/dashboard/custom-level/delete": {
        input: z.object({
            customLevelId: z.string(),
        }),
        output: z.object({
            message: z.string().optional(),
            error: z.string().optional(),
        })
    },
    "@get/dashboard/main-level/list": {
        query: z.object({
            page: z.number().optional(),
            limit: z.number().optional(),
        }),
        output: z.object({
            mainLevels: z.array(
                z.object({
                    id: z.string(),
                    type: z.string(),
                    subtype: z.string(),
                    name: z.string(),
                    description: z.string(),
                })
            ),
            rowCount: z.number(),
        })
    },
    "@get/dashboard/main-level/by-id": {
        query: z.object({
            mainLevelId: z.string(),
        }),
        output: z.object({
            id: z.string(),
            type: z.string(),
            subtype: z.string(),
            name: z.string(),
            description: z.string(),
            stage: z.array(z.object({
                number: z.number(),
                target: z.string(),
                description: z.string(),
                image: z.string(),
            })),
        })
    },
    "@post/dashboard/main-level/create": {
        input: z.object({
            type: z.string(),
            subtype: z.string(),
            name: z.string(),
            description: z.string(),
            stage: z.array(z.object({
                number: z.number(),
                target: z.string(),
                description: z.string(),
                image: z.string(),
            }))
        }),
        output: z.object({
            message: z.string().optional(),
            error: z.string().optional(),
        })
    },
    "@post/dashboard/main-level/delete": {
        input: z.object({
            mainLevelId: z.string(),
        }),
        output: z.object({
            message: z.string().optional(),
            error: z.string().optional(),
        })
    },
    "@post/dashboard/recipient/add": {
        input: z.object({
            gameUserId: z.string(),
        }),
        output: z.object({
            message: z.string().optional(),
            error: z.string().optional(),
        })
    },
    "@post/dashboard/recipient/remove": {
        input: z.object({
            gameUserId: z.string(),
        }),
        output: z.object({
            message: z.string().optional(),
            error: z.string().optional(),
        })
    },
}, {
    strict: true,
});

export const $fetch = await createFetch({
    baseURL: "https://api.mystrokeapi.uk/",
    // baseURL: "http://localhost:3000/",
    schema: fetchSchema,
    // auth: {
    //     type: "Bearer",

    // }
    
});