import React from "react";

type NineSlicePanelProps = {
  children: React.ReactNode;
  className?: string;
  // Kenar/köşe dilim kalınlığı (px). Görsellere göre ayarlayın.
  slice?: number;
};

// 9-parça panel: köşeler, kenarlar (tekrarlı), orta (tekrarlı)
// Görsel yolları: public/b/*.png
export function NineSlicePanel({ children, className, slice = 64 }: NineSlicePanelProps) {
  return (
    <div className={"relative " + (className ?? "")}>
      {/* Orta doku */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: slice / 2,
          left: slice / 2,
          right: slice / 2,
          bottom: slice / 2,
          backgroundImage: "url(/b/orta_b.png)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
        }}
      />

      {/* Üst kenar */}
      <div
        className="absolute top-0 pointer-events-none"
        style={{
          left: slice,
          right: slice,
          height: slice,
          backgroundImage: "url(/b/ust_b.png)",
          backgroundRepeat: "repeat-x",
          backgroundSize: `auto ${slice}px`,
          backgroundPosition: "top",
        }}
      />

      {/* Alt kenar */}
      <div
        className="absolute bottom-0 pointer-events-none"
        style={{
          left: slice,
          right: slice,
          height: slice,
          backgroundImage: "url(/b/alt_b.png)",
          backgroundRepeat: "repeat-x",
          backgroundSize: `auto ${slice}px`,
          backgroundPosition: "bottom",
        }}
      />

      {/* Sol kenar */}
      <div
        className="absolute left-0 pointer-events-none"
        style={{
          top: slice,
          bottom: slice,
          width: slice,
          backgroundImage: "url(/b/sol_b.png)",
          backgroundRepeat: "repeat-y",
          backgroundSize: `${slice}px auto`,
          backgroundPosition: "left",
        }}
      />

      {/* Sağ kenar */}
      <div
        className="absolute right-0 pointer-events-none"
        style={{
          top: slice,
          bottom: slice,
          width: slice,
          backgroundImage: "url(/b/sag_b.png)",
          backgroundRepeat: "repeat-y",
          backgroundSize: `${slice}px auto`,
          backgroundPosition: "right",
        }}
      />

      {/* Köşeler */}
      <div
        className="absolute top-0 left-0 pointer-events-none"
        style={{
          width: slice,
          height: slice,
          backgroundImage: "url(/b/sol_ust_b.png)",
          backgroundRepeat: "no-repeat",
          backgroundSize: `${slice}px ${slice}px`,
        }}
      />
      <div
        className="absolute top-0 right-0 pointer-events-none"
        style={{
          width: slice,
          height: slice,
          backgroundImage: "url(/b/sag_ust_b.png)",
          backgroundRepeat: "no-repeat",
          backgroundSize: `${slice}px ${slice}px`,
        }}
      />
      <div
        className="absolute bottom-0 left-0 pointer-events-none"
        style={{
          width: slice,
          height: slice,
          backgroundImage: "url(/b/sol_alt_b.png)",
          backgroundRepeat: "no-repeat",
          backgroundSize: `${slice}px ${slice}px`,
        }}
      />
      <div
        className="absolute bottom-0 right-0 pointer-events-none"
        style={{
          width: slice,
          height: slice,
          backgroundImage: "url(/b/sag_alt_b.png)",
          backgroundRepeat: "no-repeat",
          backgroundSize: `${slice}px ${slice}px`,
        }}
      />

      {/* İçerik: çerçeveden içe doğru padding */}
      <div style={{ padding: slice }} className="relative">
        {children}
      </div>
    </div>
  );
}

export default NineSlicePanel;

