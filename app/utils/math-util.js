export const clamp = (min, max, value) => {
  if (value < min) {
    return min
  } if (value > max) {
    return max
  }
  return value
}

const calcDisctance = (x1, y1, x2, y2) => (
  Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
)

export const getTouchDistance = (touches) => {
  const p1 = touches[0]
  const p2 = touches[1]
  return calcDisctance(
    p1.clientX,
    p1.clientY,
    p2.clientX,
    p2.clientY,
  )
}

const calcCentre = (x1, y1, x2, y2) => ({
  x: (x1 + x2) / 2,
  y: (y1 + y2) / 2,
})

export const getTouchCentre = (touches) => {
  const p1 = touches[0]
  const p2 = touches[1]
  return calcCentre(
    p1.clientX,
    p1.clientY,
    p2.clientX,
    p2.clientY,
  )
}
