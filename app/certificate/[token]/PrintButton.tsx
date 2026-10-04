"use client";

export default function PrintButton() {
  return (
    <button onClick={() => window.print()} className="no-print btn-shimmer px-6 py-3 rounded-xl text-white text-sm font-medium">
      Download / Print as PDF
    </button>
  );
}
