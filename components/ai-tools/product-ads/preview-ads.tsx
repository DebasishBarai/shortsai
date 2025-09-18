'use client'

import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Download, Loader2Icon, LoaderCircle, Play, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react'
import { Ad, useAdStore } from '@/store/store';

import { useUserStore } from '@/store/store';

export const PreviewAds = () => {

  const user = useUserStore((state) => state.user);

  const ads: Ad[] = useAdStore((state) => state.ads);

  const updateAd = useAdStore((state) => state.updateAd);

  const [loadingId, setLoadingId] = useState('');

  const DownloadImage = async (imageUrl: string) => {
    try {
      // Fetch the image
      const response = await fetch(imageUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }

      // Get the image blob
      const blob = await response.blob();

      // Create a temporary URL for the blob
      const blobUrl = window.URL.createObjectURL(blob);

      // Extract filename from URL or use a default
      const urlPath = new URL(imageUrl).pathname;
      const filename = urlPath.split('/').pop() || 'downloaded-image.jpg';

      // Create a temporary anchor element and trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download image. Please try again.');
    }
  };

  const GenerateVideo = async (adId: string) => {
    setLoadingId(adId);
    const result = await axios.post('/api/generate-ads/generate-video', {
      adId
    });

    if (result.status !== 200 && result.data.success) {
      throw new Error('Failed to generate video');
    }

    updateAd(result.data.id, {
      adVideoUrl: result.data.video
    });

    setLoadingId('');

    console.log(result.data);
  }

  return (
    <div className='p-5 rounded-2xl border'>
      <h2 className="font-bold text-2xl">Generated Result</h2>

      <div className='grid grid-cols-2 mt-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 h-[90vh] overflow-auto'>
        {ads?.map((product, index) => (
          <div key={index}>
            {product?.adImageUrl ?
              <div>
                <Image src={product.adImageUrl}
                  alt={product.id}
                  width={500}
                  height={500}
                  className='w-full h-[250px] object-contain rounded-lg'
                />
                <div className='flex justify-between items-center mt-2'>
                  <div className='flex items-center gap-2'>
                    <Button variant={'ghost'} onClick={() => DownloadImage(product.adImageUrl)}> <Download /> </Button>
                    <Link href={product.adImageUrl} target='_blank'>
                      <Button variant={'ghost'}>View</Button>
                    </Link>
                    {product?.adVideoUrl && <Link href={product?.adVideoUrl} target='_blank'>
                      <Button variant={'ghost'}><Play /></Button>
                    </Link>}
                  </div>

                  {!product?.adVideoUrl && <Button
                    onClick={() => GenerateVideo(product.id)}>
                    {product.id === loadingId ? <LoaderCircle className='animate-spin' /> : <Sparkles />}
                    Animate</Button>}
                </div>
              </div>
              : <div className='flex flex-col items-center justify-center border rounded-xl
                             h-full min-h-[250px]
                            bg-zinc-800'>
                <Loader2Icon className='animate-spin' />
                <h2>Generating...</h2>

              </div>}

          </div>
        ))}
      </div>
    </div>
  )
}
