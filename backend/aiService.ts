import { openai_obj } from "./ai";
import type {
  SuspectProfile,
}
  from "../types/types";
import fs from "fs/promises";
import path from "path";
import Mustache from 'mustache';

export interface ChatResponse {
  content: string;
  role: "assistant" | "user";
  suspicionChange?: number;
}


export async function askSuspect(
  suspect: SuspectProfile,
  question: string
) {
	const promptPath = path.join(__dirname, "prompts", "suspect_template.txt");
	const template = await fs.readFile(promptPath, 'utf-8');

	const systemPrompt = Mustache.render(template, suspect);
	console.log('systemPrompt:', systemPrompt);

  const resp = await openai_obj.responses.create({
    model: "gpt-4.1-nano",
    input: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: question,
      },
    ],
  });
  return (resp);
}

// function to create murder mystery narrative with 4 suspects, where, when, how and who was killed for murdermystery game
export async function createNarrative() {
  const promptPath = path.join(__dirname, "prompts", "narrative.txt");
  const systemPrompt = await fs.readFile(promptPath, "utf-8");

  const resp = openai_obj.responses.create({
    model: "gpt-4.1-nano",
    input: [
      {
        role: "system",
        content: systemPrompt,
      },
    ],
  });

  return (await resp).output_text;
}