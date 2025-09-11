"use client";

import React, { useEffect, useRef, useState } from "react";

type TiledTileset = {
  firstgid: number;
  name: string;
  image: string;
  imagewidth: number;
  imageheight: number;
  tilewidth: number;
  tileheight: number;
  columns: number;
  margin?: number;
  spacing?: number;
};

type TiledProperty = { name: string; type?: string; value: any };
type TiledObject = {
  id: number;
  name?: string;
  type?: string;
  x: number; // map px
  y: number; // map px (bottom for rects)
  width?: number;
  height?: number;
  rotation?: number;
  visible?: boolean;
  properties?: TiledProperty[];
};

type TiledLayer = {
  type: "tilelayer" | "objectgroup" | string;
  name: string;
  width: number;   // tiles
  height: number;  // tiles
  data?: number[]; // CSV -> number array
  visible?: boolean;
  opacity?: number;
  objects?: TiledObject[];
};

type TiledMap = {
  width: number;        // tiles
  height: number;       // tiles
  tilewidth: number;    // px
  tileheight: number;   // px
  tilesets: TiledTileset[];
  layers: TiledLayer[];
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });
}

async function loadImageWithFallbacks(rawPath: string): Promise<HTMLImageElement> {
  const normalized = "/" + rawPath.replace(/^\.?\//, "").replace(/\\/g, "/");
  const base = normalized.split("/").pop()!;
  const candidates = [
    normalized,
    "/tilesets/" + base,
  ];
  let lastError: unknown = undefined;
  for (const c of candidates) {
    try {
      return await loadImage(c);
    } catch (e) {
      lastError = e;
    }
  }
  throw new Error("Failed to load tileset image. Tried: " + candidates.join(", "));
}

function findTilesetForGid(tilesets: TiledTileset[], gid: number) {
  if (gid === 0) return null;
  let chosen: TiledTileset | null = null;
  for (const ts of tilesets) {
    if (gid >= ts.firstgid) {
      if (!chosen || ts.firstgid > chosen.firstgid) chosen = ts;
    }
  }
  return chosen;
}

export default function TiledMap({
  src,
  mode = "contain",                       // "contain" | "cover" | "manual"
  viewportPercent,                        // örn: 200 => ekran genişliğinin %200’ü
  basis = "width",                        // yüzdelik hangi eksene göre? "width" | "height"
  pixelScale,                             // örn: 2 => 2x piksel-art ölçek
  alignX = "center",                      // "left" | "center" | "right"
  alignY = "center",                      // "top" | "center" | "bottom"
  snapIntegerScale = true,                // piksel-art için tam sayı ölçek
}: {
  src: string;
  mode?: "contain" | "cover" | "manual";
  viewportPercent?: number;
  basis?: "width" | "height";
  pixelScale?: number;
  alignX?: "left" | "center" | "right";
  alignY?: "top" | "center" | "bottom";
  snapIntegerScale?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ready, setReady] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);

  // Kamera (harita piksel uzayında)
  const camXRef = useRef(0);
  const camYRef = useRef(0);
  const hasInitCentered = useRef(false);

  // Hotspots ve DPI
  const hotspotsRef = useRef<Array<{ x: number; y: number; w: number; h: number; message?: string }>>([]);
  const dprRef = useRef(1);

  // Pan (pointer)
  const isPointerDown = useRef(false);
  const isDragging = useRef(false);
  const lastPointerX = useRef(0);
  const lastPointerY = useRef(0);
  const downX = useRef(0);
  const downY = useRef(0);

  useEffect(() => {
    let disposed = false;

    (async () => {
      try {
        // 1) Haritayı yükle
        const resp = await fetch(src);
        if (!resp.ok) throw new Error("Map fetch failed: " + resp.status);
        const map: TiledMap = await resp.json();

        // 2) Tileset görselleri
        const tilesetImages = new Map<TiledTileset, HTMLImageElement>();
        for (const ts of map.tilesets) {
          const img = await loadImageWithFallbacks(ts.image);
          tilesetImages.set(ts, img);
        }

        // 3) Offscreen (1:1)
        const mapPixelW = map.width * map.tilewidth;
        const mapPixelH = map.height * map.tileheight;
        const off = document.createElement("canvas");
        off.width = mapPixelW;
        off.height = mapPixelH;
        const offCtx = off.getContext("2d")!;
        offCtx.imageSmoothingEnabled = false;

        for (const layer of map.layers) {
          if (layer.type !== "tilelayer") continue;
          if (layer.visible === false) continue;
          if (!layer.data) continue;

          const alpha = layer.opacity ?? 1;
          if (alpha <= 0) continue;
          offCtx.globalAlpha = alpha;

          for (let ty = 0; ty < layer.height; ty++) {
            for (let tx = 0; tx < layer.width; tx++) {
              const idx = ty * layer.width + tx;
              const gid = layer.data[idx] ?? 0;
              if (gid === 0) continue;

              const ts = findTilesetForGid(map.tilesets, gid);
              if (!ts) continue;
              const img = tilesetImages.get(ts)!;

              const localId = gid - ts.firstgid;
              const cols = ts.columns;
              const sx = (localId % cols) * ts.tilewidth;
              const sy = Math.floor(localId / cols) * ts.tileheight;

              const dx = tx * map.tilewidth;
              const dy = ty * map.tileheight;

              offCtx.drawImage(
                img,
                sx, sy, ts.tilewidth, ts.tileheight,
                dx, dy, map.tilewidth, map.tileheight
              );
            }
          }
        }

        // 4) Ekrana çizim (kamera/viewport)
        const cvs = canvasRef.current!;
        const ctx = cvs.getContext("2d")!;

        // Ölçek -> "screenScale": 1 harita pikseli kaç device-pixel oluyor?
        function computeScreenScale(): number {
          const viewW = window.innerWidth;
          const viewH = window.innerHeight;
          const dpr = Math.max(1, window.devicePixelRatio || 1);
          dprRef.current = dpr;

          // backing store
          cvs.width = Math.floor(viewW * dpr);
          cvs.height = Math.floor(viewH * dpr);
          cvs.style.width = viewW + "px";
          cvs.style.height = viewH + "px";

          let scale: number;

          if (mode === "manual") {
            if (typeof pixelScale === "number" && pixelScale > 0) {
              // piksel-art sabit ölçek
              scale = pixelScale * dpr;
            } else if (typeof viewportPercent === "number" && viewportPercent > 0) {
              const pct = viewportPercent / 100;
              if (basis === "height") {
                const targetH = Math.floor(cvs.height * pct); // device px
                scale = targetH / mapPixelH;                  // device px / map px
              } else {
                const targetW = Math.floor(cvs.width * pct);
                scale = targetW / mapPixelW;
              }
            } else {
              // fallback: contain
              const sx = cvs.width / mapPixelW;
              const sy = cvs.height / mapPixelH;
              scale = Math.min(sx, sy);
            }
          } else {
            // otomatik: contain/cover
            const sx = cvs.width / mapPixelW;
            const sy = cvs.height / mapPixelH;
            scale = mode === "cover" ? Math.max(sx, sy) : Math.min(sx, sy);
          }

          if (snapIntegerScale && scale >= 1) {
            scale = Math.floor(scale);
          }

          scale = Math.max(0.0001, scale) * zoomScale;

          return Math.max(0.0001, scale);
        }

        let screenScale = computeScreenScale();

        // İlk açılışta kamerayı haritanın ortasına al
        if (!hasInitCentered.current) {
          const viewSrcW = Math.floor(cvs.width / screenScale);
          const viewSrcH = Math.floor(cvs.height / screenScale);
          camXRef.current = Math.max(0, Math.floor((mapPixelW - viewSrcW) / 2));
          camYRef.current = Math.max(0, Math.floor((mapPixelH - viewSrcH) / 2));
          hasInitCentered.current = true;
        }

        // Hotspot'ları topla (object layers)
        hotspotsRef.current = [];
        for (const layer of map.layers) {
          if (layer.type !== "objectgroup") continue;
          if (layer.visible === false) continue;
          if (!layer.objects) continue;
          for (const obj of layer.objects) {
            if (obj.visible === false) continue;
            const w = Math.max(0, Math.floor(obj.width || 0));
            const h = Math.max(0, Math.floor(obj.height || 0));
            const x = Math.floor(obj.x);
            const y = Math.floor((obj.y || 0) - h); // Tiled rect y is bottom
            const msgProp = obj.properties?.find((p) => p.name === "message")?.value as string | undefined;
            const message = msgProp || obj.name || "";
            if (w > 0 && h > 0) {
              hotspotsRef.current.push({ x, y, w, h, message });
            }
          }
        }
        // Manuel ev hotspot'u (1-based): X 56..58, Y 31..34
        try {
          const minTx = 56, maxTx = 58;
          const minTy = 31, maxTy = 34;
          const x = (minTx - 1) * map.tilewidth;
          const y = (minTy - 1) * map.tileheight;
          const w = (maxTx - minTx + 1) * map.tilewidth;
          const h = (maxTy - minTy + 1) * map.tileheight;
          if (w > 0 && h > 0) {
            hotspotsRef.current.push({ x, y, w, h, message: "Eve hoş geldin!" });
          }
        } catch {}

        function clampCamera() {
          // Ekranda görünen kaynak dikdörtgenin boyutu (harita piksel uzayı)
          const srcW = Math.floor(cvs.width / screenScale);
          const srcH = Math.floor(cvs.height / screenScale);

          const maxX = Math.max(0, mapPixelW - srcW);
          const maxY = Math.max(0, mapPixelH - srcH);

          camXRef.current = Math.min(Math.max(0, camXRef.current), maxX);
          camYRef.current = Math.min(Math.max(0, camYRef.current), maxY);
        }

        function draw() {
          ctx.imageSmoothingEnabled = false;
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.clearRect(0, 0, cvs.width, cvs.height);

          const srcW = Math.floor(cvs.width / screenScale);
          const srcH = Math.floor(cvs.height / screenScale);

          clampCamera();

          const sx = Math.floor(camXRef.current);
          const sy = Math.floor(camYRef.current);
          const sw = Math.min(srcW, mapPixelW - sx);
          const sh = Math.min(srcH, mapPixelH - sy);

          // Ekranda nereye çizileceği (tam ekran)
          const dx = 0, dy = 0, dw = cvs.width, dh = cvs.height;

          ctx.drawImage(off, sx, sy, sw, sh, dx, dy, dw, dh);
        }

        // İlk çizim
        draw();
        if (!disposed) setReady(true);

        // Resize -> scale ve çizimi güncelle
        function onResize() {
          screenScale = computeScreenScale();
          clampCamera();
          draw();
        }
        window.addEventListener("resize", onResize);

        // Pointer pan + click
        function onPointerDown(e: PointerEvent) {
          isPointerDown.current = true;
          isDragging.current = false;
          lastPointerX.current = e.clientX;
          lastPointerY.current = e.clientY;
          downX.current = e.clientX;
          downY.current = e.clientY;
          (e.target as Element).setPointerCapture?.(e.pointerId);
        }
        function onPointerMove(e: PointerEvent) {
          const rect = cvs.getBoundingClientRect();
          const cssX = e.clientX - rect.left;
          const cssY = e.clientY - rect.top;
          const deviceX = cssX * dprRef.current;
          const deviceY = cssY * dprRef.current;

          if (!isPointerDown.current) {
            // Hover feedback over hotspots
            const mapX = camXRef.current + deviceX / screenScale;
            const mapY = camYRef.current + deviceY / screenScale;
            const over = hotspotsRef.current.some((hs) => mapX >= hs.x && mapX <= hs.x + hs.w && mapY >= hs.y && mapY <= hs.y + hs.h);
            cvs.style.cursor = over ? "pointer" : "grab";
            return;
          }

          // If pointer moved beyond threshold, start dragging
          const dragDx = e.clientX - downX.current;
          const dragDy = e.clientY - downY.current;
          const dragDist2 = dragDx * dragDx + dragDy * dragDy;
          const DRAG_THRESHOLD_PX2 = 4 * 4; // 4px
          if (!isDragging.current && dragDist2 > DRAG_THRESHOLD_PX2) {
            isDragging.current = true;
          }

          if (!isDragging.current) {
            const mapX = camXRef.current + deviceX / screenScale;
            const mapY = camYRef.current + deviceY / screenScale;
            const over = hotspotsRef.current.some((hs) => mapX >= hs.x && mapX <= hs.x + hs.w && mapY >= hs.y && mapY <= hs.y + hs.h);
            cvs.style.cursor = over ? "pointer" : "grab";
            return;
          }

          const dxCss = e.clientX - lastPointerX.current;   // CSS px
          const dyCss = e.clientY - lastPointerY.current;   // CSS px
          const dx = dxCss * dprRef.current; // device px
          const dy = dyCss * dprRef.current; // device px
          lastPointerX.current = e.clientX;
          lastPointerY.current = e.clientY;

          // Ekrandaki 1 harita pikseli screenScale device px olduğundan,
          // device delta / screenScale = harita piksel delta
          camXRef.current -= dx / screenScale;
          camYRef.current -= dy / screenScale;
          clampCamera();
          draw();
        }
        function onPointerUp(e: PointerEvent) {
          const wasDragging = isDragging.current;
          isPointerDown.current = false;
          isDragging.current = false;
          (e.target as Element).releasePointerCapture?.(e.pointerId);

          // Treat as click if not dragged meaningfully
          const rect2 = cvs.getBoundingClientRect();
          const cssX2 = e.clientX - rect2.left;
          const cssY2 = e.clientY - rect2.top;
          const clickX = cssX2 * dprRef.current; // device px
          const clickY = cssY2 * dprRef.current; // device px
          // Map px under pointer
          const mapX = camXRef.current + clickX / screenScale;
          const mapY = camYRef.current + clickY / screenScale;

          if (!wasDragging) {
            for (const hs of hotspotsRef.current) {
              if (mapX >= hs.x && mapX <= hs.x + hs.w && mapY >= hs.y && mapY <= hs.y + hs.h) {
                alert(hs.message || "Etkin nokta");
                break;
              }
            }
          }
        }

        // Klavye (ok/WASD) ile pan
        function onKeyDown(e: KeyboardEvent) {
          const stepMapPx = Math.max(8, Math.floor(64 / screenScale)); // ölçeğe göre adım
          if (["ArrowLeft", "a", "A"].includes(e.key)) { camXRef.current -= stepMapPx; }
          if (["ArrowRight", "d", "D"].includes(e.key)) { camXRef.current += stepMapPx; }
          if (["ArrowUp", "w", "W"].includes(e.key)) { camYRef.current -= stepMapPx; }
          if (["ArrowDown", "s", "S"].includes(e.key)) { camYRef.current += stepMapPx; }
          clampCamera();
          draw();
        }

        // Eventler
        cvs.addEventListener("pointerdown", onPointerDown, { passive: true });
        window.addEventListener("pointermove", onPointerMove, { passive: true });
        window.addEventListener("pointerup", onPointerUp, { passive: true });
        window.addEventListener("keydown", onKeyDown);

        return () => {
          window.removeEventListener("resize", onResize);
          cvs.removeEventListener("pointerdown", onPointerDown);
          window.removeEventListener("pointermove", onPointerMove);
          window.removeEventListener("pointerup", onPointerUp);
          window.removeEventListener("keydown", onKeyDown);
        };
      } catch (e) {
        console.error(e);
      }
    })();

    return () => { disposed = true; };
  }, [src, mode, viewportPercent, basis, pixelScale, alignX, alignY, snapIntegerScale, zoomScale]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        className="block w-screen h-screen"
        style={{
          display: "block",
          width: "100vw",
          height: "100vh",
          imageRendering: "pixelated",
          // mobilde sayfa kaymasını engellemek ve panning'in akıcı olması için:
          touchAction: "none",
          cursor: "grab",
        }}
        onPointerDown={(e) => {
          (e.currentTarget.style.cursor = "grabbing");
        }}
        onPointerUp={(e) => {
          (e.currentTarget.style.cursor = "grab");
        }}
        aria-label={ready ? "Map canvas" : "Loading map..."}
      />
      <div
        style={{
          position: "fixed",
          bottom: "1rem",
          right: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          zIndex: 1000,
          pointerEvents: "auto",
        }}
      >
        <button
          onClick={() => setZoomScale((z) => Math.min(z * 1.25, 8))}
          className="cursor-pointer select-none rounded-md border border-black/10 bg-white/80 px-3 py-2 text-xl shadow-sm backdrop-blur hover:bg-white active:scale-95 transition"
          style={{ padding: "0.5rem 0.75rem", fontSize: "1.25rem" }}
        >
          +
        </button>
        <button
          onClick={() => setZoomScale((z) => Math.max(z / 1.25, 0.25))}
          className="cursor-pointer select-none rounded-md border border-black/10 bg-white/80 px-3 py-2 text-xl shadow-sm backdrop-blur hover:bg-white active:scale-95 transition"
          style={{ padding: "0.5rem 0.75rem", fontSize: "1.25rem" }}
        >
          -
        </button>
      </div>
    </div>
  );
}

