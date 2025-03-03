import Image from "next/image"

interface FallbackImageProps {
  src: string
  alt: string
  fallbackSrc: string
  fill?: boolean
  sizes?: string
  className?: string
  priority?: boolean
}

export default function FallbackImage({
  src,
  alt,
  fallbackSrc,
  fill = false,
  sizes,
  className,
  priority = false,
}: FallbackImageProps) {
  const imageProps = {
    src,
    alt,
    className,
    priority,
    ...(fill ? { fill } : { width: 400, height: 300 }),
    ...(sizes ? { sizes } : {}),
  }

  return (
    <Image 
      {...imageProps}
      blurDataURL={fallbackSrc}
      placeholder="blur"
    />
  )
}
