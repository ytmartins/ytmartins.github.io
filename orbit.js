import { createLiquidBackground } from './orbit-background.js';

(() => {
  const stage = document.querySelector('.spatial-orbit');
  const heroPanel = stage?.closest('.spatial-hero');
  const hub = document.querySelector('.orbit-hub');
  const main = document.querySelector('#main');
  const canvas = document.querySelector('#orbit-canvas');
  const still = document.querySelector('#orbit-still');
  const liveContext = canvas?.getContext('2d');
  let ctx = liveContext;
  if (!stage || !hub || !ctx || !still) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const forcedColors = matchMedia('(forced-colors: active)');
  const stacked = matchMedia('(max-width: 1000px)');
  const verticalRail = matchMedia('(max-width: 640px)');
  const cards = [...hub.querySelectorAll('.expertise-item')];
  const tau = 2 * Math.PI;
  const paintBackground = createLiquidBackground();
  const clamp = value => Math.min(1, Math.max(0, value));
  const mix = (from, to, amount) => from + (to - from) * amount;
  const smooth = value => {
    const t = clamp(value);
    return t * t * (3 - 2 * t);
  };
  const sphere = Array.from({ length: 480 }, (_, index) => {
    const y = 1 - 2 * (index + .5) / 480;
    const r = Math.sqrt(1 - y * y);
    const angle = index * Math.PI * (3 - Math.sqrt(5));
    return [r * Math.cos(angle), y, r * Math.sin(angle)];
  });
  const segments = 96;
  const circle = Array.from({ length: segments + 1 }, (_, index) => {
    const angle = index * tau / segments;
    return [Math.cos(angle), Math.sin(angle)];
  });
  const orbits = [
    { radius: 1.30, tilt: .92, roll: -.52, speed: .55, phase: .45 },
    { radius: 1.22, tilt: 1.16, roll: 1.16, speed: -.42, phase: 2.72 },
    { radius: 1.15, tilt: .62, roll: -.20, speed: .35, phase: 4.8 },
  ];
  const colors = [[32, 126, 101], [47, 130, 82], [104, 127, 53], [157, 124, 29]];
  const ash = '#596c71';
  const rgba = ([r, g, b], alpha) => `rgba(${r} ${g} ${b} / ${alpha})`;
  const colorAt = x => {
    const warmth = smooth((x + .45) / .9);
    return colors[0].map((channel, index) => Math.round(mix(channel, colors[3][index], warmth)));
  };

  // Successive points follow the same light with increasing drag, producing a soft wake.
  const wake = [{ x: -.6, y: -.2 }, { x: -.6, y: -.2 }, { x: -.6, y: -.2 }];
  const drag = [43, 128, 248];
  const pointerCenter = { x: 0, y: 0 };
  let layout;
  let ratio = 1;
  let frame = 0;
  let previous = 0;
  let time = 0;
  let connectionTime = 0;
  let rotation = .36;
  let energy = 0;
  let follow = 0;
  let pointer = null;
  const root = document.documentElement;
  let opening = root.classList.contains('orbit-opening');
  let openingStart;

  function finishOpening() {
    opening = false;
    root.classList.remove('orbit-opening');
  }

  function openingPose(pose, now) {
    if (!opening) return pose;
    if (reduced.matches || stacked.matches || scrollY > 34 || location.hash) {
      finishOpening();
      return pose;
    }
    openingStart ??= now;
    const elapsed = now - openingStart;
    if (elapsed >= 940) {
      finishOpening();
      return pose;
    }
    const glide = smooth((elapsed - 245) / 695);
    return {
      ...pose,
      x: mix(layout.width * .5, pose.x, glide),
      y: mix(Math.min(layout.height * .5, pose.y + 55), pose.y, glide),
      r: pose.r * mix(.86, 1, glide),
    };
  }

  function measure() {
    const width = document.documentElement.clientWidth;
    const height = innerHeight;
    const top = scrollY;
    const heroRect = stage.getBoundingClientRect();
    const panelRect = heroPanel.getBoundingClientRect();
    const hubRect = hub.getBoundingClientRect();
    const mainRect = main.getBoundingClientRect();
    ratio = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    layout = {
      width, height,
      main: { y: top + mainRect.top, height: mainRect.height },
      panel: { x: 0, y: top + panelRect.top, width, height: panelRect.height },
      hero: { x: heroRect.left + heroRect.width / 2, y: top + heroRect.top + heroRect.height / 2, r: heroRect.height * .35 },
      landing: { x: hubRect.left + hubRect.width / 2, y: top + hubRect.top + 38, r: verticalRail.matches ? 23 : 27 },
      anchors: cards.map(card => {
        const rect = card.getBoundingClientRect();
        const padding = Number.parseFloat(getComputedStyle(card).paddingLeft);
        return { x: rect.left + (verticalRail.matches ? 1 : padding + 15), y: top + rect.top + (verticalRail.matches ? 24 : 3) };
      }),
    };
    if (reduced.matches) drawStill();
    else schedule();
  }

  function positions() {
    const { hero, landing, height } = layout;
    const top = scrollY;
    const start = Math.min(64, hero.y * .13);
    const end = Math.max(start + 150, landing.y - height * .33);
    const progress = smooth((top - start) / (end - start));
    if (stacked.matches) {
      const fade = smooth((hero.y + hero.r * 1.45 - top) / (hero.r * 2.3));
      const arrival = smooth((height - landing.y + top) / (height * .24));
      return {
        hero: { ...hero, y: hero.y - top, opacity: fade },
        landing: { ...landing, y: landing.y - top, opacity: arrival },
        link: arrival,
        turn: .81 * arrival,
      };
    }
    return {
      hero: {
        x: mix(hero.x, landing.x, progress) - Math.min(52, layout.width * .045) * Math.sin(progress * Math.PI),
        y: mix(hero.y, landing.y, progress) - top,
        r: mix(hero.r, landing.r, progress),
        opacity: 1,
      },
      link: smooth((progress - .57) / .43),
      turn: .81 * progress,
    };
  }

  function projector(roll) {
    const sl = Math.sin(-.22);
    const cl = Math.cos(-.22);
    const sr = Math.sin(roll);
    const cr = Math.cos(roll);
    return (x, y, z) => {
      const depth = z * cl + y * sl;
      const lifted = y * cl - z * sl;
      const scale = 4.7 / (4.7 - depth);
      return [scale * (x * cr - lifted * sr), scale * (x * sr + lifted * cr), depth];
    };
  }

  function spot(x, y, radius, color, alpha, stretch = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(stretch, 1);
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
    gradient.addColorStop(0, rgba(color, alpha));
    gradient.addColorStop(.48, rgba(color, alpha * .38));
    gradient.addColorStop(1, rgba(color, 0));
    ctx.fillStyle = gradient;
    ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
    ctx.restore();
  }

  function lightAt(x, y) {
    const [head, middle, tail] = wake;
    const spread = point => Math.exp(-((x - point.x) ** 2 + (y - point.y) ** 2) * 5.9);
    return clamp(spread(head) * .90 + spread(middle) * .26 + spread(tail) * .16) * energy;
  }

  function traceOrbit(path, front, opacity, radius) {
    ctx.beginPath();
    for (let index = 1; index < path.length; index++) {
      const [x, y, depth] = path[index];
      if ((depth >= 0) !== front) continue;
      const [px, py] = path[index - 1];
      ctx.moveTo(px, py);
      ctx.lineTo(x, y);
    }
    ctx.strokeStyle = ash;
    ctx.lineWidth = (front ? 1 : .8) / radius;
    ctx.globalAlpha = opacity * (front ? .44 : .23);
    ctx.stroke();
    if (!front || energy <= .01) return;
    const [{ x, y }] = wake;
    const color = colorAt(x);
    const shine = ctx.createRadialGradient(x, y, 0, x, y, .9);
    shine.addColorStop(0, rgba(color, .84));
    shine.addColorStop(.55, rgba(color, .4));
    shine.addColorStop(1, rgba(color, 0));
    ctx.strokeStyle = shine;
    ctx.lineWidth = 1.9 / radius;
    ctx.globalAlpha = opacity * energy;
    ctx.stroke();
  }

  function drawNearbyLinks(dots, opacity, radius) {
    const local = dots.filter(dot => dot.proximity > .10).sort((a, b) => b.proximity - a.proximity).slice(0, 11);
    ctx.globalAlpha = opacity;
    for (let index = 0; index < Math.min(6, local.length - 1); index++) {
      const from = local[index];
      let nearest;
      let distance = .20 ** 2;
      for (const to of local.slice(index + 1)) {
        const gap = (to.x - from.x) ** 2 + (to.y - from.y) ** 2;
        if (gap < distance) {
          distance = gap;
          nearest = to;
        }
      }
      if (nearest) {
        const strength = Math.sqrt(from.proximity * nearest.proximity);
        stroke([from, nearest], colorAt(pointerCenter.x), .9 / radius, .50 * strength);
      }
    }
  }

  function drawGlobe(pose, spin, height = layout.height) {
    if (!isVisible(pose, height)) return;
    const { x, y, r, opacity } = pose;
    const compact = smooth((r - 30) / 90);
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(r, r);
    ctx.globalAlpha = opacity;
    spot(.12, .03, 1.31, colors[0], .10 * compact, 1.23);
    if (energy > .01) {
      // Broad pigment under the points and a tighter glow on the moving surface.
      spot(wake[2].x * .69, wake[2].y * .74, 1.05, colorAt(wake[2].x), .15 * energy * compact, 1.77);
      spot(wake[0].x * .91, wake[0].y * .91, .58, colorAt(wake[0].x), .26 * energy * compact, 1.24);
    }
    const paths = orbits.map(orbit => {
      const tilt = orbit.tilt + .42 * Math.sin(spin * 1.95 + orbit.phase);
      const project = projector(orbit.roll + spin * orbit.speed);
      const cos = Math.cos(tilt);
      const sin = Math.sin(tilt);
      return circle.map(([x, y]) => project(orbit.radius * x, orbit.radius * y * cos, orbit.radius * y * sin));
    });
    paths.forEach(path => traceOrbit(path, false, opacity, r));

    const cos = Math.cos(spin);
    const sin = Math.sin(spin);
    const project = projector(-.20);
    const response = compact * follow;
    const dots = sphere.map(([a, b, c]) => {
      const [x, y, depth] = project(a * cos + c * sin, b, c * cos - a * sin);
      const light = depth >= 0 && energy > .003 ? lightAt(x, y) : 0;
      const rim = smooth((1.04 - Math.hypot(x, y)) / .27);
      const dx = x - pointerCenter.x;
      const dy = y - pointerCenter.y;
      const distance = Math.hypot(dx, dy);
      const proximity = depth >= 0 && response > .01 ? response * smooth((.46 - distance) / .33) : 0;
      const push = .087 * proximity * rim / (distance + .045);
      const drift = light * .089 * compact * rim;
      return {
        x: x + dx * push - (y - wake[0].y) * drift,
        y: y + dy * push + (x - wake[0].x) * drift,
        depth, light, proximity,
      };
    });
    if (response > .035) drawNearbyLinks(dots, opacity, r);
    const dotSize = mix(.015, .0115, compact);
    for (const front of [false, true]) {
      for (const { x, y, depth, light } of dots) {
        if ((depth >= 0) !== front) continue;
        const size = dotSize * (front ? .84 + depth * .32 + light * .64 : .72);
        const color = light > .06 ? colorAt(x) : null;
        if (light > .16) {
          ctx.globalAlpha = opacity * light * .23;
          ctx.fillStyle = rgba(color, 1);
          ctx.beginPath();
          ctx.arc(x, y, size * 2.15, 0, tau);
          ctx.fill();
        }
        ctx.globalAlpha = opacity * (front ? .49 + .25 * depth + light * .24 : .175);
        ctx.fillStyle = color ? rgba(color, .46 + .54 * light) : ash;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, tau);
        ctx.fill();
      }
    }
    paths.forEach(path => traceOrbit(path, true, opacity, r));
    ctx.restore();
  }

  function curve(x, y, p1, p2, target, progress = 1) {
    return Array.from({ length: 29 }, (_, step) => {
      const t = step * progress / 28;
      const a = 1 - t;
      return {
        x: a ** 3 * x + 3 * a * a * t * p1.x + 3 * a * t * t * p2.x + t ** 3 * target.x,
        y: a ** 3 * y + 3 * a * a * t * p1.y + 3 * a * t * t * p2.y + t ** 3 * target.y,
      };
    });
  }

  function stroke(points, color, width, opacity) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let index = 1; index < points.length; index++) ctx.lineTo(points[index].x, points[index].y);
    ctx.lineWidth = width;
    ctx.strokeStyle = rgba(color, opacity);
    ctx.stroke();
  }

  function signal(points, age, color) {
    if (age < 0 || age > 3000) return;
    const lengths = [0];
    for (let index = 1; index < points.length; index++) {
      const from = points[index - 1];
      const to = points[index];
      lengths.push(lengths[index - 1] + Math.hypot(to.x - from.x, to.y - from.y));
    }
    const length = lengths.at(-1);
    const duration = Math.min(1700, 540 + length * 1.16);
    const distance = age / duration * length;
    const tail = Math.min(65, length * .62);
    const pointAt = at => {
      const end = lengths.findIndex(value => value >= at);
      if (end <= 0) return end === 0 ? points[0] : points.at(-1);
      const ratio = (at - lengths[end - 1]) / (lengths[end] - lengths[end - 1]);
      return { x: mix(points[end - 1].x, points[end].x, ratio), y: mix(points[end - 1].y, points[end].y, ratio) };
    };

    for (let part = 0; part < 10; part++) {
      const from = Math.max(0, distance - tail * (1 - part / 10));
      const to = Math.min(length, distance - tail * (1 - (part + 1) / 10));
      if (to > from) stroke([pointAt(from), pointAt(to)], color, 1.85 + .55 * part / 10, .16 + .81 * part / 10);
    }
    if (distance > 0 && distance < length) {
      const tip = pointAt(distance);
      spot(tip.x, tip.y, 12, color, .23);
      ctx.fillStyle = rgba(color, .95);
      ctx.beginPath();
      ctx.arc(tip.x, tip.y, 2.6, 0, tau);
      ctx.fill();
    }
    const arrival = (age - duration) / 570;
    if (arrival >= 0 && arrival < 1) {
      const target = points.at(-1);
      const fade = (1 - arrival) ** 2;
      spot(target.x, target.y, 16, color, .31 * fade);
      ctx.strokeStyle = rgba(color, .57 * fade);
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.arc(target.x, target.y, 3.6 + arrival * 9, 0, tau);
      ctx.stroke();
    }
  }

  function connectionVisible(pose, amount, top = scrollY, height = layout.height) {
    return amount > .003 && pose.y < height + 80 && layout.anchors.at(-1).y - top > -48;
  }

  function drawConnections(pose, amount, top = scrollY, height = layout.height) {
    if (!connectionVisible(pose, amount, top, height)) return;
    const anchors = layout.anchors.map(({ x, y }) => ({ x, y: y - top }));
    const left = verticalRail.matches;
    const rail = anchors[0].x - 13;
    const railTop = anchors[0].y - 29;
    const origin = { x: pose.x, y: pose.y + pose.r * .86 };
    const trunk = left ? curve(origin.x, origin.y, { x: origin.x, y: railTop - 11 }, { x: rail, y: railTop - 22 }, { x: rail, y: railTop }) : [];
    if (left) {
      stroke(trunk, colors[0], 1.1, .55 * amount);
      stroke([{ x: rail, y: railTop }, { x: rail, y: anchors.at(-1).y }], colors[0], 1.1, .39 * amount);
    }
    anchors.forEach((target, index) => {
      const progress = left ? amount : smooth((amount - index * .095) / .68);
      if (progress <= .001) return;
      const x = left ? rail : origin.x + (index - 1.5) * pose.r * .33;
      const y = left ? target.y - 9 : Math.min(origin.y, target.y - 8);
      const middle = mix(y, target.y, .56);
      const path = curve(x, y, { x, y: middle }, { x: target.x, y: middle }, target, progress);
      const color = colors[index];
      stroke(path, color, 1.05, .48);
      if (progress < .98) return;
      ctx.fillStyle = rgba(color, .82);
      ctx.beginPath();
      ctx.arc(target.x, target.y, 2.3, 0, tau);
      ctx.fill();
      const phase = connectionTime - index * 710;
      if (!reduced.matches && phase > 0) signal(left ? [...trunk, ...path] : path, phase % 4810, color);
    });
  }

  function isVisible(pose, height = layout.height) {
    return pose && pose.r > 0 && pose.opacity > .001 && pose.y + 1.48 * pose.r > 0 && pose.y - 1.48 * pose.r < height;
  }

  function drawStill() {
    if (forcedColors.matches) return;
    const { y: top, height } = layout.main;
    const density = Math.min(ratio, Math.sqrt(8400000 / (layout.width * height)));
    still.width = Math.round(layout.width * density);
    still.height = Math.round(height * density);
    ctx = still.getContext('2d');
    if (!ctx) { ctx = liveContext; return; }
    ctx.setTransform(density, 0, 0, density, 0, 0);
    energy = 0;
    follow = 0;
    const hero = { ...layout.hero, y: layout.hero.y - top, opacity: 1 };
    const landing = { ...layout.landing, y: layout.landing.y - top, opacity: 1 };
    paintBackground(ctx, { ...layout.panel, y: layout.panel.y - top }, 0, { x: .67, y: .48 }, 0);
    drawConnections(landing, 1, top, height);
    drawGlobe(hero, .36, height);
    drawGlobe(landing, .36, height);
    ctx = liveContext;
  }

  function floating(pose) {
    if (!pose || reduced.matches) return pose;
    const range = Math.min(13, pose.r * .087);
    return {
      ...pose,
      x: pose.x + range * Math.sin(time * .00064),
      y: pose.y + range * .60 * Math.sin(time * .00048),
      r: pose.r * (1 + .023 * Math.sin(time * .00108)),
    };
  }

  function update(now) {
    frame = 0;
    if (!layout || document.hidden || reduced.matches || forcedColors.matches) return;
    const { hero: anchor, landing, link, turn } = positions();
    const hero = openingPose(anchor, now);
    const focal = isVisible(hero) ? hero : isVisible(landing) ? landing : null;
    const panelY = layout.panel.y - scrollY;
    const panelVisible = panelY < layout.height && panelY + layout.panel.height > 0;
    const connected = connectionVisible(landing ?? hero, link);
    const continuous = panelVisible || focal || connected;
    const delta = previous ? Math.min(40, now - previous) : 16;
    if (pointer?.expires && now >= pointer.expires) pointer = null;
    const targetGlobe = floating(focal);
    const dx = targetGlobe && pointer ? (pointer.x - targetGlobe.x) / targetGlobe.r : 0;
    const dy = targetGlobe && pointer ? (pointer.y - targetGlobe.y) / targetGlobe.r : 0;
    const hover = !opening && pointer && focal === hero && hero.r >= layout.hero.r * .77 && dx * dx + dy * dy <= 1.02 ** 2;
    if (continuous) {
      time += delta;
      connectionTime = connected && link > .86 ? connectionTime + delta : 0;
      const resting = .32 + .10 * Math.sin(time * .0012);
      energy = mix(energy, hover ? 1 : resting, 1 - Math.exp(-delta / (hover ? 78 : 360)));
      if (hover) {
        const ease = follow < .018 ? 1 : 1 - Math.exp(-delta / 58);
        pointerCenter.x = mix(pointerCenter.x, dx, ease);
        pointerCenter.y = mix(pointerCenter.y, dy, ease);
      }
      follow = mix(follow, hover ? 1 : 0, 1 - Math.exp(-delta / (hover ? 85 : 135)));
      const ambient = { x: .79 * Math.sin(time * .00078 - 1.05), y: .55 * Math.sin(time * .00102 - .43) };
      const target = hover ? { x: dx, y: dy } : ambient;
      for (let index = 0; index < wake.length; index++) {
        const lead = index === 0 ? target : wake[index - 1];
        const ease = 1 - Math.exp(-delta / drag[index]);
        wake[index].x = mix(wake[index].x, lead.x, ease);
        wake[index].y = mix(wake[index].y, lead.y, ease);
      }
      rotation += delta * .00022;
    } else {
      energy = 0;
      follow = 0;
      connectionTime = 0;
    }

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, layout.width, layout.height);
    if (panelVisible) {
      const source = layout.hero;
      const cursor = {
        x: clamp((source.x + wake[0].x * source.r) / layout.panel.width),
        y: clamp((source.y - layout.panel.y + wake[0].y * source.r) / layout.panel.height),
      };
      paintBackground(ctx, { ...layout.panel, y: panelY }, time, cursor, follow);
    }
    const movingHero = floating(hero);
    const movingLanding = floating(landing);
    drawConnections(movingLanding ?? movingHero, link);
    drawGlobe(movingHero, rotation + turn);
    if (movingLanding) drawGlobe(movingLanding, rotation + turn);
    previous = continuous ? now : 0;
    if (continuous) schedule();
  }

  function schedule() {
    if (!frame && !document.hidden && !reduced.matches && !forcedColors.matches) frame = requestAnimationFrame(update);
  }

  const resize = new ResizeObserver(measure);
  resize.observe(stage);
  resize.observe(hub);
  addEventListener('resize', measure, { passive: true });
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('keydown', event => {
    if (opening && (event.key === 'Tab' || event.key === 'Escape')) finishOpening();
  });
  addEventListener('pointermove', event => {
    if (event.pointerType === 'touch' || reduced.matches) return;
    pointer = { x: event.clientX, y: event.clientY };
    schedule();
  }, { passive: true });
  addEventListener('pointerout', event => {
    if (event.relatedTarget || pointer?.expires) return;
    pointer = null;
    schedule();
  });
  stage.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'touch' || reduced.matches) return;
    pointer = { x: event.clientX, y: event.clientY, expires: performance.now() + 1050 };
    schedule();
  }, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (opening) finishOpening();
      cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
    } else schedule();
  });
  reduced.addEventListener('change', () => {
    if (opening && reduced.matches) finishOpening();
    previous = 0;
    measure();
  });
  forcedColors.addEventListener('change', () => {
    if (opening && forcedColors.matches) finishOpening();
    measure();
  });
  document.fonts.ready.then(measure);
})();
