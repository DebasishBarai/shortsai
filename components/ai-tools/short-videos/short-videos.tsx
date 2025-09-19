"use client"

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { useUserStore } from '@/store/store'

const ShortVideoDemos = [
  {
    name: 'AI Products Images',
    desc: 'Generate high-quality, professional product images instantly with AI. ',
    banner: '/products/product-image.png',
    path: '/ai-tools/product-ads/create-ads'
  },
  {
    name: 'AI Products Video',
    desc: 'Create engaging product showcase videos using AI. ',
    banner: '/products/product-video.png',
    path: '/ai-tools/product-ads/create-ads'

  },
  {
    name: 'AI Products With Avatar',
    desc: 'Bring your products to life with AI avatars.',
    banner: '/products/product-avatar.png',
    path: '/ai-tools/product-ads/create-ads'

  }
]

export const ShortVideoDemoList = () => {

  const user = useUserStore((state) => state.user);

  return (
    <div>
      <h2 className='font-bold text-2xl mb-2'>AI Product Ads Generator</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
        {ShortVideoDemos.map((tool, index) => (
          <div key={index} className='grid grid-cols-1 lg:grid-cols-2 items-center justify-between 
                    p-7 bg-zinc-800 rounded-2xl'>
            <div>
              <h2 className='font-bold text-2xl'>{tool.name}</h2>
              <p className='opacity-60 mt-2'>{tool.desc}</p>
              <Link href={user ? tool.path : '/login'}>
                <Button className='mt-4'>Create Now</Button>
              </Link>
            </div>
            <Image src={tool.banner} alt={tool.name}
              width={300}
              height={300}
              className="w-[200px]"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
