"use server";
import { OpenAI } from "openai";

export const openai_obj = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
});