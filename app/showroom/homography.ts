/**
 * Corner-pin perspective transform.
 *
 * Computes the CSS `matrix3d(...)` that maps a source rectangle
 * (0,0)-(w,h) onto four arbitrary destination corners, so a flat tiled
 * layer can be projected onto a photo's floor plane in correct perspective.
 * Standard planar-homography method (after Franklin Ta / MartinDevans).
 */

export type Pt = { x: number; y: number };

function adj(m: number[]): number[] {
  return [
    m[4] * m[8] - m[5] * m[7],
    m[2] * m[7] - m[1] * m[8],
    m[1] * m[5] - m[2] * m[4],
    m[5] * m[6] - m[3] * m[8],
    m[0] * m[8] - m[2] * m[6],
    m[2] * m[3] - m[0] * m[5],
    m[3] * m[7] - m[4] * m[6],
    m[1] * m[6] - m[0] * m[7],
    m[0] * m[4] - m[1] * m[3],
  ];
}

function multmm(a: number[], b: number[]): number[] {
  const c = new Array(9);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let cij = 0;
      for (let k = 0; k < 3; k++) cij += a[3 * i + k] * b[3 * k + j];
      c[3 * i + j] = cij;
    }
  }
  return c;
}

function multmv(m: number[], v: number[]): number[] {
  return [
    m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
    m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
    m[6] * v[0] + m[7] * v[1] + m[8] * v[2],
  ];
}

function basisToPoints(
  x1: number, y1: number, x2: number, y2: number,
  x3: number, y3: number, x4: number, y4: number,
): number[] {
  const m = [x1, x2, x3, y1, y2, y3, 1, 1, 1];
  const v = multmv(adj(m), [x4, y4, 1]);
  return multmm(m, [v[0], 0, 0, 0, v[1], 0, 0, 0, v[2]]);
}

function general2DProjection(
  a: number[][], b: number[][],
): number[] {
  const s = basisToPoints(a[0][0], a[0][1], a[1][0], a[1][1], a[2][0], a[2][1], a[3][0], a[3][1]);
  const d = basisToPoints(b[0][0], b[0][1], b[1][0], b[1][1], b[2][0], b[2][1], b[3][0], b[3][1]);
  return multmm(d, adj(s));
}

/**
 * @param w source rect width, @param h source rect height
 * @param corners destination [topLeft, topRight, bottomRight, bottomLeft] in px
 * @returns a CSS `matrix3d(...)` string (with `transform-origin: 0 0`)
 */
export function cornerPinMatrix3d(w: number, h: number, corners: Pt[]): string {
  const src = [
    [0, 0],
    [w, 0],
    [w, h],
    [0, h],
  ];
  const dst = corners.map((c) => [c.x, c.y]);
  let t = general2DProjection(src, dst);
  for (let i = 0; i < 9; i++) t[i] = t[i] / t[8];
  const m = [
    t[0], t[3], 0, t[6],
    t[1], t[4], 0, t[7],
    0, 0, 1, 0,
    t[2], t[5], 0, t[8],
  ];
  return `matrix3d(${m.join(",")})`;
}
