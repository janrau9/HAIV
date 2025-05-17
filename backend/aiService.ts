import { openai_obj } from "./ai";
import type {
  SuspectProfile,
}
  from "../types/types";
import fs from "fs/promises";
import path from "path";
import { getRecentHistory, addToHistory } from "./memory";

export interface ChatResponse {
  content: string;
  role: "assistant" | "user";
  suspicionChange?: number;
}


export async function askSuspect(
  suspect: SuspectProfile,
  question: string
) {

  const intro = `You are suspect #${suspect.id}. named ${suspect.name}.
  you are a ${suspect.age}-year-old, you are a ${suspect.personality} person.
  you ${suspect.characteristics.map((c) => `\n- ${c}`).join("")},
  you have the following secrets: ${suspect.secrets.map((s) => `\n- ${s}`).join("")},
  you have the following alibi: ${suspect.alibi},
  you are a suspect from murder case.
  You are being interrogated by a detective.
  you will give answers based on your characteristics.`;

  const recentMsgs = getRecentHistory(suspect, 3)
    .map(m =>
      m.role === 'user'
        ? `Detective: ${m.content}`
        : `${suspect.name}: ${m.content}`
    ).join('\n');
    console.log("recent messages: ", recentMsgs);

    const systemPrompt = [intro, '[RECENT CONVERCATION]', recentMsgs]
      .filter(Boolean)
      .join('\n\n');

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
  const answer = resp.output_text;

  addToHistory(suspect, question, answer);

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
