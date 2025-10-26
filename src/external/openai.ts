import OpenAI from "openai";
import * as dotenv from 'dotenv';
import { ResponseInputMessageContentList } from "openai/resources/responses/responses.js";
dotenv.config()

const DEFAULT_MAX_OUTPUT_TOKEN = 400;
const DEFAULT_OPENAI_MODEL = '';
const DEFAULT_OPENAI_ROLE = 'user';

const client = new OpenAI({
    apiKey: process.env.OPENAI_API,
});

export const sendQuery = async (input_content: ResponseInputMessageContentList) => {
    return await client.responses.create({
        model: process.env.MODEL || DEFAULT_OPENAI_MODEL,
        input: [{
            'role': DEFAULT_OPENAI_ROLE,
            'content': input_content,
        }],
        max_output_tokens: Number(process.env.MAX_OUTPUT_TOKEN) || DEFAULT_MAX_OUTPUT_TOKEN,
    });
}