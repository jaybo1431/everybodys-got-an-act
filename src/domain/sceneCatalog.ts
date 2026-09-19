import type { Scene, Genre } from './types';

const character = (id: string, name: string) => ({ id, name });

/**
 * Three original scenes for tonight's MVP. This is the only file
 * that needs to grow when we add more scenes, generated scripts,
 * difficulty tiers, or licensed content later — nothing in the UI
 * layer hard-codes scene content.
 */
export const SCENES: Scene[] = [
  {
    id: 'comedy-the-wrong-message',
    title: 'The Wrong Message',
    genre: 'comedy',
    premise: 'You accidentally sent your boss a message that was meant for your best friend. They just called you into the room.',
    durationSeconds: 45,
    characters: [character('boss', 'The Boss'), character('you', 'You')],
    instructions: 'Play both roles. Switch your posture and voice between characters — the flatter the Boss, the funnier it lands.',
    script: {
      id: 'script-comedy-the-wrong-message',
      lines: [
        { characterId: 'boss', line: 'My office. Now.' },
        { characterId: 'you', line: 'Is this about the report?', direction: 'panicked' },
        { characterId: 'boss', line: "It's about the message you sent me at 2:47pm." },
        { characterId: 'you', line: '...which message?' },
        {
          characterId: 'boss',
          line: '"This meeting could have been an email. This man could have been anyone else. I want to scream into a pillow." Attached: a screaming goat.',
          direction: 'reading flatly off a phone',
        },
        { characterId: 'you', line: '...that was for Casey.' },
        { characterId: 'boss', line: 'I am not Casey.' },
        { characterId: 'you', line: 'No. No, you are extremely not Casey.' },
        { characterId: 'boss', line: 'Anything you\'d like to add?' },
        { characterId: 'you', line: '...strong choice on the goat, though?', direction: 'after a long pause' },
      ],
    },
  },
  {
    id: 'drama-the-confession',
    title: 'The Confession',
    genre: 'drama',
    premise: 'You discover your best friend has lied to you about something important. You confront them and demand the truth.',
    durationSeconds: 50,
    characters: [character('you', 'You'), character('friend', 'Alex')],
    instructions: 'Take your time. Let the pauses breathe — the silence between lines carries as much as the words.',
    script: {
      id: 'script-drama-the-confession',
      lines: [
        { characterId: 'you', line: 'How long have you known?' },
        { characterId: 'friend', line: 'Known what?' },
        { characterId: 'you', line: "Don't. Not tonight. How long, Alex?" },
        { characterId: 'friend', line: '...since March.', direction: 'quiet' },
        { characterId: 'you', line: 'Six months. You let me stand there for six months.' },
        { characterId: 'friend', line: "I didn't know how to tell you." },
        { characterId: 'you', line: "You didn't know how? Or you didn't want to?" },
        { characterId: 'friend', line: 'Both. Maybe both.' },
        { characterId: 'you', line: 'I trusted you with everything.' },
        { characterId: 'friend', line: 'I know.' },
        { characterId: 'you', line: 'Look at me and tell me why.' },
        { characterId: 'friend', line: '...because I was scared of losing you. And I lost you anyway.', direction: 'after a long beat' },
      ],
    },
  },
  {
    id: 'horror-someones-there',
    title: "Someone's There",
    genre: 'horror',
    premise: "You're home alone late at night. You hear a noise from another room. You know you locked the door.",
    durationSeconds: 45,
    characters: [character('you', 'You'), character('unknown', 'Unknown Voice')],
    instructions: 'Whisper more than you speak. The stillness before each line is scarier than the line itself.',
    script: {
      id: 'script-horror-someones-there',
      lines: [
        { characterId: 'you', line: "I'm probably being paranoid. I definitely locked it though.", direction: 'whispering into the phone' },
        { characterId: 'you', line: 'There. Did you hear that? That thump.' },
        { characterId: 'you', line: "It's probably just the pipes. Old house, y'know.", direction: 'unconvinced' },
        { characterId: 'you', line: '...hello?' },
        { characterId: 'unknown', line: "You didn't lock it.", direction: 'calm, from the other room' },
        { characterId: 'you', line: '...what?', direction: 'frozen' },
        { characterId: 'unknown', line: "You didn't lock it." },
        { characterId: 'you', line: "I'm hanging up. I'm calling you right back.", direction: 'barely a whisper' },
        { characterId: 'you', line: "...who's there?", direction: 'to the dark hallway' },
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
