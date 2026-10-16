// Comprehensive Verification of Configured Personalized Message & Static Assets
import fs from 'fs';
import path from 'path';
import { GAME_CONFIG } from './src/config/gameConfig';

console.log('===========================================================');
console.log('--- VERIFYING CONFIGURED PERSONALIZED MESSAGE & STRINGS ---');
console.log('===========================================================');

let allPassed = true;
function assert(desc, condition) {
  if (condition) {
    console.log(`✅ PASS: ${desc}`);
  } else {
    console.error(`❌ FAIL: ${desc}`);
    allPassed = false;
  }
}

// 1. Verify Recipient and Sender Names
console.log('\n[1] Names Configuration:');
assert('Recipient name is defined and non-empty', typeof GAME_CONFIG.names.recipientName === 'string' && GAME_CONFIG.names.recipientName.trim().length > 0);
assert('Sender name is defined and non-empty', typeof GAME_CONFIG.names.senderName === 'string' && GAME_CONFIG.names.senderName.trim().length > 0);
console.log(`    Recipient: "${GAME_CONFIG.names.recipientName}"`);
console.log(`    Sender:    "${GAME_CONFIG.names.senderName}"`);

// 2. Verify Final Surprise Letter & Reveal Content
console.log('\n[2] Final Surprise & Climax Message:');
const surprise = GAME_CONFIG.narrative.finalSurprise;
assert('Final surprise title is defined', typeof surprise.title === 'string' && surprise.title.length > 0);
assert('Final surprise subtitle is defined', typeof surprise.subtitle === 'string' && surprise.subtitle.length > 0);
assert('Final letter contains multi-line romantic paragraphs (>= 3)', Array.isArray(surprise.paragraphs) && surprise.paragraphs.length >= 3);
assert('Final letter closing is defined', typeof surprise.closing === 'string' && surprise.closing.length > 0);
assert('Optional final question prompt is present', typeof surprise.questionPrompt === 'string' && surprise.questionPrompt.length > 0);
assert('Final question has interactive response options (>= 2)', Array.isArray(surprise.questionOptions) && surprise.questionOptions.length >= 2);
assert('Every question option has corresponding response feedback', surprise.questionOptions.every(opt => Boolean(surprise.responseFeedback[opt])));

console.log(`    Title:    "${surprise.title}"`);
console.log(`    Question: "${surprise.questionPrompt}"`);
console.log(`    Options:  ${surprise.questionOptions.join(' | ')}`);

// 3. Verify Story Letters for Chapters I, II, III
console.log('\n[3] Chapter Clue Letters:');
const letters = GAME_CONFIG.narrative.letters;
assert('Memory room letter has title, body, and hint', Boolean(letters.memoryRoom.title && letters.memoryRoom.body.length && letters.memoryRoom.hint));
assert('Library letter has title, body, and hint', Boolean(letters.library.title && letters.library.body.length && letters.library.hint));
assert('Conservatory letter has title, body, and hint', Boolean(letters.conservatory.title && letters.conservatory.body.length && letters.conservatory.hint));

// 4. Verify Static Distribution Artifacts (dist/)
console.log('\n[4] Static Distribution Bundle (dist/):');
const distExists = fs.existsSync(path.resolve('dist'));
assert('dist directory exists', distExists);

const distIndexHtml = fs.readFileSync(path.resolve('dist/index.html'), 'utf8');
assert('dist/index.html uses relative script path (./assets/...)', distIndexHtml.includes('src="./assets/'));
assert('dist/index.html uses relative stylesheet path (./assets/...)', distIndexHtml.includes('href="./assets/'));
assert('dist/index.html contains root mounting point (<div id="root"></div>)', distIndexHtml.includes('<div id="root"></div>'));

const assetsDir = path.resolve('dist/assets');
const assetFiles = fs.readdirSync(assetsDir);
const jsBundle = assetFiles.find(f => f.endsWith('.js'));
const cssBundle = assetFiles.find(f => f.endsWith('.css'));

assert('Compiled JS bundle exists in dist/assets', Boolean(jsBundle));
assert('Compiled CSS bundle exists in dist/assets', Boolean(cssBundle));

// Verify personalized strings are compiled into the production JS bundle
if (jsBundle) {
  const bundleContent = fs.readFileSync(path.join(assetsDir, jsBundle), 'utf8');
  assert('Production bundle contains recipient name', bundleContent.includes(GAME_CONFIG.names.recipientName));
  assert('Production bundle contains final surprise title', bundleContent.includes(surprise.title));
  assert('Production bundle contains final question prompt', bundleContent.includes(surprise.questionPrompt));
}

console.log('\n===========================================================');
if (allPassed) {
  console.log('🎉 ALL PERSONALIZATION & STATIC HOSTING CHECKS PASSED! 🎉');
} else {
  console.error('⚠️ SOME CHECKS FAILED.');
  process.exit(1);
}
console.log('===========================================================\n');
