/**
 * Reads an image file, resizes it to fit within `maxSize` px (keeping aspect
 * ratio), and returns a compressed JPEG data URL. Keeps profile images small.
 */
export function fileToResizedDataUrl(
  file: File,
  maxSize = 256,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const img = new Image();

    reader.onerror = () => reject(new Error('Could not read the file'));
    reader.onload = () => {
      img.src = reader.result as string;
    };

    img.onerror = () => reject(new Error('Invalid image file'));
    img.onload = () => {
      let { width, height } = img;
      if (width > height && width > maxSize) {
        height = Math.round((height * maxSize) / width);
        width = maxSize;
      } else if (height > maxSize) {
        width = Math.round((width * maxSize) / height);
        height = maxSize;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas not supported'));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };

    reader.readAsDataURL(file);
  });
}
