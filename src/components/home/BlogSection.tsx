import React, { useState } from 'react';
import { motion, AnimatePresence as _AnimatePresence } from 'framer-motion';
import { Heart, Share2, Calendar, User, Tag, ArrowRight, Loader2 as _Loader2 } from 'lucide-react';
import { Dialog, DialogContent } from '../ui/dialog';
import { BlogPost } from '../../types/blog';
import ReactMarkdown from 'react-markdown';

interface BlogSectionProps {
  posts: BlogPost[];
}

const BlogSection: React.FC<BlogSectionProps> = ({ posts }) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  


  const handleLike = (postId: string) => {
    const newLikedPosts = new Set(likedPosts);
    if (newLikedPosts.has(postId)) {
      newLikedPosts.delete(postId);
    } else {
      newLikedPosts.add(postId);
    }
    setLikedPosts(newLikedPosts);
  };

  const handleShare = async (post: BlogPost) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${post.title} - ${window.location.href}`);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <>
      <motion.section 
        className="mbg-section mbg-bg-light"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        viewport={{ once: true, margin: '-100px' }}
      >
        <div className="mbg-container">
          <motion.div 
            className="text-center mb-16 scroll-fade-in"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className="mbg-heading-xl mb-6">
              Our <span className="mbg-text-accent">Blog</span>
            </h2>
            <p className="mbg-text-lg text-gray-600 max-w-3xl mx-auto">
              Discover transformative insights, healing wisdom, and spiritual guidance through our curated collection of articles and stories.
            </p>
          </motion.div>

          {/* Featured Post */}
          {posts.length > 0 && (
            <motion.div 
              className="mb-16 scroll-fade-in"
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              viewport={{ once: true }}
            >
              <motion.div 
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.025, boxShadow: '0 8px 32px 0 rgba(34,197,94,0.10)' }}
                transition={{ type: 'spring', stiffness: 200, damping: 18 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  <motion.div className="relative h-64 lg:h-auto" initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} viewport={{ once: true }}>
                    <img
                      src={posts[0].imageUrl}
                      alt={posts[0].title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded-full">
                        Featured
                      </span>
                    </div>
                  </motion.div>
                  <motion.div className="p-8 lg:p-12 flex flex-col justify-center" initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.3 }} viewport={{ once: true }}>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {posts[0].date}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {posts[0].author}
                      </span>
                      <span className="text-green-600 font-medium">{posts[0].readTime}</span>
                    </div>
                    <h3 className="mbg-heading-lg mb-4 line-clamp-2">{posts[0].title}</h3>
                    <p className="mbg-text-base text-gray-600 mb-6 line-clamp-3">{posts[0].excerpt}</p>
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setSelectedPost(posts[0])}
                        className="inline-flex items-center gap-2 text-green-600 font-medium hover:text-green-700 transition-colors"
                      >
                        Read Full Article
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleLike(posts[0].id)}
                          className={`flex items-center gap-1 transition-colors ${
                            likedPosts.has(posts[0].id) ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                          }`}
                        >
                          <Heart className={`w-5 h-5 ${likedPosts.has(posts[0].id) ? 'fill-current' : ''}`} />
                          <span className="text-sm font-medium">{posts[0].likes + (likedPosts.has(posts[0].id) ? 1 : 0)}</span>
                        </button>
                        <button
                          onClick={() => handleShare(posts[0])}
                          className="flex items-center gap-1 text-gray-500 hover:text-green-600 transition-colors"
                        >
                          <Share2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Blog Grid */}
          {posts.length > 1 && (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mb-20 scroll-stagger"
              initial="hidden"
              whileInView="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.13 } }
              }}
              viewport={{ once: true, margin: '-100px' }}
            >
              {posts.slice(1, 9).map((post, index) => (
                <motion.article
                  key={post.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group scroll-fade-in mb-6"
                  variants={{
                    hidden: { opacity: 0, y: 40, scale: 0.97 },
                    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: 'easeOut' } }
                  }}
                  whileHover={{ scale: 1.025, boxShadow: '0 8px 32px 0 rgba(34,197,94,0.10)' }}
                  transition={{ type: 'spring', stiffness: 180, damping: 18 }}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 bg-white/90 text-green-600 text-xs font-medium rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 pb-8">
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {post.date}
                      </span>
                      <span className="text-green-600 font-medium">{post.readTime}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setSelectedPost(post)}
                        className="text-green-600 font-medium text-sm hover:text-green-700 transition-colors"
                      >
                        Read More
                      </button>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center gap-1 transition-colors ${
                            likedPosts.has(post.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                          <span className="text-xs">{post.likes + (likedPosts.has(post.id) ? 1 : 0)}</span>
                        </button>
                        <button
                          onClick={() => handleShare(post)}
                          className="text-gray-400 hover:text-green-600 transition-colors"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Blog Post Modal */}
      {selectedPost && (
        <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" aria-describedby="blog-dialog-desc">
            <div id="blog-dialog-desc" style={{ display: 'none' }}>Read the full blog post and explore more insights.</div>
            <div className="p-6">
              <div className="mb-6">
                <img
                  src={selectedPost.imageUrl}
                  alt={selectedPost.title}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {selectedPost.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {selectedPost.author}
                  </span>
                  <span className="text-green-600 font-medium">{selectedPost.readTime}</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{selectedPost.title}</h1>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    {selectedPost.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        <Tag className="w-3 h-3 inline mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleLike(selectedPost.id)}
                      className={`flex items-center gap-1 transition-colors ${
                        likedPosts.has(selectedPost.id) ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${likedPosts.has(selectedPost.id) ? 'fill-current' : ''}`} />
                      <span className="font-medium">{selectedPost.likes + (likedPosts.has(selectedPost.id) ? 1 : 0)}</span>
                    </button>
                    <button
                      onClick={() => handleShare(selectedPost)}
                      className="flex items-center gap-1 text-gray-500 hover:text-green-600 transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>              </div>
              <div className="prose prose-lg max-w-none blog-content">
                {selectedPost?.content ? (
                  <div className="markdown-content text-gray-800 leading-relaxed">
                    <ReactMarkdown>
                      {selectedPost.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No content available for this blog post.</p>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default BlogSection;
