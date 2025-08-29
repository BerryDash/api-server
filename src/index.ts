import path from "path";
import { createCanvas, loadImage } from "canvas";
import "dotenv/config";

Bun.serve({
  port: process.env.PORT,
  routes: {
    "/icon": {
      async GET(req: Bun.BunRequest) {
        const url = new URL(req.url)
        const urlparams = url.searchParams;
        let r: null | string | number = urlparams.get("r");
        let g: null | string | number = urlparams.get("g");
        let b: null | string | number = urlparams.get("b");
        let id: null | string | number = urlparams.get("id");
        if (r == null) return Response.json({failed: true, reason: "R value not provided"}, 400);
        if (g == null) return Response.json({failed: true, reason: "G value not provided"}, 400);
        if (b == null) return Response.json({failed: true, reason: "B value not provided"}, 400);
        if (id == null) return Response.json({failed: true, reason: "ID value not provided"}, 400);
        try {
          r = Number.parseInt(r);
        } catch {
          return Response.json({failed: true, reason: "R value is invalid"}, 400);
        }
        try {
          g = Number.parseInt(g);
        } catch {
          return Response.json({failed: true, reason: "G value is invalid"}, 400);
        }
        try {
          b = Number.parseInt(b);
        } catch {
          return Response.json({failed: true, reason: "B value is invalid"}, 400);
        }
        try {
          id = Number.parseInt(id);
        } catch {
          return Response.json({failed: true, reason: "ID value is invalid"}, 400);
        }
        if (r < 0 || r > 255) return Response.json({failed: true, reason: "R value is invalid"}, 400);
        if (g < 0 || g > 255) return Response.json({failed: true, reason: "G value is invalid"}, 400);
        if (b < 0 || b > 255) return Response.json({failed: true, reason: "B value is invalid"}, 400);
        if (id < -4 || id > 8) return Response.json({failed: true, reason: "ID value is invalid"}, 400);

        const filePath = path.join(import.meta.dir, "assets/icons/bird_" + id + ".png");
        const img = await loadImage(filePath);

        const canvas = createCanvas(img.width, img.height);
        const ctx = canvas.getContext("2d");
        if (!ctx) return Response.json({failed: true, reason: "Failed process image"});

        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        if (!imageData) return Response.json({failed: true, reason: "Failed process image"}, 500);

        const data = imageData.data;
        const tint: [number, number, number] = [r / 255, g / 255, b / 255];

        if (!data) return Response.json({failed: true, reason: "Failed process image"}, 500);

        for (let i = 0; i < data.length; i += 4) {
          const alpha = data[i + 3]! / 255
          if (alpha > 0) {
            data[i]! = Math.round(data[i]! * tint[0])
            data[i + 1]! = Math.round(data[i + 1]! * tint[1])
            data[i + 2]! = Math.round(data[i + 2]! * tint[2])
          }
        }

        ctx.putImageData(imageData, 0, 0);

        const buffer = canvas.toBuffer("image/png");
        return new Response(buffer, { headers: { "Content-Type": "image/png" } });
      },
    },
    "/overlay": {
      async GET(req: Bun.BunRequest) {
        const url = new URL(req.url)
        const urlparams = url.searchParams;
        let r: null | string | number = urlparams.get("r");
        let g: null | string | number = urlparams.get("g");
        let b: null | string | number = urlparams.get("b");
        let id: null | string | number = urlparams.get("id");
        if (r == null) return Response.json({failed: true, reason: "R value not provided"}, 400);
        if (g == null) return Response.json({failed: true, reason: "G value not provided"}, 400);
        if (b == null) return Response.json({failed: true, reason: "B value not provided"}, 400);
        if (id == null) return Response.json({failed: true, reason: "ID value not provided"}, 400);
        try {
          r = Number.parseInt(r);
        } catch {
          return Response.json({failed: true, reason: "R value is invalid"}, 400);
        }
        try {
          g = Number.parseInt(g);
        } catch {
          return Response.json({failed: true, reason: "G value is invalid"}, 400);
        }
        try {
          b = Number.parseInt(b);
        } catch {
          return Response.json({failed: true, reason: "B value is invalid"}, 400);
        }
        try {
          id = Number.parseInt(id);
        } catch {
          return Response.json({failed: true, reason: "ID value is invalid"}, 400);
        }
        if (r < 0 || r > 255) return Response.json({failed: true, reason: "R value is invalid"}, 400);
        if (g < 0 || g > 255) return Response.json({failed: true, reason: "G value is invalid"}, 400);
        if (b < 0 || b > 255) return Response.json({failed: true, reason: "B value is invalid"}, 400);
        if (id < 1 || id > 14) return Response.json({failed: true, reason: "ID value is invalid"}, 400);

        const filePath = path.join(import.meta.dir, "assets/overlays/overlay_" + id + ".png");
        const img = await loadImage(filePath);

        const canvas = createCanvas(img.width, img.height);
        const ctx = canvas.getContext("2d");
        if (!ctx) return Response.json({failed: true, reason: "Failed process image"});

        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        if (!imageData) return Response.json({failed: true, reason: "Failed process image"}, 500);

        const data = imageData.data;
        const tint: [number, number, number] = [r / 255, g / 255, b / 255];

        if (!data) return Response.json({failed: true, reason: "Failed process image"}, 500);

        for (let i = 0; i < data.length; i += 4) {
          const alpha = data[i + 3]! / 255
          if (alpha > 0) {
            data[i]! = Math.round(data[i]! * tint[0])
            data[i + 1]! = Math.round(data[i + 1]! * tint[1])
            data[i + 2]! = Math.round(data[i + 2]! * tint[2])
          }
        }

        ctx.putImageData(imageData, 0, 0);

        const buffer = canvas.toBuffer("image/png");
        return new Response(buffer, { headers: { "Content-Type": "image/png" } });
      },
    },
  },
});

console.log("Server started on port " + process.env.PORT);
