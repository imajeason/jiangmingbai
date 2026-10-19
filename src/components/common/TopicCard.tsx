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
