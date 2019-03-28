export default function loadImage(
  url: string,
  onProgress?: (e: ProgressEvent) => any
) {
  const img = new Image()
  img.src = url
  return new Promise(resolve => {
    img.onload = () => resolve(img)
    img.onprogress = onProgress
  }) as Promise<HTMLImageElement>
}
