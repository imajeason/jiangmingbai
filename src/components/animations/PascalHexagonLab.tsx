'use client';

import React, { useState, useMemo } from 'react';

// Pascal's Hexagon Theorem:
// 6 points on circle: P1, P2, P3, P4, P5, P6
// Pairs of opposite edges:
// (P1-P2) and (P4-P5) -> Intersection X
// (P2-P3) and (P5-P6) -> Intersection Y
// (P3-P4) and (P6-P1) -> Intersection Z
// X, Y, Z are strictly collinear (Pascal line)!

interface Point {
  x: number;
  y: number;
}

// Compute line intersection of P1-P2 and P3-P4
function lineIntersection(p1: Point, p2: Point, p3: Point, p4: Point): Point | null {
  const denom = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
  if (Math.abs(denom) < 1e-5) return null; // Parallel or nearly parallel
  const t = ((p1.x - p3.x) * (p3.y - p4.y) - (p1.y - p3.y) * (p3.x - p4.x)) / denom;
  return {
    x: p1.x + t * (p2.x - p1.x),
    y: p1.y + t * (p2.y - p1.y),
  };
}

// Preset configurations (angles in degrees around circle) that yield clean, visible intersections
const PRESETS = [
  {
    name: '经典凸六边形 (交点向外延伸)',
    angles: [25, 75, 140, 195, 260, 325],
    desc: '最标准的凸六边形，三组对边延长后在圆外三个不同方向交于同一直线上。',
  },
  {
    name: '自相交星形六边形',
    angles: [15, 135, 60, 240, 180, 310],
    desc: '折线相互交叉的星形顶点顺序，依然严格保持三组对边交点共线！',
  },
  {
    name: '非对称倾斜六边形',
    angles: [40, 85, 150, 210, 275, 340],
    desc: '上密下疏的顶点排布，帕斯卡线呈现优美倾斜角度。',
  },
];

export const PascalHexagonLab: React.FC = () => {
  const [presetIdx, setPresetIdx] = useState<number>(0);
  const [angles, setAngles] = useState<number[]>([...PRESETS[0].angles]);
  const [showExtendedLines, setShowExtendedLines] = useState<boolean>(true);
  const [showPascalLine, setShowPascalLine] = useState<boolean>(true);
  const [showIncircle, setShowIncircle] = useState<boolean>(true);

  // Circle parameters in SVG coordinates
  const cx = 320;
  const cy = 250;
  const radius = 130;

  // Convert angles to points
  const points: Point[] = useMemo(() => {
    return angles.map((deg) => {
      const rad = (deg * Math.PI) / 180;
      return {
        x: cx + radius * Math.cos(rad),
        y: cy + radius * Math.sin(rad),
      };
    });
  }, [angles, cx, cy, radius]);

  // Compute intersections
  // P1: idx 0, P2: idx 1, P3: idx 2, P4: idx 3, P5: idx 4, P6: idx 5
  // Pair 1: (0, 1) and (3, 4) -> X
  // Pair 2: (1, 2) and (4, 5) -> Y
  // Pair 3: (2, 3) and (5, 0) -> Z
  const ptX = useMemo(() => lineIntersection(points[0], points[1], points[3], points[4]), [points]);
  const ptY = useMemo(() => lineIntersection(points[1], points[2], points[4], points[5]), [points]);
  const ptZ = useMemo(() => lineIntersection(points[2], points[3], points[5], points[0]), [points]);

  // Collinearity check: area of triangle XYZ
  const collinearityArea = useMemo(() => {
    if (!ptX || !ptY || !ptZ) return null;
    const area = 0.5 * Math.abs(
      ptX.x * (ptY.y - ptZ.y) +
      ptY.x * (ptZ.y - ptX.y) +
      ptZ.x * (ptX.y - ptY.y)
    );
    return area;
  }, [ptX, ptY, ptZ]);

  const selectPreset = (idx: number) => {
    setPresetIdx(idx);
    setAngles([...PRESETS[idx].angles]);
  };

  const handleAngleChange = (pointIdx: number, val: number) => {
    const next = [...angles];
    next[pointIdx] = val;
    setAngles(next);
  };

  // Helper to draw an extended line passing through p1 and p2 out to bounding box
  const getExtendedLineCoords = (p1: Point, p2: Point, ptIntersect: Point | null) => {
    // Extend past ptIntersect or further
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    return {
      x1: p1.x - ux * 200,
      y1: p1.y - uy * 200,
      x2: (ptIntersect ? ptIntersect.x : p2.x) + ux * 60,
      y2: (ptIntersect ? ptIntersect.y : p2.y) + uy * 60,
    };
  };

  return (
    <div className="flex flex-col gap-5 p-6 bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 shadow-xl max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            帕斯卡六边形定理交互实验室 (Pascal&apos;s Mystic Hexagram)
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            圆内接六边形的三组对边延长相交，得到的三个交点严格共线（帕斯卡线）
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>射影几何黄金瑰宝 · 1639</span>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {PRESETS.map((p, idx) => (
          <button
            key={idx}
            onClick={() => selectPreset(idx)}
            className={`p-3 rounded-xl border text-left transition-all ${
              presetIdx === idx
                ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-900/30'
                : 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:border-slate-600'
            }`}
          >
            <div className="font-semibold text-sm">{p.name}</div>
            <div className="text-xs text-slate-400 mt-1 line-clamp-2">{p.desc}</div>
          </button>
        ))}
      </div>

      {/* Canvas Area */}
      <div className="relative bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex flex-col items-center">
        <svg
          viewBox="0 0 640 500"
          className="w-full max-h-[500px] select-none"
        >
          {/* Subtle grid */}
          <defs>
            <pattern id="pascalGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.5" strokeOpacity="0.3" />
            </pattern>
          </defs>
          <rect width="640" height="500" fill="url(#pascalGrid)" />

          {/* Base Circle */}
          {showIncircle && (
            <circle
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke="#475569"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
          )}

          {/* Extended Lines */}
          {showExtendedLines && (
            <>
              {/* Pair 1: P1-P2 (0-1) and P4-P5 (3-4) -> X (Amber) */}
              {ptX && (
                <>
                  <line
                    x1={points[0].x}
                    y1={points[0].y}
                    x2={ptX.x}
                    y2={ptX.y}
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    opacity="0.7"
                  />
                  <line
                    x1={points[3].x}
                    y1={points[3].y}
                    x2={ptX.x}
                    y2={ptX.y}
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    opacity="0.7"
                  />
                </>
              )}

              {/* Pair 2: P2-P3 (1-2) and P5-P6 (4-5) -> Y (Sky Blue) */}
              {ptY && (
                <>
                  <line
                    x1={points[1].x}
                    y1={points[1].y}
                    x2={ptY.x}
                    y2={ptY.y}
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    opacity="0.7"
                  />
                  <line
                    x1={points[4].x}
                    y1={points[4].y}
                    x2={ptY.x}
                    y2={ptY.y}
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    opacity="0.7"
                  />
                </>
              )}

              {/* Pair 3: P3-P4 (2-3) and P6-P1 (5-0) -> Z (Purple) */}
              {ptZ && (
                <>
                  <line
                    x1={points[2].x}
                    y1={points[2].y}
                    x2={ptZ.x}
                    y2={ptZ.y}
                    stroke="#c084fc"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    opacity="0.7"
                  />
                  <line
                    x1={points[5].x}
                    y1={points[5].y}
                    x2={ptZ.x}
                    y2={ptZ.y}
                    stroke="#c084fc"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    opacity="0.7"
                  />
                </>
              )}
            </>
          )}

          {/* Hexagon polygon edges */}
          <polygon
            points={points.map((p) => `${p.x},${p.y}`).join(' ')}
            fill="rgba(16, 185, 129, 0.08)"
            stroke="#10b981"
            strokeWidth="2"
          />

          {/* Pascal Line (connecting X, Y, Z) */}
          {showPascalLine && ptX && ptZ && (
            <line
              x1={ptX.x - (ptZ.x - ptX.x) * 0.4}
              y1={ptX.y - (ptZ.y - ptX.y) * 0.4}
              x2={ptZ.x + (ptZ.x - ptX.x) * 0.4}
              y2={ptZ.y + (ptZ.y - ptX.y) * 0.4}
              stroke="#ec4899"
              strokeWidth="3"
              strokeDasharray="6 3"
            />
          )}

          {/* Vertices P1..P6 */}
          {points.map((p, idx) => (
            <g key={idx}>
              <circle
                cx={p.x}
                cy={p.y}
                r="6"
                fill="#10b981"
                stroke="#ffffff"
                strokeWidth="1.5"
                className="cursor-pointer"
              />
              <text
                x={p.x + (p.x >= cx ? 12 : -22)}
                y={p.y + (p.y >= cy ? 14 : -10)}
                fill="#a7f3d0"
                fontSize="12"
                fontWeight="bold"
              >
                P{idx + 1}
              </text>
            </g>
          ))}

          {/* Intersections X, Y, Z */}
          {ptX && (
            <g>
              <circle cx={ptX.x} cy={ptX.y} r="7" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
              <text x={ptX.x + 10} y={ptX.y - 10} fill="#fbbf24" fontSize="13" fontWeight="bold">
                X (1-2 ∩ 4-5)
              </text>
            </g>
          )}
          {ptY && (
            <g>
              <circle cx={ptY.x} cy={ptY.y} r="7" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
              <text x={ptY.x + 10} y={ptY.y - 10} fill="#7dd3fc" fontSize="13" fontWeight="bold">
                Y (2-3 ∩ 5-6)
              </text>
            </g>
          )}
          {ptZ && (
            <g>
              <circle cx={ptZ.x} cy={ptZ.y} r="7" fill="#c084fc" stroke="#ffffff" strokeWidth="2" />
              <text x={ptZ.x + 10} y={ptZ.y - 10} fill="#e9d5ff" fontSize="13" fontWeight="bold">
                Z (3-4 ∩ 6-1)
              </text>
            </g>
          )}
        </svg>

        {/* Verification badge overlay */}
        <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-700 text-xs flex items-center gap-3">
          <div>
            <span className="text-slate-400">三角形XYZ面积：</span>
            <span className="font-mono font-bold text-emerald-400">
              {collinearityArea !== null ? collinearityArea.toFixed(4) : '无相交'}
            </span>
          </div>
          <div className="h-4 w-[1px] bg-slate-700"></div>
          <div>
            <span className="text-slate-400">共线性状态：</span>
            <span className="font-bold text-pink-400">
              {collinearityArea !== null && collinearityArea < 0.05
                ? '严格共线 (面积 ≈ 0)'
                : '检测中'}
            </span>
          </div>
        </div>
      </div>

      {/* Control sliders & toggles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-xs">
        {/* Toggle options */}
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
            <input
              type="checkbox"
              checked={showExtendedLines}
              onChange={(e) => setShowExtendedLines(e.target.checked)}
              className="rounded accent-emerald-500"
            />
            显示对边延伸虚线
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
            <input
              type="checkbox"
              checked={showPascalLine}
              onChange={(e) => setShowPascalLine(e.target.checked)}
              className="rounded accent-pink-500"
            />
            显示帕斯卡线 (粉色)
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
            <input
              type="checkbox"
              checked={showIncircle}
              onChange={(e) => setShowIncircle(e.target.checked)}
              className="rounded accent-slate-500"
            />
            显示外接圆周
          </label>
        </div>

        {/* Dynamic angle sliders for vertices */}
        <div className="grid grid-cols-3 gap-2">
          {angles.map((ang, idx) => (
            <div key={idx} className="flex flex-col gap-0.5">
              <span className="text-slate-400 text-[11px]">
                P{idx + 1} 角度: <strong className="text-emerald-300">{ang}°</strong>
              </span>
              <input
                type="range"
                min="0"
                max="359"
                value={ang}
                onChange={(e) => handleAngleChange(idx, parseInt(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Educational Explanation Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
        <div className="p-2 rounded bg-amber-950/20 border border-amber-900/30">
          <div className="font-bold text-amber-300 mb-1">对边第1组 · 交点 X</div>
          <p className="text-slate-300">
            直线 P1P2 与对边 P4P5 延长后相交于点 <strong className="text-amber-400">X</strong>。
          </p>
        </div>
        <div className="p-2 rounded bg-sky-950/20 border border-sky-900/30">
          <div className="font-bold text-sky-300 mb-1">对边第2组 · 交点 Y</div>
          <p className="text-slate-300">
            直线 P2P3 与对边 P5P6 延长后相交于点 <strong className="text-sky-400">Y</strong>。
          </p>
        </div>
        <div className="p-2 rounded bg-purple-950/20 border border-purple-900/30">
          <div className="font-bold text-purple-300 mb-1">对边第3组 · 交点 Z</div>
          <p className="text-slate-300">
            直线 P3P4 与对边 P6P1 延长后相交于点 <strong className="text-purple-400">Z</strong>。三点必在同一条粉色帕斯卡线上！
          </p>
        </div>
      </div>
    </div>
  );
};

export default PascalHexagonLab;

