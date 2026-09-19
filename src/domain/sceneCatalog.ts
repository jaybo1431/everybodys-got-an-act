import type { Scene, Genre } from './types';

const character = (id: string, name: string) => ({ id, name });

/**
 * Predefined scenes for tonight's MVP. This is the only file that
 * needs to grow when we add hundreds more scenes, generated scripts,
 * difficulty tiers, or licensed content later — nothing in the UI
 * layer hard-codes scene content.
 */
export const SCENES: Scene[] = [
  {
    id: 'comedy-job-interview',
    title: 'The Worst Job Interview',
    genre: 'comedy',
    premise: 'A wildly unqualified candidate tries to bluff their way through an interview.',
    durationSeconds: 40,
    characters: [character('interviewer', 'The Interviewer'), character('candidate', 'The Candidate')],
    instructions: 'Play it dead serious — the funnier it is, the more serious you should be.',
    script: {
      id: 'script-comedy-job-interview',
      lines: [
        { characterId: 'interviewer', line: "So, it says here you have 'extensive' experience. Extensive how?" },
        { characterId: 'candidate', line: 'I once watched an entire documentary about it. Twice.' },
        { characterId: 'interviewer', line: '...Right. And why should we hire you over anyone else?' },
        { characterId: 'candidate', line: 'Because everyone else showed up on time, and I really wanted this job.' },
        { characterId: 'interviewer', line: "That's... not a good thing." },
        { characterId: 'candidate', line: 'See, already thinking outside the box.' },
      ],
    },
  },
  {
    id: 'comedy-breakup-drive-thru',
    title: 'Breakup at the Drive-Thru',
    genre: 'comedy',
    premise: 'Someone tries to break up with their partner over a fast food intercom.',
    durationSeconds: 35,
    characters: [character('driver', 'The Driver'), character('speaker', 'The Voice')],
    instructions: 'Commit fully to the emotional devastation of ordering fries.',
    script: {
      id: 'script-comedy-breakup',
      lines: [
        { characterId: 'speaker', line: 'Welcome to Big Belly Burger, what can I get started for you?' },
        { characterId: 'driver', line: "We need to talk. It's not you, it's... actually, it kind of is you." },
        { characterId: 'speaker', line: 'Ma\'am, this is a drive-thru.' },
        { characterId: 'driver', line: 'I want the number three, and I want my key back.' },
        { characterId: 'speaker', line: 'Would you like a drink with that?' },
        { characterId: 'driver', line: 'Only tears. Only tears, Gary.' },
      ],
    },
  },
  {
    id: 'drama-hospital-hallway',
    title: 'The Hallway',
    genre: 'drama',
    premise: 'Two estranged siblings run into each other outside a hospital room.',
    durationSeconds: 45,
    characters: [character('sibling1', 'Jordan'), character('sibling2', 'Alex')],
    instructions: 'Take your time. Let the silences breathe.',
    script: {
      id: 'script-drama-hallway',
      lines: [
        { characterId: 'sibling1', line: "I didn't think you'd come." },
        { characterId: 'sibling2', line: 'I almost didn\'t.' },
        { characterId: 'sibling1', line: 'How is she?' },
        { characterId: 'sibling2', line: "Stable. For now. She's been asking for you." },
        { characterId: 'sibling1', line: "I don't know if I know how to walk in there." },
        { characterId: 'sibling2', line: 'Neither did I. You just do it anyway.' },
      ],
    },
  },
  {
    id: 'drama-goodbye-airport',
    title: 'Terminal 4',
    genre: 'drama',
    premise: 'A tearful goodbye before a one-way flight.',
    durationSeconds: 40,
    characters: [character('leaving', 'Sam'), character('staying', 'Riley')],
    instructions: "Play the restraint — try not to cry, and fail.",
    script: {
      id: 'script-drama-airport',
      lines: [
        { characterId: 'staying', line: 'You still have time to change your mind.' },
        { characterId: 'leaving', line: "I don't think I do, actually." },
        { characterId: 'staying', line: "Call me when you land. Even if it's 4am here." },
        { characterId: 'leaving', line: "I'll call you before I land." },
        { characterId: 'staying', line: 'Go. Before I make this worse.' },
        { characterId: 'leaving', line: 'You could never make this worse.' },
      ],
    },
  },
  {
    id: 'action-heist-countdown',
    title: 'Sixty Seconds',
    genre: 'action',
    premise: 'Two thieves argue over the last wire to cut before the vault seals.',
    durationSeconds: 35,
    characters: [character('leader', 'Vega'), character('rookie', 'Dash')],
    instructions: 'Big energy. Whisper-shout everything like the building is about to explode.',
    script: {
      id: 'script-action-heist',
      lines: [
        { characterId: 'leader', line: 'Sixty seconds. Which wire, Dash?!' },
        { characterId: 'rookie', line: "I don't know! They didn't cover this in training!" },
        { characterId: 'leader', line: 'There was no training, we made this plan an hour ago!' },
        { characterId: 'rookie', line: "Red feels dramatic. Let's do red." },
        { characterId: 'leader', line: "'Feels dramatic' is not a security protocol!" },
        { characterId: 'rookie', line: 'Cutting it. Cutting it now. GO GO GO.' },
      ],
    },
  },
  {
    id: 'action-rooftop-standoff',
    title: 'Rooftop Standoff',
    genre: 'action',
    premise: 'A rival and a hero face off on a rooftop as sirens close in.',
    durationSeconds: 35,
    characters: [character('hero', 'The Hero'), character('rival', 'The Rival')],
    instructions: 'Slow-motion walk optional but encouraged.',
    script: {
      id: 'script-action-rooftop',
      lines: [
        { characterId: 'rival', line: 'You always were one step behind, weren\'t you?' },
        { characterId: 'hero', line: 'One step is all I need.' },
        { characterId: 'rival', line: "The city doesn't want a hero. It wants results." },
        { characterId: 'hero', line: "Then it's going to have to settle for me." },
        { characterId: 'rival', line: 'Sirens are close. Last chance to walk away.' },
        { characterId: 'hero', line: 'I stopped walking away a long time ago.' },
      ],
    },
  },
];

export function getGenres(): Genre[] {
  return Array.from(new Set(SCENES.map((s) => s.genre)));
}

export function getScenesByGenre(genre: Genre): Scene[] {
  return SCENES.filter((s) => s.genre === genre);
}

export function getSceneById(id: string): Scene | undefined {
  return SCENES.find((s) => s.id === id);
}
