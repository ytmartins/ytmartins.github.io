const clamp = value => Math.min(1, Math.max(0, value));
const mix = (from, to, amount) => from + (to - from) * amount;
const smooth = value => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

function surface(width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas.getContext('2d');
}

function grain(seed) {
  const width = 896;
  const height = 560;
  const context = surface(width, height);
  const texture = context.createImageData(width, height);
  const horizontal = Array.from({ length: width }, (_, x) => {
    const u = x / (width - 1);
    return smooth((u - .10) / .62) * (1 - .20 * smooth((u - .90) / .10));
  });
  for (let y = 0; y < height; y++) {
    const vertical = Math.sin(Math.PI * y / height) ** 1.5;
    for (let x = 0; x < width; x++) {
      seed = (Math.imul(1664525, seed) + 1013904223) >>> 0;
      const sample = (seed >>> 24) / 255;
      const fade = horizontal[x] * vertical;
      const light = sample > .53;
      const index = (y * width + x) * 4;
      texture.data[index] = light ? 247 : 41;
      texture.data[index + 1] = light ? 251 : 76;
      texture.data[index + 2] = light ? 241 : 64;
      texture.data[index + 3] = Math.abs(sample - .53) * fade * 49;
    }
  }
  context.putImageData(texture, 0, 0);
  return context.canvas;
}

export function createLiquidBackground() {
  const width = 180;
  const height = 96;
  const wash = surface(width, height);
  const image = wash.createImageData(width, height);
  const textures = [grain(917521), grain(209491)];
  const verticalFade = Array.from({ length: height }, (_, y) => Math.sin(Math.PI * y / (height - 1)));
  let lastUpdate = -100;

  function ripple(time, cursor, intensity) {
    const phase = time / 1510;
    for (let x = 0; x < width; x++) {
      const u = x / (width - 1);
      const distance = u - cursor.x;
      const side = smooth((u - .25) / .53);
      const middle = smooth((u - .22) / .33) * (1 - smooth((u - .54) / .31));
      const focus = Math.exp(-15 * distance * distance) * intensity * side;
      const sweep = .14 * Math.sin(phase - u * 3.6 + .65);
      const curl = .044 * Math.sin(phase * 1.43 + u * 7.6);
      const center = .53 + .09 * (u - .5) + sweep + curl + (cursor.y - .51) * .56 * focus;
      const shoulder = center + .15 + .048 * Math.sin(u * 5.7 + phase * .72);
      const spread = .142 + .062 * u + .027 * Math.cos(phase * .71 - u * 2.8) + .029 * focus;
      const rightPool = Math.exp(-(((u - .99) / .34) ** 2));
      const warm = smooth((u - .64) / .36) * (.65 + .16 * Math.sin(phase - u * 3.1));
      const tint = [mix(38, 177, warm), mix(152, 159, warm), mix(116, 67, warm)];
      for (let y = 0; y < height; y++) {
        const v = y / (height - 1);
        const ribbon = Math.exp(-1.25 * ((v - center) / spread) ** 2);
        const wake = Math.exp(-1.65 * ((v - shoulder) / (spread * 1.25)) ** 2);
        const glow = rightPool * Math.exp(-4.3 * (v - .47) ** 2);
        const index = (y * width + x) * 4;
        image.data[index] = tint[0];
        image.data[index + 1] = tint[1];
        image.data[index + 2] = tint[2];
        const veil = side * .83 + .17;
        const depth = veil * (42 * ribbon + 16 * wake + 25 * glow) + middle * ribbon * 21;
        image.data[index + 3] = verticalFade[y] * (depth + focus * (13 * ribbon + 9 * wake));
      }
    }
    wash.putImageData(image, 0, 0);
  }

  return (context, bounds, time, cursor, intensity) => {
    if (time - lastUpdate >= 31 || time < lastUpdate) {
      ripple(time, cursor, intensity);
      lastUpdate = time;
    }
    const { x, width, waveTop } = bounds;
    const y = bounds.y + waveTop;
    const height = bounds.height - waveTop;
    context.save();
    context.beginPath();
    context.rect(x, y, width, height);
    context.clip();
    context.drawImage(wash.canvas, x, y, width, height);
    const blend = .5 + .14 * Math.sin(time / 1670);
    textures.forEach((texture, index) => {
      const shift = time / (index ? 1480 : 1930);
      context.globalAlpha = index ? blend : 1 - blend;
      context.drawImage(texture, x + Math.sin(shift) * 7, y + Math.cos(shift * .75) * 5, width * 1.015, height);
    });
    context.restore();
  };
}
