'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Sparkles, BookOpen, HeartHandshake } from 'lucide-react';
import styles from '@/styles/layout.module.css';

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: '首页推荐', icon: Compass },
    { href: '/xiaoxue', label: '小学专区', icon: BookOpen },
    { href: '/chuzhong', label: '初中专区', icon: BookOpen },
    { href: '/gaozhong', label: '高中专区', icon: BookOpen },
  ];

  return (
    <header className={`${styles.header} glass-effect`}>
      <div className={`container ${styles.headerInner}`}>
        <Link href="/" className={styles.brand}>
          <div className={styles.brandLogo}>讲</div>
          <div className={styles.brandName}>
            <span className={styles.brandTitle}>讲明白</span>
            <span className={styles.brandSlogan}>中小学知识点 JS 交互实验室</span>
          </div>
        </Link>

        <nav className={styles.nav}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = link.href === '/' 
              ? pathname === '/' 
              : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
              >
                <Icon size={16} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.headerActions}>
          <div className={styles.parentBadge}>
            <HeartHandshake size={14} />
            <span>家长辅导神器</span>
          </div>

          <Link href="/chuzhong/physics/buoyancy-archimedes" className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
            <Sparkles size={15} />
            <span>体验演示</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
