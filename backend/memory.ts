import type { SuspectProfile } from '../types/types';
import { ChatResponse } from './aiService';

export function addToHistory(
  suspect: SuspectProfile,
  question: string,
  answer: string,
  suspicionChange?: number
) {
  console.log("did i get here1?");
  if (!suspect.memory) {
    suspect.memory = { history: [] };
  }

  console.log("did i get here?", suspect.memory);

  suspect.memory.history.push({
    role: "user",
    content: question,
  });

  suspect.memory.history.push({
    role: "assistant",
    content: answer,
    suspicionChange,
  });
}

export function getRecentHistory(
  suspect: SuspectProfile,
  windowSize = 5
): ChatResponse[] {
  const hist = suspect.memory?.history ?? [];
  // each exchange is 2 messages, so windowSize×2
  const count = windowSize * 2;
  return hist.slice(-count);
}