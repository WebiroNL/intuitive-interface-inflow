import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

export function Documentatie() {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load the markdown file
    fetch('/WEBIRO-VOLLEDIGE-DOCUMENTATIE.md')
      .then(res => res.text())
      .then(text => {
        setContent(text);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading documentation:', err);
        setContent('Documentatie kon niet worden geladen.');
        setLoading(false);
      });
  }, []);

  const downloadMarkdown = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'WEBIRO-VOLLEDIGE-DOCUMENTATIE.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-secondary border-t-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground">Laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="bg-card rounded-2xl shadow-xl p-8 md:p-12">
          {/* Header */}
          <div className="mb-8 pb-6 border-b border-border">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              📘 Webiro - Volledige Documentatie
            </h1>
            <p className="text-muted-foreground mb-6">
              Complete website documentatie voor migratie naar Lovable
            </p>
            <button
              onClick={downloadMarkdown}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              <Download className="w-5 h-5" />
              Download als .md bestand
            </button>
          </div>

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <pre className="whitespace-pre-wrap font-mono text-sm bg-secondary p-6 rounded-lg overflow-x-auto">
              {content}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Documentatie;
