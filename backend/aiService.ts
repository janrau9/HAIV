import { openai_obj } from "./ai";
import type {
  SuspectProfile,
}
  from "../types/types";
import fs from "fs/promises";
import path from "path";

export interface ChatResponse {
  content: string;
  role: "assistant" | "user";
  suspicionChange?: number;
}


export async function askSuspect(
  suspect: SuspectProfile,
  question: string
) {
  // suspect characteristics array 4 suspects for now
  const suspects = ["your name is John Doe, you are a 35-year-old and you are blind but can hear very well",
    "your name is Jane Doe, you are a 28-year-old and you are deaf but can see very well",
    "your name is Jack Doe, you are a 40-year-old and you are mute but can smell very well",
    "your name is Jill Doe, you are a 30-year-old and you are a robot but can feel very well",
  ];

  const systemPrompt = `You are suspect number ${suspect.id}. your name is ${suspect.name}.
  you are a ${suspect.age}-year-old, you are a ${suspect.personality} person.
  you ${suspect.characteristics.map((c) => `\n- ${c}`).join("")},
  you have the following secrets: ${suspect.secrets.map((s) => `\n- ${s}`).join("")},
  you have the following alibi: ${suspect.alibi},
  you are a suspect from murder case.
  You are being interrogated by a detective.
  you will give answers based on your characteristics.`;

  const resp = openai_obj.responses.create({
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