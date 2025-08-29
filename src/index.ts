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

        const filePath = path.join(import.meta.dir, "assets/icons/" + id + ".png");
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

        const filePath = path.join(import.meta.dir, "assets/overlays/" + id + ".png");
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
    "/iconandoverlay": {
      async GET(req: Bun.BunRequest) {
        const url = new URL(req.url)
        const urlparams = url.searchParams;
        let br: null | string | number = urlparams.get("br");
        let bg: null | string | number = urlparams.get("bg");
        let bb: null | string | number = urlparams.get("bb");
        let or: null | string | number = urlparams.get("or");
        let og: null | string | number = urlparams.get("og");
        let ob: null | string | number = urlparams.get("ob");
        let bid: null | string | number = urlparams.get("bid");
        let oid: null | string | number = urlparams.get("oid");
        if (br == null) return Response.json({failed: true, reason: "Bird R value not provided"}, 400);
        if (bg == null) return Response.json({failed: true, reason: "Bird G value not provided"}, 400);
        if (bb == null) return Response.json({failed: true, reason: "Bird B value not provided"}, 400);
        if (or == null) return Response.json({failed: true, reason: "Overlay R value not provided"}, 400);
        if (og == null) return Response.json({failed: true, reason: "Overlay G value not provided"}, 400);
        if (ob == null) return Response.json({failed: true, reason: "Overlay B value not provided"}, 400);
        if (bid == null) return Response.json({failed: true, reason: "Bird ID value not provided"}, 400);
        if (oid == null) return Response.json({failed: true, reason: "Overlay ID value not provided"}, 400);
        try { br = Number.parseInt(br) } catch { return Response.json({failed: true, reason: "Bird R value is invalid"}, 400) }
        try { bg = Number.parseInt(bg) } catch { return Response.json({failed: true, reason: "Bird G value is invalid"}, 400) }
        try { bb = Number.parseInt(bb) } catch { return Response.json({failed: true, reason: "Bird B value is invalid"}, 400) }
        try { or = Number.parseInt(or) } catch { return Response.json({failed: true, reason: "Overlay R value is invalid"}, 400) }
        try { og = Number.parseInt(og) } catch { return Response.json({failed: true, reason: "Overlay G value is invalid"}, 400) }
        try { ob = Number.parseInt(ob) } catch { return Response.json({failed: true, reason: "Overlay B value is invalid"}, 400) }
        try { bid = Number.parseInt(bid) } catch { return Response.json({failed: true, reason: "Bird ID value is invalid"}, 400) }
        try { oid = Number.parseInt(oid) } catch { return Response.json({failed: true, reason: "Overlay ID value is invalid"}, 400) }
        if (br < 0 || br > 255) return Response.json({failed: true, reason: "Bird R value is invalid"}, 400);
        if (bg < 0 || bg > 255) return Response.json({failed: true, reason: "Bird G value is invalid"}, 400);
        if (bb < 0 || bb > 255) return Response.json({failed: true, reason: "Bird B value is invalid"}, 400);
        if (or < 0 || or > 255) return Response.json({failed: true, reason: "Overlay R value is invalid"}, 400);
        if (og < 0 || og > 255) return Response.json({failed: true, reason: "Overlay G value is invalid"}, 400);
        if (ob < 0 || ob > 255) return Response.json({failed: true, reason: "Overlay B value is invalid"}, 400);
        if (bid < -4 || bid > 8) return Response.json({failed: true, reason: "Bird ID value is invalid"}, 400);
        if (oid < 1 || oid > 14) return Response.json({failed: true, reason: "Overlay ID value is invalid"}, 400);

        const filePathBird = path.join(import.meta.dir, "assets/icons/" + bid + ".png");
        const filePathOverlay = path.join(import.meta.dir, "assets/overlays/" + oid + ".png");
        const imgBird = await loadImage(filePathBird);
        const imgOverlay = await loadImage(filePathOverlay);

        const canvas = createCanvas(imgBird.width, imgBird.height);
        const ctx = canvas.getContext("2d");
        if (!ctx) return Response.json({failed: true, reason: "Failed process image"});

        ctx.drawImage(imgBird, 0, 0);
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;
        const birdTint: [number, number, number] = [br / 255, bg / 255, bb / 255];
        for (let i = 0; i < data.length; i += 4) {
          const alpha = data[i + 3]! / 255;
          if (alpha > 0) {
            data[i]! = Math.round(data[i]! * birdTint[0]);
            data[i + 1]! = Math.round(data[i + 1]! * birdTint[1]);
            data[i + 2]! = Math.round(data[i + 2]! * birdTint[2]);
          }
        }
        ctx.putImageData(imageData, 0, 0);

        const overlayCanvas = createCanvas(imgOverlay.width, imgOverlay.height);
        const overlayCtx = overlayCanvas.getContext("2d");
        overlayCtx.drawImage(imgOverlay, 0, 0);
        let overlayData = overlayCtx.getImageData(0, 0, overlayCanvas.width, overlayCanvas.height);
        let odata = overlayData.data;
        const overlayTint: [number, number, number] = [or / 255, og / 255, ob / 255];
        for (let i = 0; i < odata.length; i += 4) {
          const alpha = odata[i + 3]! / 255;
          if (alpha > 0) {
            odata[i]! = Math.round(odata[i]! * overlayTint[0]);
            odata[i + 1]! = Math.round(odata[i + 1]! * overlayTint[1]);
            odata[i + 2]! = Math.round(odata[i + 2]! * overlayTint[2]);
          }
        }
        overlayCtx.putImageData(overlayData, 0, 0);

        let ox = (canvas.width - imgOverlay.width) / 2;
        let oy = (canvas.height - imgOverlay.height) / 2;
        if (oid == 8) { ox = -16.56; oy = 14.81 }
        else if (oid == 11) { ox = -14.74451; oy = 20.39122 }
        else if (oid == 13) { ox = -16.54019; oy = 14.70365 }

        ctx.drawImage(overlayCanvas, ox, oy);

        const buffer = canvas.toBuffer("image/png");
        return new Response(buffer, { headers: { "Content-Type": "image/png" } });
      }
    }
  },
});

console.log("Server started on port " + process.env.PORT);
