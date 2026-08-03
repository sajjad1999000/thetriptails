/**
 * lib/images/compress.js
 *
 * Single shared compression function for The Trip Tales.
 * Used by EVERY entry point where an image enters the system before it
 * reaches Cloudinary:
 *   - Public submission form (app/submit)
 *   - Admin panel upload field (AD6)
 *   - Admin "uploading on author's behalf" flow (e.g. images received by email)
 *
 * No entry point gets its own compression logic — they all call this.
 * Client-side only (runs in the browser via the Canvas API), so it works
 * identically whether it's triggered by a public visitor or an admin.
 */

const DEFAULTS = {
  maxWidth: 2000,       // px — long edge cap, generous enough for full-bleed hero use
  maxHeight: 2000,
  quality: 0.82,        // 0–1, JPEG/WebP quality
  mimeType: 'image/webp', // falls back to image/jpeg if browser can't encode webp
  maxSizeMB: 8,          // hard reject above this, even before compression (likely not a real photo)
};

/**
 * Compress a single image File/Blob before upload.
 *
 * @param {File|Blob} file - the source image file
 * @param {object} [options] - override any DEFAULTS
 * @returns {Promise<{ blob: Blob, width: number, height: number, originalSizeKB: number, compressedSizeKB: number }>}
 */
export async function compressImage(file, options = {}) {
  const opts = { ...DEFAULTS, ...options };

  if (!file || !file.type || !file.type.startsWith('image/')) {
    throw new Error('compressImage: file is not an image');
  }

  const originalSizeMB = file.size / (1024 * 1024);
  if (originalSizeMB > opts.maxSizeMB) {
    throw new Error(
      `compressImage: file is ${originalSizeMB.toFixed(1)}MB, exceeds ${opts.maxSizeMB}MB cap. ` +
      `Ask the sender for a smaller export, or resize manually before uploading.`
    );
  }

  const imageBitmap = await loadImage(file);

  const { width, height } = fitWithinBounds(
    imageBitmap.width,
    imageBitmap.height,
    opts.maxWidth,
    opts.maxHeight
  );

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(imageBitmap, 0, 0, width, height);

  const mimeType = await resolveSupportedMimeType(opts.mimeType);

  const blob = await canvasToBlob(canvas, mimeType, opts.quality);

  return {
    blob,
    width,
    height,
    originalSizeKB: Math.round(file.size / 1024),
    compressedSizeKB: Math.round(blob.size / 1024),
  };
}

/**
 * Compress multiple images in one call (e.g. a multi-image story submission
 * or an admin batch upload). Runs sequentially to avoid spiking memory on
 * mobile devices submitting several full-size photos at once.
 *
 * @param {File[]|Blob[]} files
 * @param {object} [options]
 * @returns {Promise<Array<Awaited<ReturnType<typeof compressImage>> & { error?: string }>>}
 */
export async function compressImages(files, options = {}) {
  const results = [];
  for (const file of files) {
    try {
      results.push(await compressImage(file, options));
    } catch (err) {
      results.push({ error: err.message, sourceFile: file?.name || 'unknown' });
    }
  }
  return results;
}

// ---- internal helpers ----

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('compressImage: could not decode image file'));
    };
    img.src = url;
  });
}

function fitWithinBounds(width, height, maxWidth, maxHeight) {
  let w = width;
  let h = height;
  const ratio = Math.min(maxWidth / w, maxHeight / h, 1); // never upscale
  w = Math.round(w * ratio);
  h = Math.round(h * ratio);
  return { width: w, height: h };
}

function canvasToBlob(canvas, mimeType, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('compressImage: canvas encoding failed'))),
      mimeType,
      quality
    );
  });
}

let cachedMimeType = null;
async function resolveSupportedMimeType(preferred) {
  if (cachedMimeType) return cachedMimeType;
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const supportsWebp = canvas.toDataURL('image/webp').startsWith('data:image/webp');
  cachedMimeType = preferred === 'image/webp' && supportsWebp ? 'image/webp' : 'image/jpeg';
  return cachedMimeType;
}
