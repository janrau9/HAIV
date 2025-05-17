import type { SuspectProfile } from '../types/types';
import { ChatResponse } from './aiService';

export function addToHistory(
  suspect: SuspectProfile,
  question: string,
  answer: string,
  suspicionChange?: number
) {
  if (!suspect.summary.memory) {
    suspect.summary.memory = { history: [] };
  }

  suspect.summary.memory.history.push({
    role: "user",
    content: question,
  });

  suspect.summary.memory.history.push({
    role: "assistant",
    content: answer,
    suspicionChange,
  });
}

export function getRecentHistory(
  suspect: SuspectProfile,
  windowSize = 5
): ChatResponse[] {
  const hist = suspect.summary.memory?.history ?? [];
  // each exchange is 2 messages, so windowSize×2
  const count = windowSize * 2;
  return hist.slice(-count);
}