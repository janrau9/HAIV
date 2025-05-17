import { openai_obj } from "./ai";
import type {
  SuspectProfile,
}
  from "../types/types";

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

  const systemPrompt = "You are the Narrator for a classic murder mystery. Generate unique story, example follows:1. Scene Overview \
- When: Date, time of day, weather, atmosphere (e.g. “June 12, 1927 at 10:45 PM, a sweltering thunderstorm rages…”).  \
- Where: Precise location (e.g. “the drawing room of Ravenswood Manor, its grand windows thrown open to the storm…”).  \
- Victim & Crime: Name, age, relation to the setting (e.g. “Lord Percival Blackwood, age 52, found slumped over his desk, a single stab wound to the heart…”).  \
2. Suspect Profiles (repeat the following template four times, once per suspect):  \
- Name & Age \
- Occupation & Social Standing (how they fit into the household or town)  \
- Relationship to the Victim (friend, protégé, rival, secret lover, etc.)  \
- Personality & Demeanor (outgoing and jovial, cold and reserved, nervous tics, choice of words)  \
- Motive (what they’d gain or fear losing)  \
- Alibi (where they claim to have been and who could corroborate it)  \
- Hidden Secrets / Red Herrings (one juicy secret plus one misleading detail that seems suspicious but isn’t)  \
- How They Speak (brief “voice notes” on tone—e.g. clipped, poetic, rambling—so your AI can roleplay their answers)\
3. Clues & Contradictions\
- Scatter two puzzle-worthy clues in each profile (one genuine lead tied to the murder weapon or timeline, one distracting red herring).  \
Formatting Instructions\
- Use third-person, present tense.  \
- Keep each suspect profile to 200–250 words.  \
- Label each section clearly so the backstory can be handed out with no further editing.\
Example output snippet for one suspect:  \
Name & Age:\
Isabella “Izzy” Crawford, 29  \
Occupation & Social Standing:\
Lady’s maid to the late Lady Blackwood—privy to all household secrets, but officially low in the household hierarchy.  \
Relationship to the Victim:  \
Secretly in love with Lord Blackwood’s son; once spilled tea on his wife’s gloves in a fit of jealousy.  \
Personality & Demeanor:  \
Soft-spoken and dutiful, but clenches her jaw when nervous; habitually smooths her apron.  \
Motive:\
Feared being discovered and dismissed after overhearing Lord Blackwood’s plan to fire her for gossiping to guests.  \
Alibi:\
Claims she was polishing silver in the kitchen with Cook (Mrs. Farnsworth), though Cook admits she glanced only twice and may not have seen everything.  \
Hidden Secrets / Red Herrings:  \
– Secret: Kept a vial of unknown powder in her locket (a sleeping draught, not poison).  \
– Red herring: A monogrammed handkerchief found near the body, but it actually belongs to her sister.  \
How She Speaks: \
Soft, hesitant; often trails off mid-sentence and tightens her lips when asked about the powder."

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