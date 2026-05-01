import { useEffect } from "react";

/**
 * Million Store — Webiro Ads Rapportage April 2026.
 * Rendered as a full-page iframe so the report's standalone CSS does not
 * conflict with the main Webiro Tailwind theme. Source: public/millionstore-rapport.html
 */
const MillionRapport = () => {
  useEffect(() => {
    document.title = "Million Store — Ads Rapportage April 2026 | Webiro";
  }, []);

  return (
    <iframe
      src="/millionstore-rapport.html"
      title="Million Store Rapportage April 2026"
      className="fixed inset-0 w-screen h-screen border-0 bg-white"
    />
  );
};

export default MillionRapport;
