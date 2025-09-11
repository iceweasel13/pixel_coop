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

type TiledLayer = {
  type: "tilelayer" | string;
  name: string;
  width: number;   // tiles
  height: number;  // tiles
  data?: number[]; // CSV -> number array
  visible?: boolean;
  opacity?: number;
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
    normalized,               // as-is from JSON under public
    "/tilesets/" + base,      // fallback to public/tilesets
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
  mode = "contain",
}: { src: string; mode?: "contain" | "cover" }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let disposed = false;

    (async () => {
      try {
        // 1) Load map JSON
        const resp = await fetch(src);
        if (!resp.ok) throw new Error("Map fetch failed: " + resp.status);
        const map: TiledMap = await resp.json();

        // 2) Load tileset images
        const tilesetImages = new Map<TiledTileset, HTMLImageElement>();
        for (const ts of map.tilesets) {
          const img = await loadImageWithFallbacks(ts.image);
          tilesetImages.set(ts, img);
        }

        // 3) Offscreen render 1:1 pixels
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

              const localId = gid - ts.firstgid; // 0-based
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

        // 4) Draw to screen (fullscreen + nearest-neighbor)
        const cvs = canvasRef.current!;
        const ctx = cvs.getContext("2d")!;

        function drawToScreen() {
          if (!cvs || !ctx) return;
          const viewW = window.innerWidth;
          const viewH = window.innerHeight;
          const dpr = Math.max(1, window.devicePixelRatio || 1);

          // Canvas backing store size
          cvs.width = Math.floor(viewW * dpr);
          cvs.height = Math.floor(viewH * dpr);
          cvs.style.width = viewW + "px";
          cvs.style.height = viewH + "px";

          ctx.imageSmoothingEnabled = false;
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.clearRect(0, 0, cvs.width, cvs.height);

          // Scale + center
          const sx = cvs.width / mapPixelW;
          const sy = cvs.height / mapPixelH;
          let scale = mode === "cover" ? Math.max(sx, sy) : Math.min(sx, sy);

          // Prefer integer scale for pixel art if possible
          const intScale = Math.floor(scale);
          if (intScale >= 1) scale = intScale;

          const drawW = Math.floor(mapPixelW * scale);
          const drawH = Math.floor(mapPixelH * scale);
          const offsetX = Math.floor((cvs.width - drawW) / 2);
          const offsetY = Math.floor((cvs.height - drawH) / 2);

          ctx.drawImage(off, 0, 0, mapPixelW, mapPixelH, offsetX, offsetY, drawW, drawH);
        }

        // Initial draw + resize
        drawToScreen();
        window.addEventListener("resize", drawToScreen);

        if (!disposed) setReady(true);

        return () => {
          window.removeEventListener("resize", drawToScreen);
        };
      } catch (err) {
        console.error(err);
      }
    })();

    return () => {
      disposed = true;
    };
  }, [src, mode]);

  return (
    <canvas
      ref={canvasRef}
      className="block w-screen h-screen"
      style={{
        display: "block",
        width: "100vw",
        height: "100vh",
        imageRendering: "pixelated",
      }}
      aria-label={ready ? "Map canvas" : "Loading map..."}
    />
  );
}

