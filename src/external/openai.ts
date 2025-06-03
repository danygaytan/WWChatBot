import OpenAI from "openai";
import * as dotenv from 'dotenv';
dotenv.config()

const client = new OpenAI({
    apiKey: process.env.OPENAI_API,
});

export const sendQuery = async (query: string) => {
    return await client.responses.create({
        model: "gpt-4.1",
        input: query + ". Limitate a responder con 400 tokens como maximo",
    });
}