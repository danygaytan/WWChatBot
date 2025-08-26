import OpenAI from "openai";
import * as dotenv from 'dotenv';
dotenv.config()

const client = new OpenAI({
    apiKey: process.env.OPENAI_API,
});

export const sendQuery = async (query: string) => {
    return await client.responses.create({
        model: process.env.MODEL || '' ,
        input: query + process.env.QUERY_LIMITER,
    });
}