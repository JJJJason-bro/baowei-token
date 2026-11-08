const fs = require("fs");
const path = require("path");

const root = __dirname;
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const js = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const assert = (ok, message) => {
  if (!ok) throw new Error(message);
};

new Function(js);
assert(!/image-rendering:\s*(pixelated|crisp-edges)/.test(html), "pixelated canvas CSS remains");
assert(/imageSmoothingEnabled = true/.test(js), "high-quality smoothing is not enabled");
assert(/imageSmoothingQuality = "high"/.test(js), "image smoothing quality is not high");
assert(/maxSteps:\s*8\b/.test(js) && /speedMultiplier:\s*1\.25\b/.test(js),
  "logic speed configuration is missing");
assert(/autoCollect:\s*true/.test(js) &&
  /if \(CFG\.sun\.autoCollect\) \{\s*collectSun\(s\)/.test(js),
  "automatic sun collection is missing");
assert(/collectSpeed:\s*460\b/.test(js), "sun collection speed is not updated");
assert(/acc \+= dt \* CFG\.speedMultiplier/.test(js) && !/playbackRate/.test(js),
  "logic speed or BGM isolation is incorrect");
assert(/firstDelay:\s*12\b/.test(js), "temporary fast-spawn QA value is still active");
assert(/frog:\s*\{\s*x:\s*78,\s*y:\s*596/.test(js), "frog position no longer avoids mowers");
assert(/paidCost:\s*def\.cost/.test(js) && /Game\.sun \+= plant\.paidCost/.test(js) &&
  /p\.col === col && p\.row === row && !p\.dead/.test(js),
  "shovel refund is missing or can refund twice");
assert(/bgLawnRect:\s*\{\s*sx:\s*86/.test(js) && /bgLawnFill:\s*\{/.test(js),
  "initial background crop configuration is missing");
assert(/ctx\.drawImage\(el, lr\.sx, lr\.sy/.test(js) &&
  !/renderBattleMap|mapCanvas|getGrassTexture|grassTexture/.test(js),
  "background did not roll back to the initial source-image rendering");
assert(/const cw = Math\.max\(480, Math\.min\(window\.innerWidth/.test(js),
  "canvas no longer fills the available viewport");
assert(/const srcH = lr\.sh \* bottomH \/ gh/.test(js),
  "bottom grass extension is missing");
assert(/function hasTransparentBackground/.test(js) &&
  /hasTransparentBackground\(im\)\s*\?\s*im\s*:\s*cutoutImage\(im\)/.test(js),
  "transparent PNGs would still be cut out twice");
assert(/px\[i \* 4 \+ 3\] <= 200/.test(js), "cutout alpha guard is missing");
assert(/minX - 2/.test(js) && /dw < w \* 0\.6/.test(js), "cutout/draw safety guards are missing");
assert(/tip:\s*\{\s*kind:\s*"",\s*ref:\s*null/.test(js) &&
  !/cardTip|drawCardTooltip/.test(js), "unified tooltip state is incomplete");
assert(/function cardAtPointer/.test(js) && /function plantAtPointer/.test(js) &&
  /function zombieAtPointer/.test(js), "tooltip target hit tests are incomplete");
assert(/function drawTooltip/.test(js) && /drawTooltip\(\)/.test(js),
  "unified tooltip renderer is missing");
assert(/rps:\s*\{\s*playerChoice:\s*-1/.test(js) && /Function drawRPS|function drawRPS/.test(js) &&
  /rpsEntry/.test(js) && /rpsBtns/.test(js), "rock-paper-scissors UI is incomplete");
assert(/player === 0 && dragon === 1/.test(js) && /playSfx\("laugh"\)/.test(js),
  "rock-paper-scissors win rules or sound are missing");
assert(/setState\("INTRO"\)/.test(js) && /Game\.state === "ALMANAC"/.test(js),
  "intro/almanac states are incomplete");
assert(/drawIntro\(\)/.test(js) && /drawAlmanac\(\)/.test(js), "intro/almanac renderers are missing");
assert(/const CAMPAIGN = \[/.test(js) && /waveLimit:\s*4\b/.test(js) &&
  /waveLimit:\s*5\b/.test(js) && /waveLimit:\s*6\b/.test(js),
  "campaign level data is incomplete");
assert(/function startEndless/.test(js) && /function startCampaign/.test(js) &&
  /function showStory/.test(js) && /function winLevel/.test(js),
  "campaign state flow is incomplete");
assert(/const BUFFS = \{/.test(js) && (js.match(/kind:\s*"good"/g) || []).length >= 3 &&
  (js.match(/kind:\s*"bad"/g) || []).length >= 3,
  "six buff definitions are incomplete");
assert(/modifiers:\s*createDefaultModifiers\(\)/.test(js) &&
  /function openBuffRoll/.test(js) && /function applyBuff/.test(js) &&
  /function drawRoll/.test(js) && /remainingRounds = 3/.test(js) &&
  /ids\.slice\(0, 1\)/.test(js) && /系统抽卡：本次微调结果/.test(js),
  "single-card buff roll state or renderer is incomplete");
assert(/Game\.modifiers\.atkMul/.test(js) && /Game\.modifiers\.sunMul/.test(js) &&
  /Game\.modifiers\.cdMul/.test(js) && /Game\.modifiers\.zombieSpdMul/.test(js),
  "buff modifiers are not wired into combat");
assert((js.match(/info:\s*\{/g) || []).length >= 14, "plant/zombie info entries are incomplete");
assert((js.match(/lore:\s*\{/g) || []).length === 14, "all 14 characters need lore");
assert(/const STORY = \{/.test(js) && /title:\s*"下架之夜"/.test(js),
  "story data is missing");
assert(/almanac:\s*\{\s*tab:\s*"plants",\s*page:\s*0/.test(js),
  "almanac tab/page state is missing");
assert(/almanacTabPlants/.test(js) && /almanacTabZombies/.test(js) &&
  /almanacPrev/.test(js) && /almanacNext/.test(js), "almanac controls are incomplete");
assert(/start = Game\.almanac\.page \* 4/.test(js) && /drawSprite\(entry\.key/.test(js),
  "almanac must page four image cards");
assert(!/drawAlmanacEntry/.test(js), "old all-in-one almanac list remains");

for (const [file, width, height] of [
  ["assets/frog/idle.png", 364, 502],
  ["assets/plants/pinkguard.png", 182, 245]
]) {
  const png = fs.readFileSync(path.join(root, file));
  assert(png.toString("ascii", 1, 4) === "PNG", file + " is not a PNG");
  assert(png.readUInt32BE(16) === width && png.readUInt32BE(20) === height,
    file + " dimensions do not match the repaired asset");
  assert(png[25] === 6, file + " must keep an RGBA channel");
}

console.log("qa-check: all static checks passed");
