import confetti from 'canvas-confetti'

export function burstHearts() {
  const defaults = {
    spread: 78,
    startVelocity: 32,
    ticks: 110,
    origin: { y: 0.72 },
    colors: ['#FFB6C9', '#ff7aa2', '#8EC5FC', '#ffffff', '#B7E4C7'],
  }
  try {
    const heart = confetti.shapeFromText({ text: '❤', scalar: 2 })
    confetti({ ...defaults, particleCount: 36, shapes: [heart], scalar: 1.3 })
    confetti({ ...defaults, particleCount: 28, spread: 120, scalar: 0.95 })
  } catch {
    confetti({ ...defaults, particleCount: 80 })
  }
}
