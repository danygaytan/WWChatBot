import OpenAI from "openai";
import * as dotenv from 'dotenv';
import { ResponseInputMessageContentList } from "openai/resources/responses/responses";
dotenv.config()

const client = new OpenAI({
    apiKey: process.env.OPENAI_API,
});

export const sendQuery = async (input_content: ResponseInputMessageContentList) => {
    return await client.responses.create({
        model: process.env.MODEL || '',
        input: [{
            'role': 'user',
            'content': input_content,
        }],
        max_output_tokens: Number(process.env.MAX_OUTPUT_TOKEN) || 400,
    });
}