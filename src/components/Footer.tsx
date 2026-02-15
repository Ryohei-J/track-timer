import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full max-w-6xl mt-6 px-4 pb-4 text-center text-xs text-text-secondary space-y-2">
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
        <Link
          href="/privacy"
          className="hover:text-text-primary transition-colors"
        >
          Privacy Policy
        </Link>
        <Link
          href="/terms"
          className="hover:text-text-primary transition-colors"
        >
          Terms of Service
        </Link>
        <a
          href="https://www.youtube.com/t/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-text-primary transition-colors"
        >
          YouTube Terms
        </a>
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-text-primary transition-colors"
        >
          Google Privacy Policy
        </a>
      </div>
      <p>&copy; 2026 PomotimerX. All rights reserved.</p>
    </footer>
  );
}
