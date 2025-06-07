// Функция для ленивой загрузки изображений
export const lazyLoadImage = (imagePath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imagePath;
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${imagePath}`));
  });
};

// Функция для предзагрузки критических ресурсов
export const preloadCriticalResources = async () => {
  const criticalImages = [
    '/icons/logo.svg',
    '/icons/darklogo.png',
    '/icons/logo.png',
    '/icons/1.svg',
    '/icons/2.svg',
    '/icons/3.svg',
    '/icons/4.svg',
  ];

  try {
    await Promise.all(criticalImages.map(lazyLoadImage));
  } catch (error) {
    console.error('Failed to preload some images:', error);
  }
};

// Функция для проверки поддержки WebP
export const supportsWebP = async (): Promise<boolean> => {
  if (!self.createImageBitmap) return false;
  
  const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
  const blob = await fetch(webpData).then(r => r.blob());
  
  return createImageBitmap(blob).then(() => true, () => false);
}; 