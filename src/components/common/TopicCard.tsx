import React from 'react';
import Link from 'next/link';
import { TopicItem } from '@/types';
import { STAGES, SUBJECTS } from '@/data/constants';
import { PlayCircle, Clock, Lightbulb, ArrowRight } from 'lucide-react';
import styles from '@/styles/home.module.css';

interface TopicCardProps {
  topic: TopicItem;
}

export default function TopicCard({ topic }: TopicCardProps) {
  const stage = STAGES[topic.stage];
  const subject = SUBJECTS[topic.subject];

  return (
    <Link href={`/${topic.stage}/${topic.subject}/${topic.slug}`} className={styles.card}>
      <div className={styles.cardPreviewHeader}>
        <div className={styles.cardPlayBadge}>
          <PlayCircle size={14} />
          <span>交互动画</span>
        </div>

        {/* 动态示意 SVG 简化微缩图 */}
        {topic.animationType === 'circle-area' && (
          <svg viewBox="0 0 160 100" width="130" height="80">
            <circle cx="45" cy="50" r="32" fill="#dbeafe" stroke="#2563eb" strokeWidth="2" />
            <path d="M 45 50 L 77 50 A 32 32 0 0 1 68 73 Z" fill="#2563eb" />
            <line x1="90" y1="50" x2="110" y2="50" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" />
            <rect x="115" y="32" width="40" height="36" fill="#cffafe" stroke="#0891b2" strokeWidth="2" />
          </svg>
        )}

        {topic.animationType === 'pythagorean-theorem' && (
          <svg viewBox="0 0 160 100" width="130" height="80">
            <polygon points="40,25 110,25 110,75" fill="#dbeafe" stroke="#2563eb" strokeWidth="2" />
            <rect x="100" y="25" width="10" height="10" fill="none" stroke="#2563eb" strokeWidth="1.5" />
            <text x="75" y="20" fill="#2563eb" fontSize="12" fontWeight="700">a²</text>
            <text x="115" y="55" fill="#0891b2" fontSize="12" fontWeight="700">b²</text>
            <text x="65" y="60" fill="#dc2626" fontSize="12" fontWeight="700">c²</text>
          </svg>
        )}

        {topic.animationType === 'buoyancy-archimedes' && (
          <svg viewBox="0 0 160 100" width="130" height="80">
            <rect x="30" y="40" width="50" height="50" fill="#bae6fd" stroke="#0284c7" strokeWidth="2" rx="2" />
            <rect x="42" y="30" width="26" height="26" fill="#64748b" stroke="#334155" strokeWidth="1.5" />
            <line x1="55" y1="10" x2="55" y2="30" stroke="#ef4444" strokeWidth="2" />
            <rect x="100" y="60" width="24" height="30" fill="#bae6fd" stroke="#0284c7" strokeWidth="1.5" />
            <text x="102" y="50" fontSize="11" fill="#059669" fontWeight="700">G排</text>
          </svg>
        )}

        {topic.animationType === 'clock-reading' && (
          <svg viewBox="0 0 160 100" width="130" height="80">
            <circle cx="80" cy="50" r="38" fill="#ffffff" stroke="#334155" strokeWidth="2" />
            <circle cx="80" cy="50" r="3" fill="#0f172a" />
            {/* 7点55分指针：时针指到接近8，分针指到11 */}
            <line x1="80" y1="50" x2="62" y2="65" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
            <line x1="80" y1="50" x2="63" y2="22" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
            <text x="80" y="22" textAnchor="middle" fontSize="9" fontWeight="700" fill="#64748b">12</text>
            <text x="80" y="85" textAnchor="middle" fontSize="9" fontWeight="700" fill="#64748b">6</text>
            <text x="110" y="53" textAnchor="middle" fontSize="9" fontWeight="700" fill="#64748b">3</text>
            <text x="50" y="53" textAnchor="middle" fontSize="9" fontWeight="700" fill="#64748b">9</text>
          </svg>
        )}

        {topic.animationType === 'ten-frame' && (
          <svg viewBox="0 0 160 100" width="130" height="80">
            {/* 十格阵微缩盒子 */}
            <rect x="18" y="30" width="80" height="40" fill="#f8fafc" stroke="#3b82f6" strokeWidth="1.5" rx="3" />
            <line x1="18" y1="50" x2="98" y2="50" stroke="#bfdbfe" strokeWidth="1" />
            <line x1="34" y1="30" x2="34" y2="70" stroke="#bfdbfe" strokeWidth="1" />
            <line x1="50" y1="30" x2="50" y2="70" stroke="#bfdbfe" strokeWidth="1" />
            <line x1="66" y1="30" x2="66" y2="70" stroke="#bfdbfe" strokeWidth="1" />
            <line x1="82" y1="30" x2="82" y2="70" stroke="#bfdbfe" strokeWidth="1" />
            {/* 里面放满小蓝球 */}
            <circle cx="26" cy="40" r="5" fill="#3b82f6" />
            <circle cx="42" cy="40" r="5" fill="#3b82f6" />
            <circle cx="58" cy="40" r="5" fill="#3b82f6" />
            <circle cx="74" cy="40" r="5" fill="#3b82f6" />
            <circle cx="90" cy="40" r="5" fill="#f59e0b" />
            {/* 散装黄色球 */}
            <circle cx="120" cy="40" r="5" fill="#f59e0b" />
            <circle cx="135" cy="40" r="5" fill="#f59e0b" />
            <circle cx="128" cy="55" r="5" fill="#f59e0b" />
            <text x="58" y="22" textAnchor="middle" fontSize="9" fill="#2563eb" fontWeight="700">十格阵凑10</text>
          </svg>
        )}

        {topic.animationType === 'transfer-and-balance' && (
          <svg viewBox="0 0 160 100" width="130" height="80">
            {/* 天平微缩图 */}
            <polygon points="80,45 72,82 88,82" fill="#94a3b8" />
            <rect x="65" y="82" width="30" height="5" rx="2" fill="#64748b" />
            <circle cx="80" cy="45" r="4" fill="#334155" />
            {/* 横梁 */}
            <line x1="25" y1="45" x2="135" y2="45" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
            {/* 左右托盘 */}
            <line x1="35" y1="45" x2="25" y2="65" stroke="#94a3b8" strokeWidth="1.2" />
            <line x1="35" y1="45" x2="45" y2="65" stroke="#94a3b8" strokeWidth="1.2" />
            <path d="M 20 65 Q 35 72 50 65 Z" fill="#3b82f6" />
            <line x1="125" y1="45" x2="115" y2="65" stroke="#94a3b8" strokeWidth="1.2" />
            <line x1="125" y1="45" x2="135" y2="65" stroke="#94a3b8" strokeWidth="1.2" />
            <path d="M 110 65 Q 125 72 140 65 Z" fill="#ef4444" />
            {/* 托盘上的小球 */}
            <circle cx="35" cy="60" r="3.5" fill="#60a5fa" />
            <circle cx="125" cy="60" r="3.5" fill="#f87171" />
            <text x="80" y="22" textAnchor="middle" fontSize="9" fill="#2563eb" fontWeight="700">移多补少天平</text>
          </svg>
        )}

        {topic.animationType === 'line-up-ordering' && (
          <svg viewBox="0 0 160 100" width="130" height="80">
            {/* 排队小朋友队列 */}
            <circle cx="25" cy="55" r="9" fill="#3b82f6" />
            <circle cx="50" cy="55" r="9" fill="#10b981" />
            <circle cx="80" cy="55" r="12" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
            <circle cx="110" cy="55" r="9" fill="#8b5cf6" />
            <circle cx="135" cy="55" r="9" fill="#ec4899" />
            {/* 小明头顶上的星星 */}
            <polygon points="80,30 82,35 87,35 83,38 85,43 80,40 75,43 77,38 73,35 78,35" fill="#f59e0b" />
            <text x="80" y="22" textAnchor="middle" fontSize="9" fill="#b45309" fontWeight="700">小明(被数2次)</text>
            <text x="80" y="80" textAnchor="middle" fontSize="8" fill="#64748b" fontWeight="600">4 + 5 - 1 = 8</text>
          </svg>
        )}

        {topic.animationType === 'front-back-left-right' && (
          <svg viewBox="0 0 160 100" width="130" height="80">
            {/* 左右两侧物品 */}
            <circle cx="30" cy="50" r="14" fill="#fee2e2" />
            <text x="30" y="55" textAnchor="middle" fontSize="12">🍎</text>
            <circle cx="130" cy="50" r="14" fill="#fef9c3" />
            <text x="130" y="55" textAnchor="middle" fontSize="12">🍌</text>
            {/* 中间转身小人 */}
            <circle cx="80" cy="38" r="12" fill="#fed7aa" />
            <rect x="70" y="50" width="20" height="24" rx="4" fill="#3b82f6" />
            {/* 蓝色左手和红色右手 */}
            <line x1="70" y1="56" x2="52" y2="44" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
            <line x1="90" y1="56" x2="108" y2="44" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />
            <text x="80" y="88" textAnchor="middle" fontSize="9" fill="#1e40af" fontWeight="700">面对面左右互换</text>
          </svg>
        )}

        {topic.animationType === 'compass-directions' && (
          <svg viewBox="0 0 160 100" width="130" height="80">
            {/* 罗盘圆盘 */}
            <circle cx="80" cy="50" r="34" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="80" y1="20" x2="80" y2="80" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="50" y1="50" x2="110" y2="50" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 2" />
            {/* 指针：红指北，蓝指南 */}
            <polygon points="80,24 84,50 76,50" fill="#ef4444" />
            <polygon points="80,76 84,50 76,50" fill="#3b82f6" />
            <circle cx="80" cy="50" r="3" fill="#1e293b" />
            {/* 四向标签 */}
            <text x="80" y="18" textAnchor="middle" fontSize="9" fill="#dc2626" fontWeight="800">北</text>
            <text x="80" y="89" textAnchor="middle" fontSize="9" fill="#2563eb" fontWeight="800">南</text>
            <text x="42" y="53" textAnchor="middle" fontSize="9" fill="#6b21a8" fontWeight="800">西</text>
            <text x="118" y="53" textAnchor="middle" fontSize="9" fill="#d97706" fontWeight="800">东</text>
          </svg>
        )}

        {topic.animationType === 'multiplication-array' && (
          <svg viewBox="0 0 160 100" width="130" height="80">
            {/* 3行4列点阵微缩图 */}
            {Array.from({ length: 3 }).map((_, r) =>
              Array.from({ length: 4 }).map((_, c) => (
                <circle
                  key={`${r}-${c}`}
                  cx={45 + c * 24}
                  cy={30 + r * 18}
                  r="6"
                  fill="#3b82f6"
                />
              ))
            )}
            <text x="80" y="88" textAnchor="middle" fontSize="9" fill="#1e40af" fontWeight="700">3×4 = 4×3 = 12</text>
          </svg>
        )}

        {topic.animationType === 'hidden-cubes-counting' && (
          <svg viewBox="0 0 160 100" width="130" height="80">
            {/* 3D 正方体阶梯立体微缩图 */}
            {/* 底层左 */}
            <polygon points="50,45 65,37 80,45 65,53" fill="#93c5fd" stroke="#fff" strokeWidth="0.8" />
            <polygon points="50,45 65,53 65,70 50,62" fill="#3b82f6" stroke="#fff" strokeWidth="0.8" />
            <polygon points="65,53 80,45 80,62 65,70" fill="#1d4ed8" stroke="#fff" strokeWidth="0.8" />
            {/* 底层右 */}
            <polygon points="80,45 95,37 110,45 95,53" fill="#93c5fd" stroke="#fff" strokeWidth="0.8" />
            <polygon points="80,45 95,53 95,70 80,62" fill="#3b82f6" stroke="#fff" strokeWidth="0.8" />
            <polygon points="95,53 110,45 110,62 95,70" fill="#1d4ed8" stroke="#fff" strokeWidth="0.8" />
            {/* 第二层 (叠在左上) */}
            <polygon points="50,28 65,20 80,28 65,36" fill="#fde047" stroke="#fff" strokeWidth="0.8" />
            <polygon points="50,28 65,36 65,53 50,45" fill="#eab308" stroke="#fff" strokeWidth="0.8" />
            <polygon points="65,36 80,28 80,45 65,53" fill="#ca8a04" stroke="#fff" strokeWidth="0.8" />
            <text x="80" y="88" textAnchor="middle" fontSize="9" fill="#1e40af" fontWeight="700">立体数积木(透视暗块)</text>
          </svg>
        )}

        {topic.animationType === 'chicken-rabbit-cage' && (
          <svg viewBox="0 0 160 100" width="130" height="80">
            {/* 鸡兔同笼微缩示意图 */}
            {/* 笼子边框 */}
            <rect x="25" y="20" width="110" height="60" rx="8" fill="#f0fdf4" stroke="#86efac" strokeWidth="1.5" />
            <line x1="25" y1="35" x2="135" y2="35" stroke="#bbf7d0" strokeWidth="1" strokeDasharray="3 3" />
            {/* 鸡 */}
            <circle cx="55" cy="48" r="14" fill="#fef08a" stroke="#f59e0b" strokeWidth="1.5" />
            <text x="55" y="53" textAnchor="middle" fontSize="13">🐥</text>
            {/* 兔 */}
            <circle cx="105" cy="48" r="14" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
            <text x="105" y="53" textAnchor="middle" fontSize="13">🐰</text>
            {/* 哨子和抬腿文字 */}
            <text x="80" y="88" textAnchor="middle" fontSize="9" fill="#15803d" fontWeight="700">吹哨抬腿法(金鸡独立)</text>
          </svg>
        )}

        {topic.animationType === 'triangle-area-parallelogram' && (
          <svg viewBox="0 0 160 100" width="130" height="80">
            {/* 三角形1（蓝色） */}
            <polygon points="25,75 95,75 55,30" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1.5" />
            {/* 三角形2（绿色，旋转180°合体拼成平行四边形） */}
            <polygon points="95,75 125,30 55,30" fill="#10b981" stroke="#047857" strokeWidth="1.5" strokeDasharray="2 2" />
            {/* 高度虚线 */}
            <line x1="55" y1="30" x2="55" y2="75" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="2 2" />
            <text x="50" y="55" textAnchor="end" fontSize="8" fill="#dc2626" fontWeight="700">h</text>
            <text x="60" y="85" textAnchor="middle" fontSize="8" fill="#1e293b" fontWeight="700">底 a</text>
            <text x="80" y="18" textAnchor="middle" fontSize="8.5" fill="#2563eb" fontWeight="800">S = a × h ÷ 2</text>
          </svg>
        )}

        {topic.animationType === 'perimeter-vs-area' && (
          <svg viewBox="0 0 160 100" width="130" height="80">
            {/* 扁长方形对比 (10x2) */}
            <rect x="15" y="24" width="60" height="15" rx="3" fill="#fee2e2" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="3 2" />
            <text x="45" y="35" textAnchor="middle" fontSize="7.5" fill="#991b1b" fontWeight="700">10×2 = 20</text>
            {/* 正方形 (6x6) */}
            <rect x="85" y="24" width="55" height="55" rx="4" fill="#dcfce7" stroke="#10b981" strokeWidth="1.8" />
            <text x="112" y="55" textAnchor="middle" fontSize="11" fill="#047857" fontWeight="900">6×6 = 36</text>
            <text x="112" y="70" textAnchor="middle" fontSize="7.5" fill="#15803d" fontWeight="700">正方形最大</text>
            {/* 底部周长相同说明 */}
            <text x="80" y="92" textAnchor="middle" fontSize="8" fill="#2563eb" fontWeight="800">同周长 (24cm) 面积相差近一倍</text>
          </svg>
        )}

        {topic.animationType === 'cube-nets-folding' && (
          <svg viewBox="0 0 160 100" width="130" height="80">
            {/* 左侧展开十字图 (1-4-1) */}
            <g transform="translate(18, 25)">
              <rect x="14" y="0" width="14" height="14" fill="#f97316" stroke="#fff" strokeWidth="0.8" />
              <rect x="0" y="14" width="14" height="14" fill="#10b981" stroke="#fff" strokeWidth="0.8" />
              <rect x="14" y="14" width="14" height="14" fill="#475569" stroke="#fff" strokeWidth="0.8" />
              <rect x="28" y="14" width="14" height="14" fill="#8b5cf6" stroke="#fff" strokeWidth="0.8" />
              <rect x="42" y="14" width="14" height="14" fill="#0284c7" stroke="#fff" strokeWidth="0.8" />
              <rect x="14" y="28" width="14" height="14" fill="#ef4444" stroke="#fff" strokeWidth="0.8" />
            </g>
            {/* 中间旋转折叠箭头 */}
            <path d="M 85 45 L 95 45 M 92 41 L 96 45 L 92 49" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            {/* 右侧立体的正方体 */}
            <g transform="translate(120, 48)">
              {/* 顶面 */}
              <polygon points="0,-18 18,-27 0,-36 -18,-27" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />
              {/* 左面 */}
              <polygon points="-18,-27 0,-18 0,14 -18,5" fill="#34d399" stroke="#059669" strokeWidth="1" />
              {/* 右面 */}
              <polygon points="0,-18 18,-27 18,5 0,14" fill="#f87171" stroke="#dc2626" strokeWidth="1" />
            </g>
            <text x="80" y="88" textAnchor="middle" fontSize="8.5" fill="#1e40af" fontWeight="800">11种展开图 3D折叠</text>
          </svg>
        )}

        {topic.animationType === 'speed-meeting-chasing' && (
          <svg viewBox="0 0 160 100" width="130" height="80">
            {/* 公路轨道 */}
            <rect x="15" y="38" width="130" height="24" rx="4" fill="#334155" />
            <line x1="15" y1="50" x2="145" y2="50" stroke="#facc15" strokeWidth="1.5" strokeDasharray="6 4" />
            {/* 红车从左向右 */}
            <g transform="translate(25, 41)">
              <rect x="0" y="0" width="22" height="10" rx="3" fill="#ef4444" />
              <circle cx="5" cy="11" r="3" fill="#0f172a" />
              <circle cx="17" cy="11" r="3" fill="#0f172a" />
              <path d="M 25 5 L 34 5 M 30 2 L 34 5 L 30 8" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
            </g>
            {/* 蓝车从右向左相向而行 */}
            <g transform="translate(112, 41)">
              <rect x="0" y="0" width="22" height="10" rx="3" fill="#3b82f6" />
              <circle cx="5" cy="11" r="3" fill="#0f172a" />
              <circle cx="17" cy="11" r="3" fill="#0f172a" />
              <path d="M -3 5 L -12 5 M -8 2 L -12 5 L -8 8" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
            </g>
            {/* 中间相遇星号 */}
            <circle cx="80" cy="50" r="8" fill="#fef08a" opacity="0.8" />
            <text x="80" y="53" textAnchor="middle" fontSize="10">💥</text>
            <text x="80" y="24" textAnchor="middle" fontSize="8.5" fill="#2563eb" fontWeight="800">相遇(和) · 追及(差)</text>
            <text x="80" y="85" textAnchor="middle" fontSize="8" fill="#475569" fontWeight="700">双车动态时间轴</text>
          </svg>
        )}

        {topic.animationType === 'cylinder-cone-volume' && (
          <svg viewBox="0 0 160 100" width="130" height="80">
            {/* 左侧圆锥杯 */}
            <g transform="translate(18, 20)">
              <polygon points="5,8 45,8 25,58" fill="#38bdf8" opacity="0.85" />
              <line x1="5" y1="8" x2="25" y2="58" stroke="#0284c7" strokeWidth="1.2" />
              <line x1="45" y1="8" x2="25" y2="58" stroke="#0284c7" strokeWidth="1.2" />
              <ellipse cx="25" cy="8" rx="20" ry="4" fill="#bae6fd" stroke="#0284c7" strokeWidth="1" />
              <text x="25" y="70" textAnchor="middle" fontSize="7.5" fill="#0369a1" fontWeight="700">V=⅓Sh</text>
            </g>
            {/* 倒水箭头与水滴 */}
            <path d="M 68 35 Q 78 28 88 40" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 2" />
            <text x="78" y="26" textAnchor="middle" fontSize="9">💧×3</text>
            {/* 右侧圆柱桶 */}
            <g transform="translate(95, 20)">
              <rect x="5" y="8" width="40" height="50" fill="#f1f5f9" stroke="#64748b" strokeWidth="1.2" />
              {/* 1/3, 2/3 水线 */}
              <line x1="5" y1="41.3" x2="45" y2="41.3" stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="2 2" />
              <line x1="5" y1="24.6" x2="45" y2="24.6" stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="2 2" />
              {/* 满水 */}
              <rect x="5" y="8" width="40" height="50" fill="#38bdf8" opacity="0.75" />
              <ellipse cx="25" cy="8" rx="20" ry="4" fill="#bae6fd" stroke="#64748b" strokeWidth="1" />
              <ellipse cx="25" cy="58" rx="20" ry="4" fill="none" stroke="#64748b" strokeWidth="1" />
              <text x="25" y="70" textAnchor="middle" fontSize="7.5" fill="#15803d" fontWeight="700">V=Sh</text>
            </g>
            <text x="80" y="88" textAnchor="middle" fontSize="8" fill="#1e40af" fontWeight="800">等底等高 3次倒满</text>
          </svg>
        )}

        {topic.animationType === 'fractions-basics' && (
          <svg viewBox="0 0 160 100" width="130" height="80">
            {/* 披萨盘底 */}
            <circle cx="50" cy="48" r="30" fill="#d97706" stroke="#b45309" strokeWidth="2" />
            <circle cx="50" cy="48" r="27" fill="#fef08a" />
            {/* 4等分切线 */}
            <line x1="23" y1="48" x2="77" y2="48" stroke="#b45309" strokeWidth="1.2" />
            <line x1="50" y1="21" x2="50" y2="75" stroke="#b45309" strokeWidth="1.2" />
            {/* 突出的 1/4 块 */}
            <path d="M 52 46 L 77 46 A 27 27 0 0 0 52 21 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="1.2" />
            <circle cx="62" cy="34" r="2" fill="#ef4444" />
            {/* 右侧分数展示 */}
            <g transform="translate(110, 48)">
              <text x="0" y="-8" textAnchor="middle" fontSize="16" fontWeight="900" fill="#ef4444">1</text>
              <line x1="-14" y1="-3" x2="14" y2="-3" stroke="#0f172a" strokeWidth="2" />
              <text x="0" y="15" textAnchor="middle" fontSize="16" fontWeight="900" fill="#2563eb">4</text>
            </g>
            <text x="80" y="90" textAnchor="middle" fontSize="8" fill="#15803d" fontWeight="800">必须“平均分”</text>
          </svg>
        )}

        {topic.animationType === 'tree-planting-intervals' && (
          <svg viewBox="0 0 160 100" width="130" height="80">
            {/* 道路地面 */}
            <rect x="15" y="45" width="130" height="15" rx="3" fill="#64748b" />
            {/* 4 棵树 */}
            {[25, 60, 95, 130].map((tx, idx) => (
              <g key={idx} transform={`translate(${tx}, 44)`}>
                <rect x="-2" y="0" width="4" height="12" fill="#78350f" />
                <circle cx="0" cy="-6" r="8" fill="#16a34a" stroke="#14532d" strokeWidth="1" />
              </g>
            ))}
            {/* 3 个指缝间隔标注 */}
            <line x1="25" y1="67" x2="60" y2="67" stroke="#ef4444" strokeWidth="1.2" />
            <line x1="60" y1="67" x2="95" y2="67" stroke="#ef4444" strokeWidth="1.2" />
            <line x1="95" y1="67" x2="130" y2="67" stroke="#ef4444" strokeWidth="1.2" />
            <text x="80" y="24" textAnchor="middle" fontSize="8.5" fill="#2563eb" fontWeight="800">5指4缝 · 树比缝多1</text>
            <text x="80" y="86" textAnchor="middle" fontSize="8" fill="#15803d" fontWeight="800">4棵树 = 3个间隔 + 1</text>
          </svg>
        )}

        {topic.animationType === 'sum-difference-multiple' && (
          <svg viewBox="0 0 160 100" width="130" height="80">
            {/* 大数条 */}
            <rect x="20" y="32" width="65" height="14" rx="3" fill="#3b82f6" />
            <rect x="85" y="32" width="30" height="14" rx="3" fill="#ef4444" />
            <text x="100" y="42" textAnchor="middle" fontSize="7.5" fill="#fff" fontWeight="700">差</text>
            {/* 小数条 */}
            <rect x="20" y="52" width="65" height="14" rx="3" fill="#3b82f6" />
            {/* 虚线对齐 */}
            <line x1="85" y1="28" x2="85" y2="70" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />
            {/* 剪刀剪差 */}
            <text x="120" y="44" fontSize="11">✂️</text>
            <text x="80" y="22" textAnchor="middle" fontSize="8.5" fill="#2563eb" fontWeight="800">线段图找“一份量”</text>
            <text x="80" y="86" textAnchor="middle" fontSize="8" fill="#1e40af" fontWeight="800">去差双小 · 补差双大</text>
          </svg>
        )}

        {topic.animationType === 'surplus-and-deficiency' && (
          <svg viewBox="0 0 160 100" width="130" height="80">
            {/* 盘子与糖果 */}
            <ellipse cx="45" cy="50" rx="20" ry="7" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.2" />
            <circle cx="38" cy="48" r="3" fill="#ef4444" />
            <circle cx="45" cy="48" r="3" fill="#ef4444" />
            <circle cx="52" cy="48" r="3" fill="#ef4444" />
            {/* 托盘余量（多出） */}
            <rect x="80" y="32" width="40" height="16" rx="4" fill="#dcfce7" stroke="#16a34a" strokeWidth="1" />
            <text x="100" y="43" textAnchor="middle" fontSize="7.5" fill="#15803d" fontWeight="700">+8 (盈)</text>
            {/* 托盘缺量（倒欠） */}
            <rect x="80" y="52" width="40" height="16" rx="4" fill="#fee2e2" stroke="#dc2626" strokeWidth="1" strokeDasharray="2 2" />
            <text x="100" y="63" textAnchor="middle" fontSize="7.5" fill="#b91c1c" fontWeight="700">-4 (亏)</text>
            <text x="80" y="22" textAnchor="middle" fontSize="8.5" fill="#2563eb" fontWeight="800">一盈一亏要相加</text>
            <text x="80" y="86" textAnchor="middle" fontSize="8" fill="#475569" fontWeight="700">总差 ÷ 单人差 = 人数</text>
          </svg>
        )}

        {topic.animationType === 'work-rate-problem' && (
          <svg viewBox="0 0 160 100" width="130" height="80">
            {/* 施工槽背景 */}
            <rect x="20" y="40" width="120" height="18" rx="4" fill="#f1f5f9" stroke="#64748b" strokeWidth="1" />
            {/* 甲贡献 (蓝) */}
            <rect x="20" y="40" width="60" height="18" rx="4" fill="#3b82f6" />
            {/* 乙贡献 (橙) */}
            <rect x="80" y="40" width="40" height="18" rx="4" fill="#f59e0b" />
            <text x="50" y="52" textAnchor="middle" fontSize="7.5" fill="#fff" fontWeight="700">甲 1/10</text>
            <text x="100" y="52" textAnchor="middle" fontSize="7.5" fill="#fff" fontWeight="700">乙 1/15</text>
            {/* 顶部标语 */}
            <text x="80" y="24" textAnchor="middle" fontSize="8.5" fill="#2563eb" fontWeight="800">合做天数不是平均！</text>
            <text x="80" y="86" textAnchor="middle" fontSize="8" fill="#15803d" fontWeight="800">1 ÷ (1/10 + 1/15) = 6天</text>
          </svg>
        )}

        {topic.animationType === 'newton-cow-pasture' && (
          <svg viewBox="0 0 160 100" width="130" height="80">
            {/* 牧场绿地 */}
            <rect x="15" y="48" width="130" height="32" rx="4" fill="#86efac" stroke="#15803d" strokeWidth="1" />
            {/* 动态生长嫩草芽 */}
            <path d="M 25 48 L 28 42 L 31 48 M 45 48 L 48 40 L 51 48 M 120 48 L 123 41 L 126 48" stroke="#16a34a" strokeWidth="1.5" fill="none" />
            {/* 吃草小黄牛 */}
            <ellipse cx="80" cy="54" rx="14" ry="9" fill="#f59e0b" stroke="#b45309" strokeWidth="1.2" />
            <ellipse cx="94" cy="56" rx="5" ry="4" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
            <line x1="72" y1="62" x2="72" y2="70" stroke="#b45309" strokeWidth="2" strokeLinecap="round" />
            <line x1="76" y1="62" x2="76" y2="70" stroke="#b45309" strokeWidth="2" strokeLinecap="round" />
            <line x1="84" y1="62" x2="84" y2="70" stroke="#b45309" strokeWidth="2" strokeLinecap="round" />
            <line x1="88" y1="62" x2="88" y2="70" stroke="#b45309" strokeWidth="2" strokeLinecap="round" />
            {/* 标语 */}
            <text x="80" y="24" textAnchor="middle" fontSize="8.5" fill="#15803d" fontWeight="800">牛吃草是追及问题！</text>
            <text x="80" y="90" textAnchor="middle" fontSize="7.5" fill="#1e40af" fontWeight="700">专职吃新草 · 攻坚啃老草</text>
          </svg>
        )}

        {topic.animationType === 'algebraic-equations-basics' && (
          <svg viewBox="0 0 160 100" width="130" height="80">
            {/* 天平立柱与横梁 */}
            <line x1="80" y1="36" x2="80" y2="75" stroke="#475569" strokeWidth="3" />
            <rect x="70" y="74" width="20" height="6" rx="2" fill="#334155" />
            <circle cx="80" cy="36" r="3.5" fill="#1e293b" />
            <line x1="30" y1="36" x2="130" y2="36" stroke="#475569" strokeWidth="2.5" />
            {/* 左盘吊绳与托盘 */}
            <line x1="45" y1="36" x2="35" y2="60" stroke="#94a3b8" strokeWidth="1" />
            <line x1="45" y1="36" x2="55" y2="60" stroke="#94a3b8" strokeWidth="1" />
            <ellipse cx="45" cy="60" rx="16" ry="3" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
            {/* 左盘物品: x 盒 + 小砝码 */}
            <rect x="37" y="44" width="10" height="14" rx="2" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1" />
            <text x="42" y="55" textAnchor="middle" fontSize="8" fill="#fff" fontWeight="800">x</text>
            <rect x="49" y="50" width="7" height="8" rx="1.5" fill="#eab308" stroke="#ca8a04" strokeWidth="0.8" />
            {/* 右盘吊绳与托盘 */}
            <line x1="115" y1="36" x2="105" y2="60" stroke="#94a3b8" strokeWidth="1" />
            <line x1="115" y1="36" x2="125" y2="60" stroke="#94a3b8" strokeWidth="1" />
            <ellipse cx="115" cy="60" rx="16" ry="3" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
            {/* 右盘砝码堆 */}
            <rect x="109" y="46" width="12" height="12" rx="2" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
            <text x="115" y="55" textAnchor="middle" fontSize="6.5" fill="#713f12" fontWeight="700">18g</text>
            {/* 标语 */}
            <text x="80" y="20" textAnchor="middle" fontSize="8.5" fill="#2563eb" fontWeight="800">方程本质是天平</text>
            <text x="80" y="90" textAnchor="middle" fontSize="7.5" fill="#1e40af" fontWeight="700">两边同加同减 · 同乘同除</text>
          </svg>
        )}

        {topic.animationType === 'river-boat-motion' && (
          <svg viewBox="0 0 160 100" width="130" height="80">
            {/* 河水背景 */}
            <rect x="15" y="32" width="130" height="48" rx="6" fill="#cffafe" stroke="#06b6d4" strokeWidth="1" />
            {/* 水流向右波纹 */}
            <path d="M 25 45 Q 40 40 55 45 T 85 45 T 115 45 T 135 45" stroke="#0284c7" strokeWidth="1.2" fill="none" opacity="0.6" />
            <path d="M 20 68 Q 35 63 50 68 T 80 68 T 110 68 T 130 68" stroke="#0284c7" strokeWidth="1.2" fill="none" opacity="0.6" />
            {/* 航行小汽艇 */}
            <path d="M 50 56 L 95 56 Q 105 55 110 47 L 58 47 Z" fill="#ffffff" stroke="#0284c7" strokeWidth="1.2" />
            <rect x="65" y="40" width="22" height="8" rx="2" fill="#38bdf8" />
            <polygon points="62,40 68,36 62,32" fill="#ef4444" />
            {/* 顺水水流助推箭头 */}
            <line x1="40" y1="58" x2="115" y2="58" stroke="#06b6d4" strokeWidth="2" strokeDasharray="3 2" />
            {/* 标语 */}
            <text x="80" y="22" textAnchor="middle" fontSize="8.5" fill="#0369a1" fontWeight="800">顺水加水速 · 逆水减水速</text>
            <text x="80" y="90" textAnchor="middle" fontSize="7.5" fill="#0891b2" fontWeight="700">顺逆速度差 = 2 倍水速</text>
          </svg>
        )}

        {topic.animationType === 'train-bridge-crossing' && (
          <svg viewBox="0 0 160 100" width="130" height="80">
            {/* 大桥桁架与桥墩 */}
            <rect x="35" y="55" width="90" height="4" fill="#475569" />
            <line x1="60" y1="59" x2="60" y2="72" stroke="#64748b" strokeWidth="2" />
            <line x1="100" y1="59" x2="100" y2="72" stroke="#64748b" strokeWidth="2" />
            <path d="M 35 55 L 50 42 L 65 55 L 80 42 L 95 55 L 110 42 L 125 55" stroke="#64748b" strokeWidth="1" fill="none" />
            {/* 正在过桥的火车 (车头已出桥) */}
            <rect x="75" y="46" width="45" height="9" rx="1.5" fill="#22c55e" stroke="#15803d" strokeWidth="0.8" />
            <circle cx="82" cy="56" r="1.5" fill="#0f172a" />
            <circle cx="112" cy="56" r="1.5" fill="#0f172a" />
            {/* 车头红旗 */}
            <polygon points="120,44 125,47 120,50" fill="#ef4444" />
            {/* 标语 */}
            <text x="80" y="22" textAnchor="middle" fontSize="8.5" fill="#15803d" fontWeight="800">过桥路程 = 桥长 + 车长</text>
            <text x="80" y="90" textAnchor="middle" fontSize="7.5" fill="#b45309" fontWeight="700">车身长度也是位移！</text>
          </svg>
        )}

        {topic.animationType === 'average-benchmark' && (
          <svg viewBox="0 0 160 100" width="130" height="80">
            {/* 基底 */}
            <rect x="25" y="72" width="110" height="3" fill="#64748b" />
            {/* 5 根高低水柱 */}
            <rect x="32" y="48" width="14" height="24" rx="1" fill="#38bdf8" />
            <rect x="54" y="32" width="14" height="40" rx="1" fill="#60a5fa" />
            <rect x="76" y="58" width="14" height="14" rx="1" fill="#38bdf8" />
            <rect x="98" y="28" width="14" height="44" rx="1" fill="#60a5fa" />
            <rect x="120" y="42" width="14" height="30" rx="1" fill="#38bdf8" />
            {/* 红色平均虚线 */}
            <line x1="20" y1="44" x2="140" y2="44" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="3 2" />
            {/* 标语 */}
            <text x="80" y="20" textAnchor="middle" fontSize="8.5" fill="#2563eb" fontWeight="800">移多补少 · 削峰填谷</text>
            <text x="80" y="88" textAnchor="middle" fontSize="7.5" fill="#dc2626" fontWeight="700">基准数秒算 · 平均非真数</text>
          </svg>
        )}

        {/* 28. 容斥原理与重叠问题 */}
        {(topic.animationType === 'inclusion-exclusion-venn' || topic.animationType === 'inclusion-exclusion') && (
          <svg viewBox="0 0 160 100" width="130" height="80">
            <circle cx="62" cy="50" r="28" fill="#3b82f6" fillOpacity="0.3" stroke="#2563eb" strokeWidth="1.8" />
            <circle cx="98" cy="50" r="28" fill="#ef4444" fillOpacity="0.3" stroke="#dc2626" strokeWidth="1.8" />
            <text x="50" y="53" textAnchor="middle" fontSize="10" fill="#1e40af" fontWeight="800">A</text>
            <text x="110" y="53" textAnchor="middle" fontSize="10" fill="#b91c1c" fontWeight="800">B</text>
            <text x="80" y="53" textAnchor="middle" fontSize="8" fill="#7c3aed" fontWeight="900">A∩B</text>
            <text x="80" y="18" textAnchor="middle" fontSize="8.5" fill="#2563eb" fontWeight="800">两圈相交扣重复</text>
            <text x="80" y="88" textAnchor="middle" fontSize="7.5" fill="#7c3aed" fontWeight="700">总数 = A + B - 重叠</text>
          </svg>
        )}

        {/* 29. 年龄问题 */}
        {(topic.animationType === 'age-difference' || topic.animationType === 'age-difference-problem') && (
          <svg viewBox="0 0 160 100" width="130" height="80">
            {/* 爸爸长线段 */}
            <rect x="25" y="34" width="70" height="11" rx="3" fill="#3b82f6" />
            <rect x="95" y="34" width="35" height="11" rx="3" fill="#f59e0b" />
            {/* 孩子短线段 */}
            <rect x="25" y="52" width="70" height="11" rx="3" fill="#3b82f6" />
            {/* 差量对齐虚线 */}
            <line x1="95" y1="30" x2="95" y2="68" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="2 2" />
            <line x1="130" y1="30" x2="130" y2="50" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="2 2" />
            <text x="112" y="43" textAnchor="middle" fontSize="7" fill="#fff" fontWeight="800">差24岁</text>
            <text x="80" y="19" textAnchor="middle" fontSize="8.5" fill="#2563eb" fontWeight="800">年龄差永远恒定！</text>
            <text x="80" y="88" textAnchor="middle" fontSize="7.5" fill="#d97706" fontWeight="700">过多少年差都不改</text>
          </svg>
        )}

        {/* 30. 周期与余数问题 */}
        {(topic.animationType === 'repeating-patterns-modulo' || topic.animationType === 'periodic-patterns') && (
          <svg viewBox="0 0 160 100" width="130" height="80">
            {/* 传送带槽 */}
            <rect x="18" y="40" width="124" height="22" rx="4" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.2" />
            {/* 周期框一 (红蓝绿) */}
            <rect x="22" y="43" width="46" height="16" rx="2" fill="none" stroke="#2563eb" strokeWidth="1.2" strokeDasharray="2 2" />
            <circle cx="30" cy="51" r="5" fill="#ef4444" />
            <circle cx="45" cy="51" r="5" fill="#3b82f6" />
            <circle cx="60" cy="51" r="5" fill="#10b981" />
            {/* 周期框二 */}
            <circle cx="75" cy="51" r="5" fill="#ef4444" />
            <circle cx="90" cy="51" r="5" fill="#3b82f6" />
            <circle cx="105" cy="51" r="5" fill="#10b981" />
            {/* 余数单出闪烁 */}
            <circle cx="125" cy="51" r="6" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
            <text x="80" y="20" textAnchor="middle" fontSize="8.5" fill="#2563eb" fontWeight="800">周期打包 · 余数定位</text>
            <text x="80" y="88" textAnchor="middle" fontSize="7.5" fill="#15803d" fontWeight="700">余几看第几 · 0余踩末尾</text>
          </svg>
        )}

        {/* 31. 环形跑道问题 */}
        {(topic.animationType === 'circular-track' || topic.animationType === 'circular-track-problem') && (
          <svg viewBox="0 0 160 100" width="130" height="80">
            {/* 跑道底 */}
            <ellipse cx="80" cy="49" rx="54" ry="23" fill="#f8fafc" stroke="#475569" strokeWidth="5.5" />
            <ellipse cx="80" cy="49" rx="54" ry="23" fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />
            {/* 跑车红 */}
            <circle cx="124" cy="38" r="4.5" fill="#ef4444" />
            <path d="M 129 35 Q 132 42 129 45" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
            {/* 跑车蓝 */}
            <circle cx="40" cy="60" r="4.5" fill="#3b82f6" />
            <path d="M 35 63 Q 32 56 35 53" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
            <text x="80" y="18" textAnchor="middle" fontSize="8.5" fill="#2563eb" fontWeight="800">同向差一圈 · 反向合一圈</text>
            <text x="80" y="88" textAnchor="middle" fontSize="7.5" fill="#475569" fontWeight="700">封闭跑道追及相遇模型</text>
          </svg>
        )}

        {/* 32. 倒推还原问题 */}
        {(topic.animationType === 'reverse-thinking' || topic.animationType === 'reverse-thinking-reduction') && (
          <svg viewBox="0 0 160 100" width="130" height="80">
            {/* 正向流 */}
            <g transform="translate(25, 33)">
              <rect x="0" y="0" width="22" height="13" rx="2.5" fill="#93c5fd" />
              <text x="11" y="9.5" textAnchor="middle" fontSize="7.5" fill="#1e40af" fontWeight="700">+5</text>
              <path d="M 26 6.5 L 42 6.5 M 38 3.5 L 42 6.5 L 38 9.5" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
              <rect x="46" y="0" width="22" height="13" rx="2.5" fill="#93c5fd" />
              <text x="57" y="9.5" textAnchor="middle" fontSize="7.5" fill="#1e40af" fontWeight="700">×2</text>
              <path d="M 72 6.5 L 88 6.5 M 84 3.5 L 88 6.5 L 84 9.5" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
              <rect x="92" y="0" width="22" height="13" rx="2.5" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
              <text x="103" y="9.5" textAnchor="middle" fontSize="7.5" fill="#713f12" fontWeight="800">20</text>
            </g>
            {/* 倒推流 */}
            <g transform="translate(25, 53)">
              <rect x="0" y="0" width="22" height="13" rx="2.5" fill="#86efac" stroke="#16a34a" strokeWidth="1" />
              <text x="11" y="9.5" textAnchor="middle" fontSize="7.5" fill="#14532d" fontWeight="800">5</text>
              <path d="M 42 6.5 L 26 6.5 M 30 3.5 L 26 6.5 L 30 9.5" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" />
              <rect x="46" y="0" width="22" height="13" rx="2.5" fill="#bbf7d0" />
              <text x="57" y="9.5" textAnchor="middle" fontSize="7.5" fill="#166534" fontWeight="700">-5</text>
              <path d="M 88 6.5 L 72 6.5 M 76 3.5 L 72 6.5 L 76 9.5" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" />
              <rect x="92" y="0" width="22" height="13" rx="2.5" fill="#bbf7d0" />
              <text x="103" y="9.5" textAnchor="middle" fontSize="7.5" fill="#166534" fontWeight="700">÷2</text>
            </g>
            <text x="80" y="19" textAnchor="middle" fontSize="8.5" fill="#2563eb" fontWeight="800">原路返回 · 符号反转</text>
            <text x="80" y="88" textAnchor="middle" fontSize="7.5" fill="#15803d" fontWeight="700">后发生先解开 (+变-，×变÷)</text>
          </svg>
        )}

        {/* 33. 九宫格与三阶幻方 */}
        {(topic.animationType === 'magic-square' || topic.animationType === 'magic-square-number-array') && (
          <svg viewBox="0 0 160 100" width="130" height="80">
            <g transform="translate(54, 23)">
              <rect x="0" y="0" width="52" height="52" rx="4" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
              <line x1="17.3" y1="0" x2="17.3" y2="52" stroke="#e2e8f0" strokeWidth="1" />
              <line x1="34.6" y1="0" x2="34.6" y2="52" stroke="#e2e8f0" strokeWidth="1" />
              <line x1="0" y1="17.3" x2="52" y2="17.3" stroke="#e2e8f0" strokeWidth="1" />
              <line x1="0" y1="34.6" x2="52" y2="34.6" stroke="#e2e8f0" strokeWidth="1" />
              <text x="26" y="12" textAnchor="middle" fontSize="8.5" fill="#1e293b" fontWeight="700">9</text>
              <text x="26" y="47" textAnchor="middle" fontSize="8.5" fill="#1e293b" fontWeight="700">1</text>
              <text x="8.5" y="30" textAnchor="middle" fontSize="8.5" fill="#1e293b" fontWeight="700">3</text>
              <text x="43.5" y="30" textAnchor="middle" fontSize="8.5" fill="#1e293b" fontWeight="700">7</text>
              <rect x="18.5" y="18.5" width="15" height="15" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" rx="2" />
              <text x="26" y="30" textAnchor="middle" fontSize="9.5" fill="#b45309" fontWeight="900">5</text>
              <text x="8.5" y="12" textAnchor="middle" fontSize="7.5" fill="#64748b">4</text>
              <text x="43.5" y="12" textAnchor="middle" fontSize="7.5" fill="#64748b">2</text>
              <text x="8.5" y="47" textAnchor="middle" fontSize="7.5" fill="#64748b">8</text>
              <text x="43.5" y="47" textAnchor="middle" fontSize="7.5" fill="#64748b">6</text>
            </g>
            <text x="80" y="16" textAnchor="middle" fontSize="8.5" fill="#2563eb" fontWeight="800">戴九履一 · 五居中央</text>
            <text x="80" y="90" textAnchor="middle" fontSize="7.5" fill="#b45309" fontWeight="700">三阶幻方 · 幻和恒等于 15</text>
          </svg>
        )}

        {/* 34. 正方体涂色切块 */}
        {(topic.animationType === 'cube-coloring' || topic.animationType === 'cube-coloring-cutting') && (
          <svg viewBox="0 0 160 100" width="130" height="80">
            <g transform="translate(80, 50)">
              {/* 顶角红色块 */}
              <g transform="translate(-24, -18)">
                <polygon points="0,-7 8,-11 0,-15 -8,-11" fill="#f87171" stroke="#dc2626" strokeWidth="0.8" />
                <polygon points="-8,-11 0,-7 0,3 -8,-1" fill="#ef4444" stroke="#dc2626" strokeWidth="0.8" />
                <polygon points="0,-7 8,-11 8,-1 0,3" fill="#b91c1c" stroke="#dc2626" strokeWidth="0.8" />
              </g>
              {/* 棱上蓝色块 */}
              <g transform="translate(24, -18)">
                <polygon points="0,-7 8,-11 0,-15 -8,-11" fill="#60a5fa" stroke="#2563eb" strokeWidth="0.8" />
                <polygon points="-8,-11 0,-7 0,3 -8,-1" fill="#3b82f6" stroke="#2563eb" strokeWidth="0.8" />
                <polygon points="0,-7 8,-11 8,-1 0,3" fill="#1d4ed8" stroke="#2563eb" strokeWidth="0.8" />
              </g>
              {/* 面心黄色块 */}
              <g transform="translate(-24, 13)">
                <polygon points="0,-7 8,-11 0,-15 -8,-11" fill="#fde047" stroke="#ca8a04" strokeWidth="0.8" />
                <polygon points="-8,-11 0,-7 0,3 -8,-1" fill="#eab308" stroke="#ca8a04" strokeWidth="0.8" />
                <polygon points="0,-7 8,-11 8,-1 0,3" fill="#a16207" stroke="#ca8a04" strokeWidth="0.8" />
              </g>
              {/* 内部绿色核心 */}
              <g transform="translate(24, 13)">
                <polygon points="0,-7 8,-11 0,-15 -8,-11" fill="#86efac" stroke="#16a34a" strokeWidth="0.8" />
                <polygon points="-8,-11 0,-7 0,3 -8,-1" fill="#22c55e" stroke="#16a34a" strokeWidth="0.8" />
                <polygon points="0,-7 8,-11 8,-1 0,3" fill="#15803d" stroke="#16a34a" strokeWidth="0.8" />
              </g>
              {/* 爆炸拉伸虚线 */}
              <line x1="-12" y1="-9" x2="12" y2="9" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="12" y1="-9" x2="-12" y2="9" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />
            </g>
            <text x="80" y="17" textAnchor="middle" fontSize="8.5" fill="#2563eb" fontWeight="800">顶8 · 棱12 · 面6 · 核立方</text>
            <text x="80" y="88" textAnchor="middle" fontSize="7.5" fill="#475569" fontWeight="700">3D爆炸透视涂色切块</text>
          </svg>
        )}

        {/* 35. 抽屉原理（鸽巢原理） */}
        {topic.animationType === 'pigeonhole-principle' && (
          <svg viewBox="0 0 160 100" width="130" height="80">
            {/* 3 个笼子 */}
            <g transform="translate(20, 30)">
              {/* 笼子 1 (1只) */}
              <rect x="0" y="0" width="36" height="36" rx="4" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="2 2" />
              <text x="18" y="24" textAnchor="middle" fontSize="16">🕊️</text>
              {/* 笼子 2 (2只，高亮) */}
              <rect x="42" y="0" width="36" height="36" rx="4" fill="#eff6ff" stroke="#2563eb" strokeWidth="1.8" />
              <text x="13" y="24" textAnchor="middle" fontSize="13">🕊️</text>
              <text x="27" y="24" textAnchor="middle" fontSize="13">🕊️</text>
              <polygon points="60,2 62,6 66,3 64,8 60,6 56,8 54,3 58,6" fill="#f59e0b" />
              {/* 笼子 3 (1只) */}
              <rect x="84" y="0" width="36" height="36" rx="4" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="2 2" />
              <text x="102" y="24" textAnchor="middle" fontSize="16">🕊️</text>
            </g>
            <text x="80" y="18" textAnchor="middle" fontSize="8.5" fill="#2563eb" fontWeight="800">4鸽3笼 · 必有笼≥2只</text>
            <text x="80" y="88" textAnchor="middle" fontSize="7.5" fill="#dc2626" fontWeight="700">最不利原则 · 倒霉蛋+1</text>
          </svg>
        )}

        {/* 36. 等差数列与高斯求和 */}
        {(topic.animationType === 'arithmetic-progression' || topic.animationType === 'arithmetic-progression-gauss') && (
          <svg viewBox="0 0 160 100" width="130" height="80">
            {/* 倒扣拼合阶梯大矩形 */}
            <g transform="translate(42, 24)">
              {/* 第1行: 蓝1 红4 */}
              <rect x="0" y="0" width="15" height="11" rx="1.5" fill="#3b82f6" />
              <rect x="15" y="0" width="60" height="11" rx="1.5" fill="#f87171" />
              {/* 第2行: 蓝2 红3 */}
              <rect x="0" y="13" width="30" height="11" rx="1.5" fill="#3b82f6" />
              <rect x="30" y="13" width="45" height="11" rx="1.5" fill="#f87171" />
              {/* 第3行: 蓝3 红2 */}
              <rect x="0" y="26" width="45" height="11" rx="1.5" fill="#3b82f6" />
              <rect x="45" y="26" width="30" height="11" rx="1.5" fill="#f87171" />
              {/* 第4行: 蓝4 红1 */}
              <rect x="0" y="39" width="60" height="11" rx="1.5" fill="#3b82f6" />
              <rect x="60" y="39" width="15" height="11" rx="1.5" fill="#f87171" />
            </g>
            <text x="80" y="17" textAnchor="middle" fontSize="8.5" fill="#2563eb" fontWeight="800">倒序相加 · 阶梯拼图</text>
            <text x="80" y="90" textAnchor="middle" fontSize="7.5" fill="#15803d" fontWeight="700">和 = (首项 + 末项) × 项数 ÷ 2</text>
          </svg>
        )}

        {/* 37. 巧求不规则图形周长：平移法 */}
        {(topic.animationType === 'irregular-perimeter' || topic.animationType === 'irregular-perimeter-translation') && (
          <svg viewBox="0 0 160 100" width="130" height="80">
            {/* 大长方形参考虚线 */}
            <rect x="25" y="24" width="110" height="52" fill="none" stroke="#cbd5e1" strokeWidth="1.2" strokeDasharray="3 3" />
            {/* 凹字形多边形实体 */}
            <polygon points="25,24 60,24 60,45 100,45 100,24 135,24 135,76 25,76" fill="#eff6ff" stroke="#2563eb" strokeWidth="1.5" />
            {/* 凹陷两条红线标注 */}
            <line x1="60" y1="24" x2="60" y2="45" stroke="#dc2626" strokeWidth="2.5" />
            <line x1="100" y1="24" x2="100" y2="45" stroke="#dc2626" strokeWidth="2.5" />
            {/* 向上平移推平虚线 */}
            <line x1="60" y1="24" x2="100" y2="24" stroke="#10b981" strokeWidth="2" strokeDasharray="2 2" />
            <path d="M 80 40 L 80 28 M 77 31 L 80 27 L 83 31" stroke="#10b981" strokeWidth="1.2" fill="none" />
            <text x="80" y="18" textAnchor="middle" fontSize="8.5" fill="#2563eb" fontWeight="800">平移推平 · 凹多两边</text>
            <text x="80" y="90" textAnchor="middle" fontSize="7.5" fill="#dc2626" fontWeight="700">周长 = 大长方形 + 凹深×2</text>
          </svg>
        )}

        {/* 38. 乘法分配律与面积拼图 */}
        {(topic.animationType === 'distributive-law' || topic.animationType === 'distributive-law-area') && (
          <svg viewBox="0 0 160 100" width="130" height="80">
            {/* 蓝色块 a×c */}
            <rect x="25" y="26" width="60" height="48" rx="2" fill="#93c5fd" stroke="#2563eb" strokeWidth="1.5" />
            <text x="55" y="54" textAnchor="middle" fontSize="10" fontWeight="800" fill="#1e3a8a">a × c</text>
            {/* 黄色块 b×c */}
            <rect x="88" y="26" width="45" height="48" rx="2" fill="#fde047" stroke="#ca8a04" strokeWidth="1.5" />
            <text x="110" y="54" textAnchor="middle" fontSize="10" fontWeight="800" fill="#713f12">b × c</text>
            {/* 公共高 c 标注 */}
            <line x1="20" y1="26" x2="20" y2="74" stroke="#2563eb" strokeWidth="1.5" />
            <text x="15" y="53" textAnchor="middle" fontSize="8" fontWeight="800" fill="#2563eb">c</text>
            <text x="80" y="18" textAnchor="middle" fontSize="8.5" fill="#2563eb" fontWeight="800">面积拼图 · 必须乘两次</text>
            <text x="80" y="90" textAnchor="middle" fontSize="7.5" fill="#15803d" fontWeight="700">(a + b) × c = ac + bc</text>
          </svg>
        )}

        {/* 39. 消元法与等量代换 */}
        {(topic.animationType === 'substitution-elimination' || topic.animationType === 'substitution-elimination-method') && (
          <svg viewBox="0 0 160 100" width="130" height="80">
            {/* 上篮 */}
            <rect x="25" y="24" width="110" height="22" rx="4" fill="#ffffff" stroke="#3b82f6" strokeWidth="1.2" />
            <text x="35" y="39" fontSize="13">🍉</text>
            <text x="50" y="39" fontSize="13">🍉</text>
            <text x="70" y="39" fontSize="13" opacity="0.3">🍇</text>
            <line x1="68" y1="34" x2="84" y2="34" stroke="#dc2626" strokeWidth="1.5" />
            <text x="110" y="39" textAnchor="middle" fontSize="9" fontWeight="800" fill="#1e3a8a">54元</text>
            {/* 下篮 */}
            <rect x="25" y="52" width="110" height="22" rx="4" fill="#ffffff" stroke="#10b981" strokeWidth="1.2" />
            <text x="35" y="67" fontSize="13">🍉</text>
            <text x="70" y="67" fontSize="13" opacity="0.3">🍇</text>
            <line x1="68" y1="62" x2="84" y2="62" stroke="#dc2626" strokeWidth="1.5" />
            <text x="110" y="67" textAnchor="middle" fontSize="9" fontWeight="800" fill="#065f46">26元</text>
            <text x="80" y="17" textAnchor="middle" fontSize="8.5" fill="#2563eb" fontWeight="800">等量消元 · 抓差额</text>
            <text x="80" y="90" textAnchor="middle" fontSize="7.5" fill="#dc2626" fontWeight="700">消去相同项 · 差额归单物</text>
          </svg>
        )}

        {/* 40. 溶液浓度问题与十字交叉法 */}
        {(topic.animationType === 'ratio-concentration' || topic.animationType === 'ratio-concentration-problem') && (
          <svg viewBox="0 0 160 100" width="130" height="80">
            {/* 烧杯外框 */}
            <path d="M 32 28 L 32 72 Q 32 78 38 78 L 72 78 Q 78 78 78 72 L 78 28" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
            {/* 烧杯刻度线 */}
            <line x1="32" y1="42" x2="40" y2="42" stroke="#94a3b8" strokeWidth="1.2" />
            <line x1="32" y1="56" x2="44" y2="56" stroke="#94a3b8" strokeWidth="1.2" />
            <line x1="32" y1="68" x2="40" y2="68" stroke="#94a3b8" strokeWidth="1.2" />
            {/* 溶液液面 */}
            <path d="M 33 46 L 77 46 L 77 72 Q 77 77 72 77 L 38 77 Q 33 77 33 72 Z" fill="#fed7aa" opacity="0.8" />
            {/* 溶质糖颗粒 */}
            <circle cx="45" cy="58" r="2.5" fill="#ea580c" />
            <circle cx="55" cy="66" r="2.5" fill="#ea580c" />
            <circle cx="65" cy="56" r="2.5" fill="#ea580c" />
            <circle cx="50" cy="70" r="2.5" fill="#ea580c" />
            {/* 滴管/加水箭头 */}
            <path d="M 55 18 L 55 36 M 50 31 L 55 36 L 60 31" fill="none" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {/* 右侧十字交叉杠杆示意 */}
            <rect x="94" y="32" width="56" height="42" rx="4" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="100" y1="40" x2="144" y2="66" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="100" y1="66" x2="144" y2="40" stroke="#94a3b8" strokeWidth="1.5" />
            <circle cx="122" cy="53" r="7" fill="#059669" />
            <text x="122" y="56" textAnchor="middle" fontSize="6.5" fill="#ffffff" fontWeight="800">%</text>
            <text x="80" y="16" textAnchor="middle" fontSize="8.5" fill="#0369a1" fontWeight="800">溶液浓度 · 抓不变量</text>
            <text x="80" y="90" textAnchor="middle" fontSize="7.5" fill="#d97706" fontWeight="700">稀释抓溶质 · 十字交叉平杠杆</text>
          </svg>
        )}

        {/* 默认精致兜底（保证任何新增知识点都不会有空白卡片） */}
        {!['circle-area', 'pythagorean-theorem', 'buoyancy-archimedes', 'clock-reading', 'ten-frame', 'transfer-and-balance', 'line-up-ordering', 'front-back-left-right', 'compass-directions', 'multiplication-array', 'hidden-cubes-counting', 'chicken-rabbit-cage', 'triangle-area-parallelogram', 'perimeter-vs-area', 'cube-nets-folding', 'speed-meeting-chasing', 'cylinder-cone-volume', 'fractions-basics', 'tree-planting-intervals', 'sum-difference-multiple', 'surplus-and-deficiency', 'work-rate-problem', 'newton-cow-pasture', 'algebraic-equations-basics', 'river-boat-motion', 'train-bridge-crossing', 'average-benchmark', 'inclusion-exclusion-venn', 'inclusion-exclusion', 'age-difference', 'age-difference-problem', 'periodic-patterns', 'repeating-patterns-modulo', 'circular-track', 'circular-track-problem', 'reverse-thinking', 'reverse-thinking-reduction', 'magic-square', 'magic-square-number-array', 'cube-coloring', 'cube-coloring-cutting', 'pigeonhole-principle', 'arithmetic-progression', 'arithmetic-progression-gauss', 'irregular-perimeter', 'irregular-perimeter-translation', 'distributive-law', 'distributive-law-area', 'substitution-elimination', 'substitution-elimination-method', 'ratio-concentration', 'ratio-concentration-problem'].includes(topic.animationType) && (
          <svg viewBox="0 0 160 100" width="130" height="80">
            <rect x="25" y="20" width="110" height="60" rx="8" fill="#f0f9ff" stroke="#bae6fd" strokeWidth="1.5" />
            <circle cx="80" cy="46" r="16" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1.5" />
            <polygon points="76,38 90,46 76,54" fill="#0284c7" />
            <text x="80" y="74" textAnchor="middle" fontSize="8" fill="#0284c7" fontWeight="700">动手拖拽探索动画</text>
          </svg>
        )}
      </div>








      <div className={styles.cardBody}>
        <div className={styles.cardMeta}>
          <span className="badge badge-blue">{stage?.name}</span>
          <span
            className="badge"
            style={{ background: `${subject?.color}15`, color: subject?.color, border: `1px solid ${subject?.color}30` }}
          >
            {subject?.name}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>
            {topic.grade}
          </span>
        </div>

        <h3 className={styles.cardTitle}>{topic.title}</h3>
        <p className={styles.cardSummary}>{topic.summary}</p>

        <div className={styles.cardParentTip}>
          <Lightbulb size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
          <span><strong>辅导关键：</strong>{topic.parentGuide.keyTakeaway}</span>
        </div>

        <div className={styles.cardFooter}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={13} />
            约 {topic.durationMinutes} 分钟讲透
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-primary)', fontWeight: 600 }}>
            开始探索 <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
}
