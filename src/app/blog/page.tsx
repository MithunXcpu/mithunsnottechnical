import { getAllPosts } from "@/lib/blog";
import Link from "next/link";

export const metadata = {
  title: "Blog — mithunsnottechnical",
  description: "My takes, inspired by the All-In Podcast.",
};

export default function BlogPage() {
  const posts = getAllPosts();

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
            <a href="/blog" className="nav-link" style={{ color: "#15803d" }}>Blog</a>
            <a href="/#about" className="nav-link">About</a>
            <a href="https://github.com/MithunXcpu" target="_blank" rel="noopener noreferrer" className="nav-link">GitHub</a>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header style={{ paddingTop: 120 }} className="pb-10 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="mono text-xs tracking-widest uppercase green mb-4">Blog</p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            My takes, weekly.
          </h1>
          <p className="text-base text-neutral-500 leading-relaxed max-w-lg">
            Derivative opinions inspired by Chamath and the All-In Podcast. Under 500 words. No fluff.
          </p>
        </div>
      </header>

      <div className="section-line max-w-3xl mx-auto" />

      {/* Post List */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        {posts.length === 0 ? (
          <p className="text-sm text-neutral-400">No posts yet. Check back Monday.</p>
        ) : (
          <div className="space-y-0">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block group"
              >
                <article className="py-6 border-b border-neutral-100">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="mono text-xs text-neutral-400 mb-2" style={{ fontSize: 11 }}>
                        {new Date(post.date + "T00:00:00").toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <h2 className="text-base font-semibold mb-1.5 group-hover:text-green-700 transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-sm text-neutral-500 leading-relaxed">
                        {post.excerpt}
                      </p>
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {post.tags.map((tag) => (
                            <span key={tag} className="card-tag">{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <svg
                      className="card-arrow w-3.5 h-3.5 mt-1 flex-shrink-0"
                      viewBox="0 0 14 14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 10L10 4M10 4H5M10 4V9" />
                    </svg>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>

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
