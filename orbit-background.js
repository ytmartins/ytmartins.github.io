const clamp = value => Math.min(1, Math.max(0, value));
const mix = (from, to, amount) => from + (to - from) * amount;

function surface(width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas.getContext('2d');
}

function grain(seed) {
  const width = 660;
  const height = 440;
  const context = surface(width, height);
  const texture = context.createImageData(width, height);
  const horizontal = Array.from({ length: width }, (_, x) => Math.sin(Math.PI * x / width) ** 1.5);
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
      texture.data[index + 3] = Math.abs(sample - .53) * fade * 42;
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
  let lastUpdate = -100;

  function ripple(time, cursor, intensity) {
    const phase = time / 2400;
    for (let x = 0; x < width; x++) {
      const u = x / (width - 1);
      const curl = Math.exp(-14 * (u - cursor.x) ** 2) * (cursor.y - .5) * .49 * intensity;
      const center = .66 - u * .20 + .11 * Math.sin(u * 6.3 - phase) + .072 * Math.sin(u * 12 - phase * 1.34) + curl;
      const spread = .10 + .081 * u;
      const warm = clamp((u - .54) * 2.8 + .18 * Math.sin(phase));
      const tint = [mix(42, 170, warm), mix(155, 157, warm), mix(122, 64, warm)];
      for (let y = 0; y < height; y++) {
        const v = y / (height - 1);
        const ribbon = Math.exp(-1.45 * ((v - center) / spread) ** 2);
        const tip = Math.exp(-((v - .38) ** 2 * 5.7 + (u - .83) ** 2 * 19));
        const edge = Math.sin(Math.PI * v) * clamp(u * 5);
        const index = (y * width + x) * 4;
        image.data[index] = tint[0];
        image.data[index + 1] = tint[1];
        image.data[index + 2] = tint[2];
        image.data[index + 3] = edge * (ribbon * mix(11, 34, u) + tip * (13 + 8 * intensity));
      }
    }
    wash.putImageData(image, 0, 0);
  }

  return (context, bounds, time, cursor, intensity) => {
    if (time - lastUpdate >= 31 || time < lastUpdate) {
      ripple(time, cursor, intensity);
      lastUpdate = time;
    }
    const { x, y, width, height } = bounds;
    context.save();
    context.beginPath();
    context.rect(x, y, width, height);
    context.clip();
    context.drawImage(wash.canvas, x, y, width, height);
    const blend = .5 + .5 * Math.sin(time / 490);
    textures.forEach((texture, index) => {
      const shift = time / (index ? 1100 : 870);
      context.globalAlpha = index ? blend : 1 - blend;
      context.drawImage(texture, x + width * .24 + Math.sin(shift) * 12, y + Math.cos(shift * .75) * 8, width * .86, height);
    });
    context.restore();
  };
}
