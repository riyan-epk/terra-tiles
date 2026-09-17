const encode = (svg: string) =>
  `data:image/svg+xml,${encodeURIComponent(svg)}`;

export const textures = {
  heroMarble: encode(`<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#2a2520"/>
        <stop offset="50%" stop-color="#3a3530"/>
        <stop offset="100%" stop-color="#1a1815"/>
      </linearGradient>
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="6" seed="2"/>
        <feColorMatrix type="saturate" values="0.1"/>
      </filter>
      <filter id="veins">
        <feTurbulence type="turbulence" baseFrequency="0.003 0.008" numOctaves="5" seed="8"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.85  0 0 0 0 0.8  0 0 0 0 0.75  0 0 0 2 -0.8"/>
      </filter>
    </defs>
    <rect width="100%" height="100%" fill="url(#bg)"/>
    <rect width="100%" height="100%" filter="url(#veins)" opacity="0.15"/>
    <rect width="100%" height="100%" filter="url(#noise)" opacity="0.08"/>
    <line x1="200" y1="0" x2="600" y2="1080" stroke="#b8a89840" stroke-width="1.5"/>
    <line x1="800" y1="0" x2="1100" y2="1080" stroke="#b8a89830" stroke-width="1"/>
    <line x1="1400" y1="0" x2="1000" y2="1080" stroke="#b8a89825" stroke-width="2"/>
    <line x1="500" y1="200" x2="1500" y2="400" stroke="#d4c5b520" stroke-width="0.8"/>
  </svg>`),

  marbleWhite: encode(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000">
    <defs>
      <linearGradient id="m" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#e8e0d8"/>
        <stop offset="40%" stop-color="#f5f0eb"/>
        <stop offset="100%" stop-color="#e0d8d0"/>
      </linearGradient>
      <filter id="mv">
        <feTurbulence type="turbulence" baseFrequency="0.004 0.01" numOctaves="5" seed="3"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.45  0 0 0 0 0.4  0 0 0 3 -1.5"/>
      </filter>
    </defs>
    <rect width="100%" height="100%" fill="url(#m)"/>
    <rect width="100%" height="100%" filter="url(#mv)" opacity="0.12"/>
    <path d="M100,0 Q300,250 200,500 T400,1000" stroke="#b8a89830" fill="none" stroke-width="2"/>
    <path d="M500,0 Q350,300 600,600 T500,1000" stroke="#8a7b6b25" fill="none" stroke-width="1.5"/>
  </svg>`),

  woodGrain: encode(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000">
    <defs>
      <linearGradient id="w" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#5a4636"/>
        <stop offset="30%" stop-color="#6d5442"/>
        <stop offset="60%" stop-color="#4a3828"/>
        <stop offset="100%" stop-color="#5d4838"/>
      </linearGradient>
      <filter id="wg">
        <feTurbulence type="fractalNoise" baseFrequency="0.02 0.003" numOctaves="6" seed="5"/>
        <feColorMatrix type="saturate" values="0.3"/>
      </filter>
    </defs>
    <rect width="100%" height="100%" fill="url(#w)"/>
    <rect width="100%" height="100%" filter="url(#wg)" opacity="0.2"/>
    ${Array.from({length: 20}, (_, i) =>
      `<line x1="0" y1="${i * 50 + 10}" x2="800" y2="${i * 50 + 15}" stroke="#3a281880" stroke-width="0.5"/>`
    ).join('')}
  </svg>`),

  stoneGrey: encode(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000">
    <defs>
      <linearGradient id="s" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#686058"/>
        <stop offset="50%" stop-color="#5a524a"/>
        <stop offset="100%" stop-color="#706860"/>
      </linearGradient>
      <filter id="sn">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" seed="7"/>
        <feColorMatrix type="saturate" values="0.15"/>
      </filter>
    </defs>
    <rect width="100%" height="100%" fill="url(#s)"/>
    <rect width="100%" height="100%" filter="url(#sn)" opacity="0.25"/>
  </svg>`),

  concrete: encode(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000">
    <defs>
      <linearGradient id="c" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#4a4a4a"/>
        <stop offset="50%" stop-color="#555555"/>
        <stop offset="100%" stop-color="#484848"/>
      </linearGradient>
      <filter id="cn">
        <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="4" seed="12"/>
        <feColorMatrix type="saturate" values="0"/>
      </filter>
    </defs>
    <rect width="100%" height="100%" fill="url(#c)"/>
    <rect width="100%" height="100%" filter="url(#cn)" opacity="0.15"/>
  </svg>`),

  mosaic: encode(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000">
    <rect width="100%" height="100%" fill="#e8e0d8"/>
    ${(() => {
      const colors = ['#d4c5b5','#c9a96e','#b8a898','#f5f0eb','#8a7b6b','#e0d8d0'];
      let hexes = '';
      for (let row = 0; row < 25; row++) {
        for (let col = 0; col < 16; col++) {
          const x = col * 52 + (row % 2) * 26;
          const y = row * 45;
          const c = colors[(row * 7 + col * 3) % colors.length];
          hexes += `<polygon points="${x},${y+15} ${x+13},${y} ${x+39},${y} ${x+52},${y+15} ${x+39},${y+30} ${x+13},${y+30}" fill="${c}" stroke="#b8a89830" stroke-width="1"/>`;
        }
      }
      return hexes;
    })()}
  </svg>`),

  terracotta: encode(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000">
    <defs>
      <linearGradient id="t" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#b06840"/>
        <stop offset="50%" stop-color="#c47850"/>
        <stop offset="100%" stop-color="#a06038"/>
      </linearGradient>
      <filter id="tn">
        <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="5" seed="15"/>
        <feColorMatrix type="saturate" values="0.3"/>
      </filter>
    </defs>
    <rect width="100%" height="100%" fill="url(#t)"/>
    <rect width="100%" height="100%" filter="url(#tn)" opacity="0.2"/>
  </svg>`),

  roomInterior: encode(`<svg xmlns="http://www.w3.org/2000/svg" width="900" height="675">
    <defs>
      <linearGradient id="wall" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#e8e0d8"/>
        <stop offset="100%" stop-color="#d4c5b5"/>
      </linearGradient>
      <linearGradient id="floor" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#8a7b6b"/>
        <stop offset="100%" stop-color="#6d5e4e"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="#f5f0eb"/>
    <polygon points="0,0 900,0 750,280 150,280" fill="url(#wall)"/>
    <polygon points="150,280 750,280 900,675 0,675" fill="url(#floor)"/>
    <line x1="150" y1="280" x2="0" y2="675" stroke="#b8a89840" stroke-width="1"/>
    <line x1="750" y1="280" x2="900" y2="675" stroke="#b8a89840" stroke-width="1"/>
    ${Array.from({length: 8}, (_, i) => {
      const y = 280 + i * 50;
      return `<line x1="0" y1="${y}" x2="900" y2="${y}" stroke="#b8a89820" stroke-width="0.5"/>`;
    }).join('')}
    <rect x="300" y="60" width="300" height="200" rx="2" fill="#c9a96e20" stroke="#c9a96e40" stroke-width="1"/>
    <rect x="580" y="320" width="120" height="180" rx="4" fill="#5a463640" stroke="#8a7b6b30" stroke-width="1"/>
    <ellipse cx="640" cy="300" rx="40" ry="30" fill="#6d5e4e30"/>
  </svg>`),

  interiorAccent: encode(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
    <defs>
      <linearGradient id="ia" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#3a3530"/>
        <stop offset="100%" stop-color="#2a2520"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#ia)"/>
    <rect x="40" y="40" width="160" height="320" fill="#c9a96e15" stroke="#c9a96e30" stroke-width="1"/>
    <rect x="220" y="80" width="140" height="240" fill="#b8a89810" stroke="#b8a89830" stroke-width="1"/>
  </svg>`),
};
