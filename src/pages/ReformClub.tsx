export function ReformClub() {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      <iframe
        src="https://reformclub.lovable.app"
        className="w-full h-full border-0"
        title="Reform Club"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

export default ReformClub;
