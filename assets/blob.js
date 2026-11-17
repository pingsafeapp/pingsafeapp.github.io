/* PingSafe's blob mascot as SVG, ported from the app (ui/Mascots.kt: blobPath + drawFace).
   Usage: <i class="blob" data-color="#B9B4F5" data-mood="sleepy|happy|calm" data-seed="1" data-zz></i>
   or PS.blob(color, mood, {seed, zz}) → SVG string. */
(function () {
  const SLATE = '#1C1C1E';

  function blobPath(cx, cy, r, seed) {
    const pts = [];
    for (let i = 0; i <= 72; i++) {
      const a = (2 * Math.PI * i) / 72;
      const wob = 1 + 0.045 * Math.sin(3 * a + seed) + 0.03 * Math.cos(2 * a + seed * 0.7);
      const squash = Math.sin(a) > 0 ? 1 : 0.94; // flatter top, fuller bottom
      pts.push(`${(cx + r * wob * Math.cos(a)).toFixed(2)},${(cy + r * wob * squash * Math.sin(a)).toFixed(2)}`);
    }
    return `M${pts.join('L')}Z`;
  }

  function z(x, y, s) {
    return `<path d="M${x - s / 2},${y - s / 2}H${x + s / 2}L${x - s / 2},${y + s / 2}H${x + s / 2}" fill="none" stroke="${SLATE}" stroke-opacity=".75" stroke-width="${(s * 0.28).toFixed(2)}" stroke-linecap="round" stroke-linejoin="round"/>`;
  }

  function blob(color, mood = 'sleepy', { seed = 0, zz = mood === 'sleepy' } = {}) {
    const W = 100, cx = 50, cy = 54, r = 40;
    const sw = (r * 0.075).toFixed(2);
    const eyeY = cy - r * 0.08, dx = r * 0.32, ew = r * 0.24;
    let face = '';
    // cheeks
    face += `<ellipse cx="${cx - dx - r * 0.11}" cy="${eyeY + r * 0.2}" rx="${r * 0.11}" ry="${r * 0.06}" fill="#FF8FA3" fill-opacity=".45"/>`;
    face += `<ellipse cx="${cx + dx + r * 0.11}" cy="${eyeY + r * 0.2}" rx="${r * 0.11}" ry="${r * 0.06}" fill="#FF8FA3" fill-opacity=".45"/>`;
    for (const s of [-1, 1]) {
      const ex = cx + s * dx;
      if (mood === 'sleepy') face += `<path d="M${ex - ew / 2},${eyeY} A${ew / 2},${ew / 3} 0 0 0 ${ex + ew / 2},${eyeY}" fill="none" stroke="${SLATE}" stroke-width="${sw}" stroke-linecap="round"/>`;
      else if (mood === 'happy') face += `<path d="M${ex - ew / 2},${eyeY + ew / 6} A${ew / 2},${ew / 3} 0 0 1 ${ex + ew / 2},${eyeY + ew / 6}" fill="none" stroke="${SLATE}" stroke-width="${sw}" stroke-linecap="round"/>`;
      else face += `<circle cx="${ex}" cy="${eyeY}" r="${r * 0.07}" fill="${SLATE}"/>`;
    }
    const my = cy + r * 0.22, mw = r * 0.3;
    face += mood === 'sleepy'
      ? `<path d="M${cx - mw / 3},${my}H${cx + mw / 3}" stroke="${SLATE}" stroke-width="${(r * 0.06).toFixed(2)}" stroke-linecap="round"/>`
      : `<path d="M${cx - mw / 2},${my - mw * 0.12} Q${cx},${my + mw * 0.5} ${cx + mw / 2},${my - mw * 0.12}" fill="none" stroke="${SLATE}" stroke-width="${sw}" stroke-linecap="round"/>`;
    const zs = zz ? `<g class="zz">${z(cx + r * 0.95, cy - r * 1.15, r * 0.2)}${z(cx + r * 1.3, cy - r * 0.8, r * 0.13)}</g>` : '';
    return `<svg viewBox="0 -8 ${W + 8} ${W + 8}" aria-hidden="true" focusable="false">
      <ellipse cx="${cx}" cy="${cy + r * 0.99}" rx="${r * 1.05}" ry="${r * 0.21}" fill="${color}" fill-opacity=".18"/>
      <g class="body"><path d="${blobPath(cx, cy, r, seed)}" fill="${color}"/>${face}</g>${zs}</svg>`;
  }

  function hydrate(root = document) {
    root.querySelectorAll('i.blob:not([data-done])').forEach((el) => {
      el.innerHTML = blob(el.dataset.color || '#8EEBD8', el.dataset.mood || 'sleepy', {
        seed: Number(el.dataset.seed || 0),
        zz: el.hasAttribute('data-zz') ? true : el.dataset.mood === 'sleepy' && !el.hasAttribute('data-nozz'),
      });
      el.dataset.done = '1';
    });
  }

  window.PS = Object.assign(window.PS || {}, { blob, hydrateBlobs: hydrate });
})();
