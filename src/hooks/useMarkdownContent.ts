import { useState, useEffect } from 'react';
import { marked } from 'marked';

export const useMarkdownContent = (filename: string | null) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!filename) {
      setContent('');
      return;
    }    const loadMarkdown = async () => {
      setLoading(true);
      setError(null);
      
      console.log('Loading markdown file:', filename);
      
      try {
        // Fetch the markdown file from the public directory
        const response = await fetch(`/content/blogs/${filename}`);
        
        console.log('Fetch response:', response.status, response.statusText);
        
        if (!response.ok) {
          throw new Error(`Failed to load blog content: ${response.statusText}`);
        }
        
        const markdownText = await response.text();
        console.log('Markdown text length:', markdownText.length);
        console.log('First 200 chars:', markdownText.substring(0, 200));
        
        // Configure marked options for better parsing
        marked.setOptions({
          breaks: true,
          gfm: true,
        });
        
        // Parse markdown to HTML
        const htmlContent = await marked(markdownText);
        console.log('HTML content length:', htmlContent.length);
        console.log('First 200 chars of HTML:', htmlContent.substring(0, 200));
        setContent(htmlContent);
        
      } catch (err) {
        console.error('Error loading markdown:', err);
        setError(err instanceof Error ? err.message : 'Failed to load content');
        
        // Fallback content
        setContent(`
          <div style="text-align: center; padding: 2rem; color: #666;">
            <h3>Content Loading Error</h3>
            <p>We're having trouble loading this blog post. Please try again later.</p>
            <p style="font-size: 0.9rem; margin-top: 1rem;">
              <em>If this problem persists, please contact support.</em>
            </p>
          </div>
        `);
      } finally {
        setLoading(false);
      }
    };

    loadMarkdown();
  }, [filename]);

  return { content, loading, error };
};
