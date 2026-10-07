import { BlogPost } from '../types/blog';

// Blog metadata and structure - content is stored in individual markdown files
const blogFiles = [
  {
    id: "1",
    title: "The Ancient Science of Chakra Healing: Unlocking Your Body's Energy Centers",
    excerpt: "Discover how the ancient practice of chakra healing can transform your physical, emotional, and spiritual well-being through balanced energy flow.",
  author: "Portals of Samadhi",
    date: "December 15, 2024",
    category: "Energy Healing",    tags: ["Chakras", "Energy Healing", "Spiritual Wellness", "Holistic Health"],
  imageUrl: "/images - Copy/blog/Reiki Wand For Website.webp",
    likes: 1247,
    readTime: "8 min read",
    filename: "chakra-healing-energy-centers.md",
    summary: "Discover how the ancient practice of chakra healing can transform your physical, emotional, and spiritual well-being through balanced energy flow."
  },
  {
    id: "2",
    title: "Digital Transformation: Beyond Technology to Human Connection",
    excerpt: "Discover how successful digital transformation prioritizes human experience over technical complexity, creating meaningful connections in an increasingly digital world.",
  author: "Portals of Samadhi",
    date: "December 12, 2024",
    category: "Digital Strategy",    tags: ["Digital Transformation", "Business Strategy", "Customer Experience", "Technology"],
  imageUrl: "/images - Copy/blog/nick-andreka-A_TK0-yn3q4-unsplash.webp",
    likes: 1347,
    readTime: "12 min read",
    filename: "digital-transformation-human-connection.md",
    summary: "Explore how authentic digital transformation focuses on human connection over technical complexity, creating meaningful experiences in our digital age."
  },
  {
    id: "3",
    title: "The Art of Mindful Leadership: Transforming Organizations Through Conscious Decision-Making",
    excerpt: "Discover how mindful leadership practices create more resilient, innovative, and compassionate organizations while driving sustainable business success.",
  author: "Portals of Samadhi",
    date: "December 10, 2024",
    category: "Leadership",    tags: ["Mindful Leadership", "Organizational Culture", "Personal Development", "Business Strategy"],
  imageUrl: "/images - Copy/blog/documerica-kabsnKYaSKs-unsplash (1).webp",
    likes: 1198,
    readTime: "10 min read",
    filename: "mindful-leadership-conscious-decision-making.md",
    summary: "Learn how mindful leadership practices transform organizations through conscious decision-making, creating more resilient and innovative workplace cultures."
  },
  {
    id: "4",
    title: "Sustainable Living in the Digital Age: Creating Harmony Between Technology and Nature",
    excerpt: "Explore how to live sustainably while embracing technology, creating a balanced lifestyle that honors both environmental stewardship and modern convenience.",
  author: "Portals of Samadhi",
    date: "December 8, 2024",
    category: "Sustainability",
    tags: ["Sustainable Living", "Environmental Consciousness", "Green Technology", "Eco-Friendly Lifestyle"],
    imageUrl: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    likes: 1089,
    readTime: "9 min read",
    filename: "sustainable-living-digital-age.md",
    summary: "Learn how to create harmony between technology and environmental stewardship, embracing sustainable living practices in our increasingly digital world."
  },
  {
    id: "5",
    title: "Mastering Deep Work: How to Focus in a World of Infinite Distractions",
    excerpt: "Learn the art of sustained concentration and produce high-quality work in our age of constant interruption and digital overwhelm.",
  author: "Portals of Samadhi",
    date: "December 7, 2024",
    category: "Productivity",    tags: ["Deep Work", "Focus", "Productivity", "Digital Minimalism"],
  imageUrl: "/images - Copy/blog/szabo-viktor-2K7z8JNOyGU-unsplash.webp",
    likes: 1389,
    readTime: "14 min read",
    filename: "mastering-deep-work-focus-distractions.md",
    summary: "Master the art of sustained concentration and produce high-quality work in our age of constant interruption and digital overwhelm."
  },
  {
    id: "6",
    title: "The Psychology of Peak Performance: Unlocking Your Mental Edge in High-Pressure Situations",
    excerpt: "Discover the mental strategies and psychological principles that elite performers use to thrive under pressure and consistently achieve excellence.",
  author: "Portals of Samadhi",
    date: "December 5, 2024",
    category: "Performance Psychology",
    tags: ["Peak Performance", "Mental Training", "Psychology", "Success Mindset"],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    likes: 1456,
    readTime: "11 min read",
    filename: "psychology-peak-performance-mental-edge.md",
    summary: "Master the mental strategies and psychological principles that elite performers use to consistently achieve excellence under pressure."
  },
  {
    id: "7",
    title: "The Future of Work: Navigating Remote Teams and Digital Collaboration in 2025",
    excerpt: "Explore the evolving landscape of remote work, digital collaboration tools, and the skills needed to thrive in distributed teams and virtual environments.",
  author: "Portals of Samadhi",
    date: "December 3, 2024",
    category: "Future of Work",    tags: ["Remote Work", "Digital Collaboration", "Team Management", "Workplace Innovation"],
  imageUrl: "/images - Copy/blog/remove_watermark_image_20250610_111143.webp",
    likes: 1278,
    readTime: "10 min read",
    filename: "future-work-remote-teams-digital-collaboration.md",
    summary: "Navigate the evolving landscape of remote work and digital collaboration, mastering the skills needed to thrive in distributed teams and virtual environments."
  },
  {
    id: "8",
    title: "Building Authentic Personal Brands in the Age of Social Media: Beyond the Facade",
    excerpt: "Discover how to create a genuine personal brand that resonates with your values while navigating the complexities of social media authenticity.",
  author: "Portals of Samadhi",
    date: "December 1, 2024",
    category: "Personal Branding",
    tags: ["Personal Branding", "Social Media", "Authenticity", "Digital Identity"],
    imageUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2339&q=80",
    likes: 1367,
    readTime: "12 min read",
    filename: "authentic-personal-brands-social-media.md",    summary: "Learn how to build an authentic personal brand that resonates with your values while navigating the complexities of social media and digital identity."
  },
  {
    id: "9",
    title: "The Science of Habit Formation: Rewiring Your Brain for Lasting Change",
    excerpt: "Explore the neuroscience behind habit formation and discover evidence-based strategies for creating positive behaviors that stick long-term.",
  author: "Portals of Samadhi",
    date: "November 28, 2024",
    category: "Behavioral Science",
    tags: ["Habit Formation", "Neuroscience", "Behavioral Change", "Personal Development"],
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2331&q=80",
    likes: 1523,
    readTime: "13 min read",
    filename: "science-habit-formation-rewiring-brain.md",
    summary: "Understand the neuroscience behind habit formation and discover evidence-based strategies for creating positive behaviors that stick long-term."
  }
];

// Create blog posts with content that references the markdown files
// Vite: Import all markdown files as raw strings at build time
const markdownFiles = import.meta.glob('../content/blogs/*.md', { query: '?raw', import: 'default', eager: true });

export const blogPosts: BlogPost[] = blogFiles.map(blog => {
  // Find the matching markdown file by filename
  const mdPath = Object.keys(markdownFiles).find(
    key => key.endsWith('/' + blog.filename)
  );
  const content = mdPath ? markdownFiles[mdPath] as string : 'Content not found.';
  return {
    ...blog,
    content,
  };
});