import type { Scene, Genre, DialogueLine } from './types';

const character = (id: string, name: string) => ({ id, name });

// Every line gets a predictable audio asset id (`audio-${lineId}`) —
// audioCatalog.ts defines the matching AudioAsset for each one. Every
// line needs its own audio, not just "the non-default" character's,
// because which character is the partner depends on which one the
// participant picks to play (see dialogue.ts / turnEngine.ts).
const dialogueLine = (id: string, characterId: string, text: string, order: number): DialogueLine => ({
  id,
  characterId,
  text,
  order,
  audioAssetId: `audio-${id}`,
});

/**
 * Three original two-character scenes for tonight's MVP. Each scene
 * names its own characters (no "Actor A"/"Actor B" anywhere) — the
 * first character listed is the default player role, but nothing in
 * the model or the helpers in dialogue.ts requires that; any
 * character ID can be passed in as the player.
 *
 * This is the only file that needs to grow when we add more scenes,
 * generated scripts, difficulty tiers, or licensed content later —
 * nothing in the UI layer hard-codes scene content.
 */
export const SCENES: Scene[] = [
  {
    id: 'comedy-the-wrong-message',
    title: 'The Wrong Message',
    genre: 'comedy',
    premise: 'Jamie accidentally sent their boss, Morgan, a message that was meant for a friend. Morgan just called Jamie into the room.',
    durationSeconds: 35,
    characters: [character('jamie', 'Jamie'), character('morgan', 'Morgan')],
    instructions: "Play it dead serious — the flatter Morgan stays, the funnier Jamie's spiral lands.",
    dialogueLines: [
      dialogueLine('comedy-l1', 'morgan', 'Jamie. My office. Now.', 1),
      dialogueLine('comedy-l2', 'jamie', 'Is this about the report?', 2),
      dialogueLine('comedy-l3', 'morgan', "It's about the message you sent me at 2:47 today.", 3),
      dialogueLine('comedy-l4', 'jamie', '...which message?', 4),
      dialogueLine('comedy-l5', 'morgan', 'The one about screaming into a pillow. With a goat attached.', 5),
      dialogueLine('comedy-l6', 'jamie', '...that was meant for Casey.', 6),
      dialogueLine('comedy-l7', 'morgan', 'I am not Casey.', 7),
      dialogueLine('comedy-l8', 'jamie', 'No. You are extremely not Casey.', 8),
      dialogueLine('comedy-l9', 'morgan', "Anything you'd like to add?", 9),
      dialogueLine('comedy-l10', 'jamie', '...strong choice on the goat, though?', 10),
    ],
  },
  {
    id: 'drama-the-confession',
    title: 'The Confession',
    genre: 'drama',
    premise: 'Alex has just found out Jamie lied about something important. Alex wants the truth, out loud, right now.',
    durationSeconds: 35,
    characters: [character('alex', 'Alex'), character('jamie', 'Jamie')],
    instructions: 'Take your time. Let the pauses breathe — the silence between lines carries as much as the words.',
    dialogueLines: [
      dialogueLine('drama-l1', 'alex', "You said you'd never come back.", 1),
      dialogueLine('drama-l2', 'jamie', 'I had to.', 2),
      dialogueLine('drama-l3', 'alex', 'You could have called.', 3),
      dialogueLine('drama-l4', 'jamie', 'And said what?', 4),
      dialogueLine('drama-l5', 'alex', 'The truth, maybe.', 5),
      dialogueLine('drama-l6', 'jamie', 'Would you have believed me?', 6),
      dialogueLine('drama-l7', 'alex', "I don't know anymore.", 7),
      dialogueLine('drama-l8', 'jamie', "That's the first honest thing either of us has said tonight.", 8),
    ],
  },
  {
    id: 'horror-someones-there',
    title: "Someone's There",
    genre: 'horror',
    premise: "Riley is home alone, late, on the phone. Riley definitely locked the door. Something in the house disagrees.",
    durationSeconds: 30,
    characters: [character('riley', 'Riley'), character('unknown', 'Unknown Voice')],
    instructions: 'Whisper more than you speak. The stillness before each line is scarier than the line itself.',
    dialogueLines: [
      dialogueLine('horror-l1', 'riley', "I'm probably being paranoid. I definitely locked it, though.", 1),
      dialogueLine('horror-l2', 'riley', 'Did you hear that? That thump.', 2),
      dialogueLine('horror-l3', 'unknown', "You didn't lock it.", 3),
      dialogueLine('horror-l4', 'riley', '...what?', 4),
      dialogueLine('horror-l5', 'unknown', "You didn't lock it.", 5),
      dialogueLine('horror-l6', 'riley', "I'm hanging up. I'm calling you right back.", 6),
      dialogueLine('horror-l7', 'riley', "...who's there?", 7),
    ],
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
