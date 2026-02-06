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
        className="fixed top-0 w-full z-50 backdrop-blur-lg border-b border-neutral-100"
        style={{ background: "rgba(250,250,250,0.8)" }}
      >
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="/" className="text-sm font-bold tracking-tight">
            mithun<span className="green">snottechnical</span>
          </a>
          <div className="flex items-center gap-5">
            <a href="/#work" className="nav-link">Work</a>
            <Link href="/blog" className="nav-link" style={{ color: "#15803d" }}>Blog</Link>
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
            className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-600 transition-colors mb-8"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M8 2L4 6l4 4" />
            </svg>
            Back to blog
          </Link>

          <p className="mono text-xs text-neutral-400 mb-3" style={{ fontSize: 11 }}>
            {new Date(post.date + "T00:00:00").toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>

          <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight mb-4">
            {post.title}
          </h1>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-6">
              {post.tags.map((tag) => (
                <span key={tag} className="card-tag">{tag}</span>
              ))}
            </div>
          )}

          <div className="section-line mb-8" />

          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />

          <div className="section-line mt-12 mb-8" />

          <Link
            href="/blog"
            className="btn btn-outline"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M8 2L4 6l4 4" />
            </svg>
            All posts
          </Link>
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t border-neutral-100 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <p className="text-xs text-neutral-400">Mithun Manjunatha</p>
          <p className="text-xs text-neutral-400">Built with Next.js + Claude</p>
        </div>
      </footer>
    </div>
  );
}
