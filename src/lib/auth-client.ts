import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

const apiUrl = "https://api.mystrokeapi.uk/";

// const apiUrl = "http://localhost:3000/";

export const authClient = createAuthClient({
    baseURL: apiUrl,
    basePath: "/auth/api",
    plugins: [
        inferAdditionalFields({
            user: {
                firstName: {
                type: "string",
                required: false,
            },
            lastName: {
                type: "string",
                required: false,
            },
            title: {
                type: "string",
                required: false,
            },
            birthDate: {
                type: "date",
                required: false,
            },
            gender: {
                type: "string",
                required: false,
            },
            role: {
                type: "string",
                required: false,
            }
            },
        }),
    ],
});
