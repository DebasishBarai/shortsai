import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
            Terms of Use
          </Link>
          <div className="hidden md:block text-muted-foreground">•</div>
          <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
            Privacy Policy
          </Link>
          <div className="hidden md:block text-muted-foreground">•</div>
          <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">
            Contact Us
          </Link>
        </div>
        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} <span className='text-orange-400'>Shorts AI</span> All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
