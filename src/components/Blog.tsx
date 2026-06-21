import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card as _Card, CardContent as _CardContent, CardDescription as _CardDescription, CardFooter as _CardFooter, CardHeader as _CardHeader, CardTitle as _CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { format, parseISO } from 'date-fns';
import type { BlogPost } from '../types/blog';
import { blogPosts } from '../data/blogPosts';
import SEO from './SEO';
import OptimizedImage from './ui/OptimizedImage';
import "../styles/mbg-aesthetics.css";

interface SEOProps {
  title: string;
  description: string;
  image: string;
  url: string;
  type: string;
  schemaType: "Organization" | "BlogPosting" | "Service" | "WebPage";
  schemaData?: {
    '@type': string;
    [key: string]: unknown;
  };
}

interface BlogProps {
  onReadMore?: (post: BlogPost) => void;
  selectedPost?: BlogPost | null;
  setSelectedPost?: (post: BlogPost | null) => void;
  showAll?: boolean;
}

// Removed internal OptimizedImage implementation in favor of imported component

export default function Blog({ onReadMore, selectedPost, setSelectedPost, showAll = false }: BlogProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [likes, setLikes] = useState<{ [id: string]: number }>({});
  const [currentPage, setCurrentPage] = useState(1);

  const POSTS_PER_PAGE = 6;
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setPosts(blogPosts);
      } catch (error) {
        console.error('Error loading blog posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    const tags = new Set<string>();
    posts.forEach(post => {
      post.tags.forEach(tag => tags.add(tag));
    });
    setAllTags(Array.from(tags));
  }, [posts]);

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag === selectedTag ? null : tag);
    setCurrentPage(1);
  };

  const handleLike = (id: string) => {
    setLikes(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handleBackToList = () => {
    if (setSelectedPost) {
      setSelectedPost(null);
    }
  };

  const filteredPosts = selectedTag
    ? posts.filter(post => post.tags.includes(selectedTag))
    : posts;

  const paginatedPosts = showAll
    ? filteredPosts
    : filteredPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  const _totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

  const blogSEO: SEOProps = {
    title: selectedPost ? selectedPost.title : 'Insights | Portals of Samadhi',
    description: selectedPost 
      ? selectedPost.excerpt || selectedPost.content.slice(0, 160)
      : 'Insights on holistic healing, wellness practices, and transformative experiences from Portals of Samadhi.',
    image: selectedPost?.imageUrl || '/poslogo.webp',
    url: `/blog${selectedPost ? `/${selectedPost.id}` : ''}`,
    type: 'article',
    schemaType: "BlogPosting",
    schemaData: selectedPost ? {
      '@type': 'BlogPosting',
      headline: selectedPost.title,
      image: selectedPost.imageUrl,
      datePublished: selectedPost.date,
      dateModified: selectedPost.date,
      author: {
        '@type': 'Person',
        name: selectedPost.author
      }
    } : undefined
  };  return (
    <>
      <SEO {...blogSEO} />      <section className="mbg-section-padding mbg-bg-white" style={{ paddingTop: '8rem' }}>
        <div className="mbg-container scroll-stagger" style={{ paddingTop: '4rem' }}>
          {/* Green Keyword Title */}
          <div className="mbg-keyword-title scroll-fade-in" style={{ marginTop: '-6rem', fontSize: '1.5rem' }}>Blog</div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-600"></div>
            </div>
          ) : (
            <>
              {selectedPost ? (
                <div className="max-w-4xl mx-auto">
                  <button 
                    onClick={handleBackToList} 
                    className="mbg-button-outline mb-8"
                  >
                    ← Back to Blog
                  </button>
                  <article className="mbg-card">
                    {selectedPost.imageUrl && (
                      <OptimizedImage
                        src={selectedPost.imageUrl}
                        alt={selectedPost.title}
                        className="w-full h-64 object-cover mb-6 rounded-lg"
                      />
                    )}
                    <h1 className="mbg-section-title mb-4">{selectedPost.title}</h1>
                    <div className="mbg-small-text mb-6 text-gray-600">
                      {selectedPost.date && format(parseISO(selectedPost.date), 'MMMM d, yyyy')} • {selectedPost.author}
                    </div>
                    <div className="prose max-w-none">
                      {selectedPost.content.split('\n\n').map((paragraph, index) => (
                        <p key={index} className="mbg-body-text mb-4">{paragraph}</p>
                      ))}
                    </div>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {selectedPost.tags.map(tag => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => {
                            handleTagClick(tag);
                            handleBackToList();
                          }}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </article>
                </div>
              ) : (                <>
                  <div className="mb-8 scroll-slide-left">
                    <h2 className="mbg-subtitle mb-4">Browse by Topic</h2>
                    <div className="flex flex-wrap gap-2">
                      {allTags.map(tag => (
                        <Badge 
                          key={tag} 
                          variant={selectedTag === tag ? "default" : "outline"}
                          className="cursor-pointer" 
                          onClick={() => handleTagClick(tag)}
                        >
                          {tag}                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 scroll-stagger">                    {paginatedPosts.map(post => (
                      <div 
                        key={post.id}
                        className="mbg-card-hover cursor-pointer scroll-scale"
                        onClick={() => {
                          if (setSelectedPost) setSelectedPost(post);
                          else if (onReadMore) onReadMore(post);
                        }}
                      >
                        {post.imageUrl && (
                          <div className="relative overflow-hidden mb-5 rounded-lg">
                            <OptimizedImage
                              src={post.imageUrl}
                              alt={post.title}
                              className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {post.date && (
                              <div className="absolute bottom-0 left-0 px-4 py-2 bg-black bg-opacity-50 text-white">
                                <p className="mbg-small-caps">
                                  {format(parseISO(post.date), 'MMM d, yyyy')}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                        <div className="space-y-4 p-4">
                          <div>
                            <h3 className="mbg-card-title mb-2">
                              {post.title}
                            </h3>
                            <p className="mbg-body-text line-clamp-3 mb-4">
                              {post.excerpt || post.content}
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <Button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLike(post.id!)
                              }} 
                              variant="ghost" 
                              size="sm"
                              className="mbg-small-text"
                            >
                              👍 {likes[post.id!] || 0}
                            </Button>
                            <div className="mbg-link-arrow">
                              Read More →
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {post.tags.map(tag => (
                              <Badge 
                                key={tag} 
                                variant="secondary"
                                className="cursor-pointer text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTagClick(tag);
                                }}
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}              {!showAll && posts.length > POSTS_PER_PAGE && (
                <div className="mt-8 flex justify-center gap-2 scroll-fade-in">
                  <button
                    className="mbg-button-outline"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <button
                    className="mbg-button-outline"
                    onClick={() => setCurrentPage(p => p + 1)}
                    disabled={currentPage * POSTS_PER_PAGE >= filteredPosts.length}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
