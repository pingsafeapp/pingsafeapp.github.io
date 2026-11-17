/* The app's screens, drawn in HTML from the app's real wording (res/values/strings.xml). Used by the website
   and the promo kit. PS.phone(name, opts) → '<div class="phone">…</div>'; PS.screen(name) → screen markup.
   Names in the demo: Maa shares her location, Rahul checks. Places and numbers are examples. */
(function () {
  const C = { mint: '#8EEBD8', lilac: '#B9B4F5', coral: '#F27C5C', butter: '#F7D46B', sky: '#9CCDEB', friend: '#5DC2B0' };
  const sb = (t = '6:42') => `<div class="sb"><span>${t}</span><span><b></b><i></i></span></div>`;
  const halo = (tint, color, mood, size = 150, extra = '') =>
    `<div class="halo" style="width:${size}px;height:${size}px;background:${tint}"><i class="blob" data-color="${color}" data-mood="${mood}" style="width:${size * 0.66}px;height:${size * 0.66}px" ${extra}></i></div>`;
  const dock = (on) => `<div class="dock">${['Home', 'Log', 'Settings'].map((t) => `<span class="${t === on ? 'on' : ''}">${t}</span>`).join('')}</div>`;

  // A still map picture: streets, a park, a lake, the accuracy circle and PingSafe's pin.
  const map = `<div class="map"><svg viewBox="0 0 320 168" preserveAspectRatio="xMidYMid slice">
    <rect width="320" height="168" fill="#EAF0E8"/>
    <path d="M196 0h124v62c-40 10-80 4-124-14z" fill="#CDE8D2"/>
    <path d="M0 120c30-8 60 2 78 20s10 28-6 28H0z" fill="#CFE3F2"/>
    <g fill="none" stroke="#fff" stroke-linecap="round">
      <path d="M-10 62 L330 30" stroke-width="12"/><path d="M110 -10 L150 180" stroke-width="10"/>
      <path d="M-10 128 C80 110 170 120 330 98" stroke-width="8"/><path d="M250 -10 L228 180" stroke-width="7"/>
      <path d="M40 -10 L60 180" stroke-width="5"/><path d="M180 60 L300 160" stroke-width="5"/>
    </g>
    <path d="M-10 62 L330 30" stroke="#F6DFA0" stroke-width="4" fill="none"/>
    <circle cx="168" cy="84" r="34" fill="#006B5E" fill-opacity=".12" stroke="#006B5E" stroke-opacity=".35" stroke-width="1.5"/>
    <g transform="translate(168 84)"><circle r="13" fill="#1C1C1E"/><circle r="6" fill="#8EEBD8"/></g>
  </svg></div>`;

  const screens = {
    // Checker (Rahul) — Home with the Ping button
    checkerHome: () => `${sb()}<div class="layer">
      <div class="top"><span class="chip"><span class="dot"></span>Paired with Maa</span><span class="stamp" style="color:#3C368F;rotate:3deg">5-day streak</span></div>
      <h3>Ping <em>Maa</em></h3>
      <p class="cap">Wondering where Maa is? Ask, don't call.</p>
      <div class="grow"></div>
      <div class="row" style="justify-content:center;gap:10px;margin-bottom:22px">${halo('#ECEAFD', C.lilac, 'sleepy', 84)}<span class="cap" style="text-align:left;max-width:130px"><b style="color:#1C1C1E">Maa's phone is asleep</b><br>It wakes only when you ask.</span></div>
      <div class="ring" data-part="ring"><div class="ringbtn" data-part="ping">Ping</div></div>
      <p class="cap" style="margin-top:26px">This usually takes a few seconds.</p>
      <div class="grow"></div>${dock('Home')}</div>`,

    // Checker — waiting, delivered
    checkerWaiting: () => `${sb()}<div class="layer">
      <h3 style="margin-top:20px">Waiting for an <em>answer</em></h3>
      <div class="grow"></div>
      ${halo('#ECEAFD', C.lilac, 'calm', 170, 'data-nozz')}
      <div class="grow"></div>
      <div class="tint" style="background:var(--mint-t);color:var(--mint-i);text-align:center;font-weight:700">✓ Delivered to Maa's phone</div>
      <p class="cap" style="margin:14px 0 18px">This usually takes a few seconds. On some phones it can take up to a minute.</p>
      <div class="pill light">Cancel ping</div></div>`,

    // Checker — the answer
    checkerResult: () => `${sb('6:42')}<div class="layer" style="gap:12px">
      <h3>Maa's <em>location</em></h3>
      ${map}
      <div><b style="font:800 20px/26px Jakarta;color:#1C1C1E">Indiranagar, Bengaluru</b><p class="cap" style="text-align:left">Fresh location. Maa tapped Answer · within 12 m</p></div>
      <div class="stat"><div><small>Battery</small><b>64%</b></div><div><small>Power</small><b>Unplugged</b></div><div><small>Network</small><b>Wi-Fi</b></div></div>
      <div class="note" style="background:var(--mint-t);color:var(--mint-i);rotate:-1.2deg">Maa answered in 4 seconds. No call needed.</div>
      <div class="grow"></div><div class="pill">Open in Maps</div></div>`,

    // Sharer (Maa) — Home, asleep until asked
    sharerHome: () => `${sb('6:41')}<div class="layer">
      <div class="top"><span class="chip"><span class="dot"></span>Paired with Rahul</span></div>
      <h3 style="margin-top:14px"><em>Ready</em> when Rahul pings.</h3>
      <p class="cap">Your location is read only when Rahul pings.</p>
      <div class="grow"></div>${halo('#FFF3C9', C.butter, 'sleepy', 190)}<div class="grow"></div>
      <div class="card" style="display:flex;flex-direction:column;gap:14px">
        <div class="row"><span style="flex:1;font-weight:700">Answer automatically</span><span class="tog off"></span></div>
        <div class="row"><span style="flex:1;font-weight:700">Low-battery alert · 10%</span><span class="tog"></span></div>
      </div>${dock('Home')}</div>`,

    // Sharer — the answer screen
    sharerAnswer: () => `${sb('6:42')}<div class="layer" style="gap:12px">
      ${halo('#FFF3C9', C.butter, 'calm', 110, 'data-nozz')}
      <h3>Let <em>Rahul</em> know where you are?</h3>
      <p class="cap">Rahul pinged you. They'll see your location, battery and the time, once.</p>
      <div class="note" style="background:var(--butter-t);color:var(--butter-i);rotate:1.4deg;margin:6px 8px"><span class="label" style="display:block;text-align:left;color:inherit;opacity:.7">Note from Rahul</span>Are you okay?</div>
      <div class="grow"></div>
      <div class="pill" data-part="answer">Answer with my location</div>
      <p class="label" style="margin-top:4px">Without your location</p>
      <div class="pill light">I'm fine</div>
      <p class="cap" style="margin-top:2px">Decline this ping</p></div>`,

    // Sharer — sent
    sharerSent: () => `${sb('6:42')}<div class="layer" style="gap:14px">
      <div class="grow"></div>${halo('#D5F5EE', C.mint, 'happy', 170, 'data-nozz')}
      <h3>Location sent to <em>Rahul</em></h3>
      <p class="cap">Sent at 6:42 pm. You tapped Answer.</p>
      <div style="text-align:center"><span class="stamp" style="color:var(--mint-i);rotate:-4deg">Sent once</span></div>
      <div class="grow"></div><div class="pill light">Done</div></div>`,

    // Checker — the low-battery alert
    lowBattery: () => `${sb('9:14')}<div class="layer" style="gap:14px">
      <h3 style="margin-top:12px">Maa's phone is at <em style="color:#81280F">10%</em></h3>
      <div class="tint" style="background:var(--coral-t);color:var(--coral-i);font-weight:600">Here's where they were before it went quiet: Indiranagar, Bengaluru, 9:12 pm.</div>
      ${map}
      <p class="cap">Sent once, at the level Maa picked.</p>
      <div class="grow"></div><div class="pill">Open in Maps</div></div>`,
  };

  function screen(name) { return screens[name](); }
  function phone(name, { s = 0.8, cls = '', attrs = '', style = '' } = {}) {
    return `<div class="phone ${cls}" style="--s:${s};${style}" ${attrs}><div class="scr" data-screen="${name}">${screen(name)}</div></div>`;
  }
  window.PS = Object.assign(window.PS || {}, { screen, phone, screens, colors: C });
})();
