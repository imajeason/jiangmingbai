import React from 'react';
import Link from 'next/link';
import { Cloud, Heart, Lightbulb, Compass, ShieldCheck } from 'lucide-react';
import styles from '@/styles/layout.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerGrid}`}>
        <div className={styles.footerCol}>
          <div className={styles.brand} style={{ marginBottom: '12px' }}>
            <div className={styles.brandLogo} style={{ width: '30px', height: '30px', fontSize: '0.9rem' }}>讲</div>
            <span style={{ fontSize: '1.15rem' }}>讲明白 JiangMingBai</span>
          </div>
          <p className={styles.footerBrandDesc}>
            专为家长和中小学生设计的知识点可视化互动实验室。通过自主调节参数的纯 JS 动画与启发式提问三步法，彻底打破“死记硬背”，让孩子真正看明白、想透彻。
          </p>
          <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
            <span className={styles.cfTag}>
              <Cloud size={13} />
              Cloudflare Pages 静态驱动
            </span>
            <span className={styles.cfTag} style={{ background: '#f0fdf4', color: '#15803d', borderColor: '#bbf7d0' }}>
              <ShieldCheck size={13} />
              纯绿色无广告
            </span>
          </div>
        </div>

        <div className={styles.footerCol}>
          <h4>学段分类</h4>
          <ul>
            <li><Link href="/xiaoxue">小学专区 (1-6年级)</Link></li>
            <li><Link href="/chuzhong">初中专区 (7-9年级)</Link></li>
            <li><Link href="/gaozhong">高中专区 (高一至高三)</Link></li>
            <li><Link href="/explore">全部分类检索</Link></li>
          </ul>
        </div>

        <div className={styles.footerCol}>
          <h4>学科导航</h4>
          <ul>
            <li><Link href="/chuzhong/math">数学 (几何推导/函数图像)</Link></li>
            <li><Link href="/chuzhong/physics">物理 (浮力/光学/力学平衡)</Link></li>
            <li><Link href="/xiaoxue/math">小学趣味数学</Link></li>
            <li><Link href="/chuzhong/chemistry">化学 (分子与反应模型)</Link></li>
          </ul>
        </div>

        <div className={styles.footerCol}>
          <h4>家长辅导指南</h4>
          <ul>
            <li>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.875rem', color: '#475569' }}>
                <Lightbulb size={14} color="#d97706" />
                三步提问法代替直接讲题
              </span>
            </li>
            <li>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.875rem', color: '#475569' }}>
                <Heart size={14} color="#ef4444" />
                保护孩子的好奇心与直觉
              </span>
            </li>
            <li><a href="https://github.com" target="_blank" rel="noreferrer">GitHub 开源同步</a></li>
            <li><Link href="/">关于“讲明白”</Link></li>
          </ul>
        </div>
      </div>

      <div className={`container ${styles.footerBottom}`}>
        <div>
          © {new Date().getFullYear()} 讲明白 (JiangMingBai.com) · 中小学知识点可视化互动平台
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span>纯静态 SSG 架构</span>
          <span>·</span>
          <span>SEO 优选静态预渲染</span>
          <span>·</span>
          <span>Cloudflare Edge 毫秒分发</span>
        </div>
      </div>
    </footer>
  );
}
