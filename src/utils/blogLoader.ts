import { BlogPost } from '../types/blog';
import fs from 'fs';
import path from 'path';

// Blog metadata mapping
const blogMetadata: Record<string, Omit<BlogPost, 'content'>> = {
  'chakra-healing-energy-centers': {
    id: "1",
    title: "The Ancient Science of Chakra Healing: Unlocking Your Body's Energy Centers",
    excerpt: "Discover how the ancient practice of chakra healing can transform your physical, emotional, and spiritual well-being through balanced energy flow.",
    author: "Dr. Feq'ad Wolde",
    date: "December 15, 2024",
    category: "Energy Healing",
    tags: ["Chakras", "Energy Healing", "Spiritual Wellness", "Holistic Health"],
  imageUrl: "/images/ali-abdul-rahman-Xva-TYqwHhA-unsplash.webp",
    likes: 1247,
    readTime: "8 min read",
    summary: "Discover how the ancient practice of chakra healing can transform your physical, emotional, and spiritual well-being through balanced energy flow."
  },
  'digital-transformation-human-connection': {
    id: "2",
    title: "Digital Transformation: Beyond Technology to Human Connection",
    excerpt: "Discover how successful digital transformation prioritizes human experience over technical complexity, creating meaningful connections in an increasingly digital world.",
    author: "Marcus Thompson",
    date: "December 12, 2024",
    category: "Digital Strategy",
    tags: ["Digital Transformation", "Business Strategy", "Customer Experience", "Technology"],
  imageUrl: "/images/artiom-vallat-HWkd3r8uqzY-unsplash.webp",
    likes: 1347,
    readTime: "12 min read",
    summary: "Explore how authentic digital transformation focuses on human connection over technical complexity, creating meaningful experiences in our digital age."
  },
  'mindful-leadership-conscious-decision-making': {
    id: "3",
    title: "The Art of Mindful Leadership: Transforming Organizations Through Conscious Decision-Making",
    excerpt: "Discover how mindful leadership practices create more resilient, innovative, and compassionate organizations while driving sustainable business success.",
    author: "Dr. Sarah Chen",
    date: "December 10, 2024",
    category: "Leadership",
    tags: ["Mindful Leadership", "Organizational Culture", "Personal Development", "Business Strategy"],
  imageUrl: "/images/daniel-sinoca-UjXGaJHH2jE-unsplash.webp",
    likes: 1198,
    readTime: "10 min read",
    summary: "Learn how mindful leadership practices transform organizations through conscious decision-making, creating more resilient and innovative workplace cultures."
  },
  'sustainable-living-digital-age': {
    id: "4",
    title: "Sustainable Living in the Digital Age: Creating Harmony Between Technology and Nature",
    excerpt: "Explore how to live sustainably while embracing technology, creating a balanced lifestyle that honors both environmental stewardship and modern convenience.",
    author: "Elena Rodriguez",
    date: "December 8, 2024",
    category: "Sustainability",
    tags: ["Sustainable Living", "Environmental Consciousness", "Green Technology", "Eco-Friendly Lifestyle"],
  imageUrl: "/images/ashley-byrd-uUOQlm3Idv0-unsplash.webp",
    likes: 1089,
    readTime: "9 min read",
    summary: "Learn how to create harmony between technology and environmental stewardship, embracing sustainable living practices in our increasingly digital world."
  },
  'mastering-deep-work-focus-distractions': {
    id: "5",
    title: "Mastering Deep Work: How to Focus in a World of Infinite Distractions",
    excerpt: "Learn the art of sustained concentration and produce high-quality work in our age of constant interruption and digital overwhelm.",
    author: "Cal Newport",
    date: "December 7, 2024",
    category: "Productivity",
    tags: ["Deep Work", "Focus", "Productivity", "Digital Minimalism"],
  imageUrl: "/images/daniel-sinoca-UjXGaJHH2jE-unsplash.webp",
    likes: 1389,
    readTime: "14 min read",
    summary: "Master the art of sustained concentration and produce high-quality work in our age of constant interruption and digital overwhelm."
  },
  'psychology-peak-performance-mental-edge': {
    id: "6",
    title: "The Psychology of Peak Performance: Unlocking Your Mental Edge in High-Pressure Situations",
    excerpt: "Discover the mental strategies and psychological principles that elite performers use to thrive under pressure and consistently achieve excellence.",
    author: "Dr. Michael Harrison",
    date: "December 5, 2024",
    category: "Performance Psychology",
    tags: ["Peak Performance", "Mental Training", "Psychology", "Success Mindset"],
  imageUrl: "/images/anirudh-chavali-JpeV5C_3M3Y-unsplash.webp",
    likes: 1456,
    readTime: "11 min read",
    summary: "Master the mental strategies and psychological principles that elite performers use to consistently achieve excellence under pressure."
  },
  'future-work-remote-teams-digital-collaboration': {
    id: "7",
    title: "The Future of Work: Navigating Remote Teams and Digital Collaboration in 2025",
    excerpt: "Explore the evolving landscape of remote work, digital collaboration tools, and the skills needed to thrive in distributed teams and virtual environments.",
    author: "Alexandra Kim",
    date: "December 3, 2024",
    category: "Future of Work",
    tags: ["Remote Work", "Digital Collaboration", "Team Management", "Workplace Innovation"],
  imageUrl: "/images/angus-gray-qEaELLSYZW0-unsplash.webp",
    likes: 1278,
    readTime: "10 min read",
    summary: "Navigate the evolving landscape of remote work and digital collaboration, mastering the skills needed to thrive in distributed teams and virtual environments."
  },
  'authentic-personal-brands-social-media': {
    id: "8",
    title: "Building Authentic Personal Brands in the Age of Social Media: Beyond the Facade",
    excerpt: "Discover how to create a genuine personal brand that resonates with your values while navigating the complexities of social media authenticity.",
    author: "Jordan Martinez",
    date: "December 1, 2024",
    category: "Personal Branding",
    tags: ["Personal Branding", "Social Media", "Authenticity", "Digital Identity"],
  imageUrl: "/images/ali-abdul-rahman-Xva-TYqwHhA-unsplash.webp",
    likes: 1367,
    readTime: "12 min read",
    summary: "Learn how to build an authentic personal brand that resonates with your values while navigating the complexities of social media and digital identity."
  },
  'science-habit-formation-rewiring-brain': {
    id: "9",
    title: "The Science of Habit Formation: Rewiring Your Brain for Lasting Change",
    excerpt: "Explore the neuroscience behind habit formation and discover evidence-based strategies for creating positive behaviors that stick long-term.",
    author: "Dr. Lisa Chen",
    date: "November 28, 2024",
    category: "Behavioral Science",
    tags: ["Habit Formation", "Neuroscience", "Behavioral Change", "Personal Development"],
  imageUrl: "/images/artiom-vallat-HWkd3r8uqzY-unsplash.webp",
    likes: 1523,
    readTime: "13 min read",
    summary: "Understand the neuroscience behind habit formation and discover evidence-based strategies for creating positive behaviors that stick long-term."
  }
};

// Function to convert markdown content to HTML format
function markdownToHtml(markdown: string): string {
  // Remove metadata section (everything before the first ---)
  const contentStart = markdown.indexOf('---', markdown.indexOf('---') + 3);
  const content = markdown.substring(contentStart + 3).trim();
  
  // Convert paragraphs to HTML
  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);
  return paragraphs.map(p => `<p>${p.trim()}</p>`).join('\n\n      ');
}

// Function to load blog posts from markdown files
function loadBlogPosts(): BlogPost[] {
  const blogPosts: BlogPost[] = [];
  const blogsDir = path.join(process.cwd(), 'src', 'content', 'blogs');
  
  try {
    const files = fs.readdirSync(blogsDir);
    
    for (const file of files) {
      if (file.endsWith('.md')) {
        const slug = file.replace('.md', '');
        const metadata = blogMetadata[slug];
        
        if (metadata) {
          const filePath = path.join(blogsDir, file);
          const markdownContent = fs.readFileSync(filePath, 'utf-8');
          const htmlContent = markdownToHtml(markdownContent);
          
          blogPosts.push({
            ...metadata,
            content: htmlContent
          });
        }
      }
    }
  } catch (error) {
    console.warn('Could not load blog posts from files, falling back to static data:', error);
    // Fallback to static data if file loading fails
    return getBlogPostsFallback();
  }
  
  return blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Fallback function with static blog data
function getBlogPostsFallback(): BlogPost[] {
  return [
    {
      id: "1",
      title: "The Ancient Science of Chakra Healing: Unlocking Your Body's Energy Centers",
      excerpt: "Discover how the ancient practice of chakra healing can transform your physical, emotional, and spiritual well-being through balanced energy flow.",
      author: "Dr. Feq'ad Wolde",
      date: "December 15, 2024",
      category: "Energy Healing",
      tags: ["Chakras", "Energy Healing", "Spiritual Wellness", "Holistic Health"],
  imageUrl: "/images/ali-abdul-rahman-Xva-TYqwHhA-unsplash.webp",
      likes: 1247,
      readTime: "8 min read",
      content: `<p>In the fast-paced world we live in today, many people are seeking deeper meaning and connection to their inner selves...</p>`,
      summary: "Discover how the ancient practice of chakra healing can transform your physical, emotional, and spiritual well-being through balanced energy flow."
    },
    // Add other fallback posts here...
  ];
}

// Export the blog posts
export const blogPosts: BlogPost[] = loadBlogPosts();
