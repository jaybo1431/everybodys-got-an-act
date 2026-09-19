/**
 * Generates placeholder partner-line audio for every DialogueLine in
 * the scene catalog, using macOS's built-in offline `say` command —
 * fully local, no cloud speech API, no network call. This is a
 * dev-time content-authoring step, not part of the app's runtime.
 *
 * Output paths exactly match what src/domain/audioCatalog.ts expects:
 * public/audio/<sceneId>/<lineId>.m4a
 *
 * Run: npm run gen:audio
 * (requires macOS; re-run any time scene dialogue text changes, or
 * replace individual files directly with real voice recordings later)
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SCENES } from '../src/domain/sceneCatalog';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputRoot = join(__dirname, '..', 'public', 'audio');

// Distinct macOS `say` voice per character (by character id, across
// all scenes) purely so the two characters in a scene sound
// different from each other. Placeholder only — swap for real voice
// recordings whenever they're ready.
const VOICE_BY_CHARACTER: Record<string, string> = {
  jamie: 'Samantha',
  morgan: 'Daniel',
  alex: 'Karen',
  riley: 'Fred',
  unknown: 'Moira',
};
const DEFAULT_VOICE = 'Samantha';

function main() {
  let generated = 0;

  for (const scene of SCENES) {
    const sceneDir = join(outputRoot, scene.id);
    mkdirSync(sceneDir, { recursive: true });

    for (const line of scene.dialogueLines) {
      const voice = VOICE_BY_CHARACTER[line.characterId] ?? DEFAULT_VOICE;
      const outPath = join(sceneDir, `${line.id}.m4a`);
      execFileSync('say', ['-v', voice, '-o', outPath, '--file-format=m4af', '--data-format=aac', line.text]);
      generated += 1;
      console.log(`  ${scene.id}/${line.id}.m4a  (${voice})  "${line.text}"`);
    }
  }

  console.log(`\nGenerated ${generated} placeholder audio files under public/audio/.`);
  console.log('These are local, offline macOS `say` recordings — a placeholder, not the permanent voice.');
  console.log('Runtime playback architecture (AudioRepository + useAudioPlayer) does not change when these are replaced.');
}

main();
