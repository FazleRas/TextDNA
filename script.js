const ta = document.getElementById('inputText');

ta.addEventListener('input', () => {
  document.getElementById('charCount').textContent = ta.value.length + ' characters';
});

function analyze() {
  const raw = ta.value.trim();

  if (raw.length < 10) {
    ta.classList.add('error');
    setTimeout(() => ta.classList.remove('error'), 800);
    return;
  }

  // --- Core metrics ---
  const words = raw.match(/\b\w+\b/g) || [];
  const sentences = raw.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
  const totalChars = words.reduce((a, w) => a + w.length, 0);

  const avgWordLen = words.length ? (totalChars / words.length) : 0;
  const avgSentLen = sentences.length ? (words.length / sentences.length) : 0;

  // --- Pattern detectors ---
  const ellipsis    = (raw.match(/\.\.\./g) || []).length;
  const allCaps     = (raw.match(/\b[A-Z]{2,}\b/g) || []).length;
  const exclamations = (raw.match(/!/g) || []).length;
  const questions   = (raw.match(/\?/g) || []).length;
  const commas      = (raw.match(/,/g) || []).length;
  const noPunct     = !raw.match(/[.!?,;]/);
  const lowercase   = raw === raw.toLowerCase();
  const longWords   = words.filter(w => w.length >= 8).length;
  const shortWords  = words.filter(w => w.length <= 3).length;
  const hedges      = (raw.match(/\b(idk|maybe|kinda|sorta|guess|probably|perhaps|might|like|literally)\b/gi) || []).length;
  const filler      = (raw.match(/\b(um|uh|like|well|so|okay|ok|right)\b/gi) || []).length;

  // --- Stat cards ---
  const stats = [
    { label: 'Words',              val: words.length },
    { label: 'Sentences',          val: sentences.length },
    { label: 'Avg words/sentence', val: avgSentLen.toFixed(1) },
    { label: 'Avg word length',    val: avgWordLen.toFixed(1) + ' chars' },
  ];

  // --- Trait tags ---
  const traits = [];
  if (ellipsis >= 2)                          traits.push('hesitates a lot');
  if (allCaps >= 2)                           traits.push('very emphatic');
  if (exclamations >= 3)                      traits.push('enthusiastic');
  if (questions >= 3)                         traits.push('always questioning');
  if (hedges >= 3)                            traits.push('noncommittal');
  if (filler >= 3)                            traits.push('thinks out loud');
  if (noPunct)                                traits.push('no time for punctuation');
  if (lowercase)                              traits.push('casual typer');
  if (avgSentLen < 7)                         traits.push('blunt and direct');
  if (avgSentLen > 20)                        traits.push('over-explainer');
  if (longWords / words.length > 0.2)         traits.push('vocabulary flex');
  if (shortWords / words.length > 0.65)       traits.push('simple communicator');
  if (commas > 5)                             traits.push('stream of consciousness');
  if (sentences.length === 1 && words.length > 30) traits.push('needs to breathe');

  // --- Personality profiles ---
  let vibeLabel = '';
  let vibeDesc  = '';

  if (ellipsis >= 3 && hedges >= 2) {
    vibeLabel = 'The Chronic Hesitator';
    vibeDesc  = "You type like you're texting someone you're not sure likes you back. Every sentence trails off into possibility. You've probably rewritten this three times.";
  } else if (allCaps >= 3 || exclamations >= 4) {
    vibeLabel = 'Chaotic Energy Type';
    vibeDesc  = "You communicate at full volume. No context, no chill. People either love getting messages from you or mute you — no in between.";
  } else if (noPunct && lowercase) {
    vibeLabel = 'Chronically Online';
    vibeDesc  = "Punctuation is for formal people and you're not one of them. You type how you think — fast, lowercase, unfiltered. Zero drafts. One send.";
  } else if (avgSentLen < 6) {
    vibeLabel = 'The Two-Word Texter';
    vibeDesc  = "Short. Blunt. Efficient. You probably respond with 'ok' to paragraphs and feel fine about it. You don't explain yourself — others should keep up.";
  } else if (avgSentLen > 22) {
    vibeLabel = 'The Over-Explainer';
    vibeDesc  = "You type like every message could be misunderstood, so you add just one more sentence to clarify. Then another. Then a disclaimer. It's a lot, but you mean well.";
  } else if (hedges >= 4) {
    vibeLabel = 'The Maybe Person';
    vibeDesc  = "You can't commit to a statement without softening it. 'Maybe,' 'kinda,' 'I guess' — you leave every door open. Great for flexibility. Exhausting for decisions.";
  } else if (longWords / words.length > 0.25) {
    vibeLabel = 'Secretly a Nerd';
    vibeDesc  = "You use words that other people have to look up. You probably correct people's spelling in your head (and sometimes out loud). We see you.";
  } else if (commas > 6 && sentences.length <= 2) {
    vibeLabel = 'Stream of Consciousness';
    vibeDesc  = "Your thoughts arrive in a continuous river with no natural stopping points, you just keep going, adding more, one idea into the next, which is fine, actually kind of poetic.";
  } else if (questions >= 3) {
    vibeLabel = 'The Overthinker';
    vibeDesc  = "You can't just say a thing — you have to interrogate it. Are you sure? But what does it mean? What if you're wrong? This is also your inner monologue, isn't it.";
  } else {
    vibeLabel = 'Balanced Communicator';
    vibeDesc  = "You write clearly, without chaos. Normal sentence length, reasonable punctuation, no red flags. Either you're well-adjusted or very good at hiding it.";
  }

  // --- Render stats ---
  const grid = document.getElementById('statsGrid');
  grid.innerHTML = stats.map(s => `
    <div class="stat-card">
      <p class="stat-label">${s.label}</p>
      <p class="stat-val">${s.val}</p>
    </div>
  `).join('');

  // --- Render result ---
  document.getElementById('vibeLabel').textContent = vibeLabel;
  document.getElementById('vibeDesc').textContent  = vibeDesc;

  const tl = document.getElementById('traitList');
  tl.innerHTML = traits.length
    ? traits.map(t => `<span class="trait-pill">${t}</span>`).join('')
    : '<span class="trait-pill">no strong signals detected</span>';

  // --- Show output ---
  const output = document.getElementById('output');
  output.classList.remove('hidden');
  output.scrollIntoView({ behavior: 'smooth', block: 'start' });
}