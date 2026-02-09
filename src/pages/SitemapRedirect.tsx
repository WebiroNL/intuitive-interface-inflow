import { useEffect } from 'react';

export function SitemapRedirect() {
  useEffect(() => {
    // Redirect to server-side sitemap with proper XML Content-Type
    const serverUrl = 'https://epostamzxunjjrjjnotj.supabase.co/functions/v1/sitemap';
    window.location.replace(serverUrl);
  }, []);

  return (
    <div className="flex justify-center items-center h-screen font-sans text-foreground bg-background">
      <div className="text-center">
        <h1 className="text-2xl mb-4">Redirecting to sitemap.xml...</h1>
        <p className="text-muted-foreground">
          If you are not redirected, please wait...
        </p>
      </div>
    </div>
  );
}

export default SitemapRedirect;
