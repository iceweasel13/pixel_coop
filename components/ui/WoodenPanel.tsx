import React from "react";

type WoodenPanelProps = {
  children: React.ReactNode;
  className?: string;
  // Kenar/köşe dilim kalınlığı (px). Görsellere göre ayarlayın.
  slice?: number;
};

// 9-parça panel: köşeler, kenarlar (tekrarlı), orta (tekrarlı)
// Görsel yolları: public/wooden_panel/*.png
export function WoodenPanel({ children, className, slice = 64 }: WoodenPanelProps) {
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
          backgroundImage: "url(/wooden_panel/wooden_panel_mid.png)",
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
          backgroundImage: "url(/wooden_panel/wooden_panel_top.png)",
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
          backgroundImage: "url(/wooden_panel/wooden_panel_bottom.png)",
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
          backgroundImage: "url(/wooden_panel/wooden_panel_left.png)",
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
          backgroundImage: "url(/wooden_panel/wooden_panel_right.png)",
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
          backgroundImage: "url(/wooden_panel/wooden_panel_top_left.png)",
          backgroundRepeat: "no-repeat",
          backgroundSize: `${slice}px ${slice}px`,
        }}
      />
      <div
        className="absolute top-0 right-0 pointer-events-none"
        style={{
          width: slice,
          height: slice,
          backgroundImage: "url(/wooden_panel/wooden_panel_top_right.png)",
          backgroundRepeat: "no-repeat",
          backgroundSize: `${slice}px ${slice}px`,
        }}
      />
      <div
        className="absolute bottom-0 left-0 pointer-events-none"
        style={{
          width: slice,
          height: slice,
          backgroundImage: "url(/wooden_panel/wooden_panel_bottom_left.png)",
          backgroundRepeat: "no-repeat",
          backgroundSize: `${slice}px ${slice}px`,
        }}
      />
      <div
        className="absolute bottom-0 right-0 pointer-events-none"
        style={{
          width: slice,
          height: slice,
          backgroundImage: "url(/wooden_panel/wooden_panel_bottom_right.png)",
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

export default WoodenPanel;

