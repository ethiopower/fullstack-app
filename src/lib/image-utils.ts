/**
 * Gets the correct image path for a product image
 * @param imageName The base name of the image (e.g., 'product_034' or full path)
 * @returns The image path to try
 */
export function getProductImagePath(imageName: string): string {
  // If a full path is provided, extract just the filename without extension
  const baseFileName = imageName.split('/').pop()?.split('.')[0] || imageName;
  
  // If it's already a full path with extension, return it
  if (imageName.startsWith('/images/products/') && /\.(jpg|jpeg|png|webp)$/i.test(imageName)) {
    return imageName;
  }
  
  // Extract the product number
  const productNumber = baseFileName.match(/\d+/)?.[0];
  if (!productNumber) {
    return '/images/products/placeholder.jpg';
  }

  // Convert to number and check range
  const num = parseInt(productNumber, 10);
  if (num >= 24 && num <= 84) {
    // Products 24-84 use .jpeg extension
    return `/images/products/product_${String(num).padStart(3, '0')}.jpeg`;
  } else {
    // Products 1-23 use .jpg extension
    return `/images/products/product_${String(num).padStart(3, '0')}.jpg`;
  }
}

/**
 * Get the placeholder image path
 * @returns Path to placeholder image
 */
export function getPlaceholderImage(): string {
  return '/images/products/placeholder.jpg';
}

/**
 * Handle image loading error by replacing with placeholder
 * @param event Image error event
 */
export function handleImageError(event: React.SyntheticEvent<HTMLImageElement, Event>): void {
  const img = event.target as HTMLImageElement;
  img.src = getPlaceholderImage();
  img.onerror = null; // Prevent infinite loop if placeholder also fails
} 