'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Sparkles, BookOpen, HeartHandshake, Search, FolderTree } from 'lucide-react';
import { SearchTopicItem } from '@/types';
import SearchModal from '@/components/search/SearchModal';
import styles from '@/styles/layout.module.css';
import searchStyles from '@/styles/search.module.css';

interface HeaderProps {
  searchIndex?: SearchTopicItem[];
}

export default function Header({ searchIndex = [] }: HeaderProps) {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // 全局快捷键监听 (Ctrl+K / Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { href: '/', label: '首页推荐', icon: Compass },
    { href: '/explore', label: '知识大目录', icon: FolderTree },
    { href: '/xiaoxue', label: '小学专区', icon: BookOpen },
    { href: '/chuzhong', label: '初中专区', icon: BookOpen },
    { href: '/gaozhong', label: '高中专区', icon: BookOpen },
  ];

  return (
    <>
      <header className={`${styles.header} glass-effect`}>
        {/* 第一行：品牌 Logo 与右侧搜索及辅助操作 */}
        <div className={styles.headerTopRow}>
          <div className={`container ${styles.headerTopInner}`}>
            <Link href="/" className={styles.brand}>
              <div className={styles.brandLogo}>讲</div>
              <div className={styles.brandName}>
                <span className={styles.brandTitle}>讲明白</span>
                <span className={styles.brandSlogan}>中小学知识点 JS 交互实验室</span>
              </div>
            </Link>

            <div className={styles.headerActions}>
              {/* 顶部搜索框按钮 */}
              <button
                type="button"
                className={searchStyles.headerSearchBtn}
                onClick={() => setIsSearchOpen(true)}
                title="搜索知识点 (Ctrl+K / ⌘K)"
                aria-label="搜索知识点"
              >
                <Search size={15} />
                <span className={searchStyles.headerSearchText}>搜索知识点...</span>
                <kbd className={searchStyles.headerSearchKbd}>⌘K</kbd>
              </button>

              <div className={styles.parentBadge}>
                <HeartHandshake size={14} />
                <span>家长辅导神器</span>
              </div>

              <Link href="/chuzhong/physics/buoyancy-archimedes" className={`btn btn-primary ${styles.tryBtn}`}>
                <Sparkles size={15} />
                <span>体验演示</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 第二行：主菜单导航栏（整洁居左，支持移动端横向丝滑滑动，永不挤压折行） */}
        <div className={styles.headerNavRow}>
          <div className={`container ${styles.headerNavInner}`}>
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
                    <Icon size={15} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* 搜索浮层弹窗 */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        topics={searchIndex}
      />
    </>
  );
}
