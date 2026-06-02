import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config({ path: '.env.local' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const apiKey = process.env.VITE_ELEVENLABS_API_KEY;
const voiceId = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice
const audioDir = path.join(__dirname, '../public/assets/audio');

if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
}

const getElevenLabsSettings = (style) => {
    switch (style) {
        case 'celebration': return { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true };
        case 'encouragement': return { stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true };
        case 'question': return { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true };
        case 'emphasis': return { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true };
        case 'thinking': return { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true };
        default: return { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true };
    }
};

const phrases = [
    // Intro
    { text: "Welcome to the Great Sky Race!", style: 'encouragement' },
    { text: "Today, we are going to learn how to compare and order large numbers.", style: 'statement' },
    { text: "Who gets to launch first? Let us find out!", style: 'question' },
    { text: "Are you ready to explore space and solve some fun challenges? Let us get started on our learning journey!", style: 'encouragement' },
    // Wonder
    { text: "Which rocket has more fuel?", style: 'question' },
    { text: "Mission Control says only the bigger number gets to launch!", style: 'statement' },
    // Story
    { text: "Sarah's fuel reads 3,847. John's reads 4,219. Mission Control announces only the pilot with the bigger number gets to launch!", style: 'statement' },
    { text: "Which is bigger: 3,847 or 4,219?", style: 'question' },
    { text: "We have to compare the numbers!", style: 'encouragement' },
    { text: 'Mike the fuel engineer says "Bigger number equals more fuel equals longer flight!"', style: 'statement' },
    { text: "But how do you know which is bigger when the numbers are so huge?", style: 'question' },
    { text: "Hmm... maybe we look at the digits?", style: 'thinking' },
    { text: "Priya pulls up the Place Value Ladder! She compares the THOUSANDS digit first.", style: 'statement' },
    { text: "4 thousands is more than 3 thousands. John wins!", style: 'emphasis' },
    { text: "But wait! Lena, Omar, and Aiko also want to race! Now we have to order all their fuel readings from least to greatest.", style: 'statement' },
    { text: "We can use the ladder again!", style: 'emphasis' },
    { text: "Using the Place Value Ladder, Mission Control orders all the rockets.", style: 'statement' },
    { text: "The race begins and the rockets blast off into space!", style: 'emphasis' },
    // Simulate
    { text: "Adjust the dials to change the fuel numbers. Watch the ladder!", style: 'instruction' },
    { text: "Drag the rocket to land close to the target!", style: 'instruction' },
    { text: "Drag the cards to order them!", style: 'instruction' },
    // Play
    { text: "Welcome to Level 1: Cadet!", style: 'celebration' },
    { text: "Welcome to Level 2: Navigator!", style: 'celebration' },
    { text: "Welcome to Level 3: Commander!", style: 'celebration' },
    { text: "Level 1: Cadet Complete!", style: 'celebration' },
    { text: "Level 2: Navigator Complete!", style: 'celebration' },
    { text: "Level 3: Commander Complete!", style: 'celebration' },
    // Reflect
    { text: "What did you learn about comparing numbers?", style: 'question' },
    { text: "How confident do you feel about comparing numbers?", style: 'question' },
];

async function generate() {
    const mapData = {};

    for (let i = 0; i < phrases.length; i++) {
        const { text, style } = phrases[i];
        const safeName = text.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 50);
        const filename = `audio_${safeName}_${i}.mp3`;
        const filepath = path.join(audioDir, filename);

        mapData[text] = `/assets/audio/${filename}`;

        if (fs.existsSync(filepath)) {
            console.log(`Skipping (already exists): ${filename}`);
            continue;
        }

        console.log(`Generating: ${filename}`);

        const settings = getElevenLabsSettings(style);

        try {
            const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'xi-api-key': apiKey
                },
                body: JSON.stringify({
                    text,
                    model_id: 'eleven_multilingual_v2',
                    voice_settings: settings
                })
            });

            if (!res.ok) {
                console.error(`Failed to generate ${filename}: ${res.statusText}`);
                const textErr = await res.text();
                console.error(textErr);
                continue;
            }

            const buffer = await res.arrayBuffer();
            fs.writeFileSync(filepath, Buffer.from(buffer));
            console.log(`Saved: ${filename}`);
        } catch (err) {
            console.error(`Error with ${filename}:`, err.message);
        }

        await new Promise(r => setTimeout(r, 500));
    }

    const mapFile = path.join(__dirname, '../src/utils/audioMap.js');
    fs.writeFileSync(mapFile, `export const audioMap = ${JSON.stringify(mapData, null, 2)};\n`);
    console.log('Done generating! Map saved to src/utils/audioMap.js');
}

generate();
