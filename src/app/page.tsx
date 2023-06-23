"use client"
import Script from 'next/script'
import { useState, useCallback } from "react";
import { LazyImage } from "@/components/LazyImage"
import type { ImageLoaderProps } from "next/image"
import type { NextPage } from 'next'
import type { MouseEventHandler } from "react"
import type { Props as LazyImageProps } from "@/components/LazyImage"
import { random as getRandomInt } from "lodash"

//generate a random integer between 1 and 123
// function getRandomInt(max: number) {
//   return Math.floor(Math.random() * max) + 1;
// }

//generate simple unique id 
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
  })
}

const imageLoader = ({ src, width, quality }: ImageLoaderProps): string => {
  return `${src}?w=${width}&q=${quality || 75}`
}

const Home: NextPage = () => {
  const [images, setImages] = useState<ImageItem[]>([])
  
  const addNewFox: MouseEventHandler<HTMLButtonElement> = (event) => {
    const newFox: ImageItem = {
      id: uuidv4(),
      url: `https://randomfox.ca/images/${getRandomInt(1, 123)}.jpg`,
    }

    setImages([...images, newFox])

    window.plausible("signup", { 
      callback: (...args: unknown[]) => {
        console.log("Plausible event sent", ...args)
      }
    })
  }

  const onLazyLoad: LazyImageProps["onLazyLoad"] = (imageNode) => {
    console.log("Image loaded", imageNode)
  }

  return (
    <>
      <main className="flex flex-col items-center text-center p-4">
        <h1 className="text-4xl font-bold underline">
          Hello world!
        </h1>
        <button onClick={addNewFox}>
          Add new fox
        </button>
          {images.map(({id, url}) => (
            <div key={id} className="p-4">
              <div  className="relative p-4 w-96 h-96" >
                <LazyImage 
                  src={url} 
                  fill 
                  alt="A fox image" 
                  loader={imageLoader} 
                  onLazyLoad={onLazyLoad}
                  className="h-auto w-auto rounded object-cover bg-slate-400" 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
              </div>
            </div>
          ))}
      </main>
      <Script
        defer
        data-domain="yourdomain.com"
        src="https://plausible.io/js/script.js"
      />
    </>
  )
}

export default Home
