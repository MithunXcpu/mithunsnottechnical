import { getPostBySlug, getAllSlugs } from "@/lib/blog";
import { notFound } from "next/navigation";
import Link from "next/link";

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} — mithunsnottechnical`,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav
        className="fixed top-0 w-full z-50 backdrop-blur-xl"
        style={{
          background: "rgba(12, 12, 12, 0.8)",
          borderBottom: "1px solid var(--color-border-subtle)",
        }}
      >
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="/" className="text-sm font-bold tracking-tight">
            mithun<span className="green">snottechnical</span>
          </a>
          <div className="hidden md:flex items-center gap-5">
            <a href="/#work" className="nav-link">Work</a>
            <Link href="/blog" className="nav-link" style={{ color: "var(--green)" }}>Blog</Link>
            <Link href="/interviewers" className="nav-link">For Interviewers</Link>
            <a href="/#about" className="nav-link">About</a>
            <a href="https://github.com/MithunXcpu" target="_blank" rel="noopener noreferrer" className="nav-link">GitHub</a>
          </div>
        </div>
      </nav>

      {/* Post */}
      <article style={{ paddingTop: 120 }} className="pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs transition-colors mb-8"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M8 2L4 6l4 4" />
            </svg>
            Back to blog
          </Link>

          <p className="mono text-xs mb-3" style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>
            {new Date(post.date + "T00:00:00").toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>

          <h1
            className="text-2xl md:text-3xl font-bold tracking-tight leading-tight mb-4 font-display italic"
            style={{ color: "var(--color-text-primary)" }}
          >
            {post.title}
          </h1>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-6">
              {post.tags.map((tag) => (
                <span key={tag} className="card-tag">{tag}</span>
              ))}
            </div>
          )}

          <div className="glow-line mb-8" />

          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />

          <div className="glow-line mt-12 mb-8" />

          <Link
            href="/blog"
            className="btn btn-ghost inline-flex items-center gap-2"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M8 2L4 6l4 4" />
            </svg>
            All posts
          </Link>
        </div>
      </article>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--color-border-subtle)",
          background: "var(--color-surface-raised)",
        }}
      >
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>Mithun Manjunatha</p>
          <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>Built with Next.js + Claude</p>
        </div>
      </footer>
    </div>
  );
}
