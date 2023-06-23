import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import type { ImageProps } from "next/image";

const defaultImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="

export interface Props extends ImageProps {
  onLazyLoad?: (imageNode: HTMLImageElement | null) => void
}

export function LazyImage({ src, alt, onLazyLoad, ...imageProps }: Props): JSX.Element {
  const [srcImage, setSrcImage] = useState<ImageProps["src"]>(defaultImage)
  const imageRef = useRef<HTMLImageElement>(null);
  const onLazyLoadRef = useRef(onLazyLoad)

  useEffect(() => {
    if(srcImage === src) return

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if(!entry.isIntersecting) {
          return
        }
        setSrcImage(src)
        if(typeof onLazyLoadRef.current === "function") {
          onLazyLoadRef.current(imageRef.current)
        }
      })
    })

    if(imageRef.current) observer.observe(imageRef.current)

    return () => {
      observer.disconnect()
    }
  }, [src, srcImage])

  return (
    <Image ref={imageRef} src={srcImage} alt={alt} {...imageProps} />
  );
}