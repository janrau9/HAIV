import { openai_obj } from "./ai";
import type {
  SuspectProfile,
  Narrative,
}
  from "../types/types";
import fs from "fs/promises";
import path from "path";
import { getRecentHistory, addToHistory } from "./memory";
import Mustache from 'mustache';
import { game } from "./GameManager";

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

  const intro = Mustache.render(template, suspect);
  console.log('systemPrompt:', intro);

  const recentMsgs = getRecentHistory(suspect, 3)
    .map(m =>
      m.role === 'user'
        ? `Detective: ${m.content}`
        : `Suspect: ${m.content}`
    ).join('\n');
    // console.log("recent messages: ", recentMsgs);

    const systemPrompt = [intro, '[RECENT CONVERCATION]', recentMsgs]
      .filter(Boolean)
      .join('\n\n');
    // console.log('systemPrompt:', systemPrompt);

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

  const resp = await openai_obj.responses.create({
    model: "gpt-4.1-nano",
    input: [
      {
        role: "system",
        content: systemPrompt,
      },
    ],
  });
  const parsedResp = JSON.parse(resp.output_text);
  game.initGame(parsedResp.suspects, [], parsedResp.case_summary)
  delete parsedResp.case_summary;
  const sanitizeResp = JSON.stringify(parsedResp);
  return sanitizeResp;
}
