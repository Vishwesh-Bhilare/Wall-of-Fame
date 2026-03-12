"use client";

type Props = {
  url?: string | null;
  compact?: boolean;
};

function getFileExtension(url: string) {
  const clean = url.split("?")[0].toLowerCase();
  return clean.split(".").pop() || "";
}

export default function MediaPreview({ url, compact = false }: Props) {
  if (!url) return null;

  const ext = getFileExtension(url);
  const isPdf = ext === "pdf";
  const isImage = ["png", "jpg", "jpeg", "gif", "webp"].includes(ext);

  if (!isPdf && !isImage) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex w-fit rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
      >
        Open proof
      </a>
    );
  }

  return (
    <div className={compact ? "mt-3" : "mt-4"}>
      {isImage ? (
        <a href={url} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-lg border border-red-100">
          <img src={url} alt="Achievement proof" className={compact ? "h-28 w-full object-cover" : "max-h-[420px] w-full object-contain bg-gray-50"} />
        </a>
      ) : (
        <div className="overflow-hidden rounded-lg border border-red-100">
          <iframe title="PDF proof preview" src={url} className={compact ? "h-40 w-full" : "h-[500px] w-full"} />
        </div>
      )}

      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="mt-2 inline-flex w-fit rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
      >
        Open proof in new tab
      </a>
    </div>
  );
}
