export default function Footer() {
    const currentYear = new Date().getFullYear();
    return (
      <footer className="mt-16 py-6 border-t border-gray-200 dark:border-gray-700/50">
        <div className="container mx-auto px-4 text-center text-sm text-[var(--muted-foreground)]">
          © {currentYear} 个人博客. All Rights Reserved.
          <br />
          主题色: <span style={{ color: 'var(--primary)', fontWeight: '500' }}>#FFD100</span>
           - Created with Next.js & Tailwind CSS.
        </div>
      </footer>
    );
  }