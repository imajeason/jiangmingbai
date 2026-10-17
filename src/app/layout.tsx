import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s - 讲明白 (JiangMingBai)',
    default: '讲明白 - 中小学知识点 JS 交互实验室与家长辅导指南',
  },
  description: '讲明白 (JiangMingBai) 专为家长与中小学生打造，通过可调节参数的纯 JS/Canvas 互动动画与提问三步法，直观拆解小学、初中、高中理科核心考点与抽象难点。',
  keywords: [
    '讲明白',
    '中小学知识点动画',
    '几何直观证明',
    '初中物理实验动画',
    '家长辅导孩子',
    '勾股定理动画',
    '圆面积推导',
    '阿基米德浮力',
  ],
  authors: [{ name: '讲明白团队' }],
  metadataBase: new URL('https://jiangmingbai.pages.dev'),
  openGraph: {
    title: '讲明白 - 中小学知识点 JS 交互实验室',
    description: '把抽象枯燥的数理化公式，变成好玩的互动实验，让家长轻松讲透，孩子一秒看懂。',
    url: 'https://jiangmingbai.pages.dev',
    siteName: '讲明白 (JiangMingBai)',
    locale: 'zh_CN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        <Header />
        <main style={{ minHeight: 'calc(100vh - var(--header-height) - 300px)' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
