
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Download, Loader2Icon, LoaderCircle, Play, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

import { useUserStore } from '@/store/store';

export type PreviewProduct = {
  id: string,
  finalProductImageUrl: string,
  productImageUrl: string,
  description: string,
  size: string,
  status: string,
  imageToVideoStatus: string,
  videoUrl: string
}

export const PreviewResult = () => {

  const user = useUserStore((state) => state.user);

  const [productList, setProductList] = useState<PreviewProduct[]>();
  const [loading, setLoading] = useState(false);

  const DownloadImage = async (imageUrl: string) => {
    const result = await fetch(imageUrl);
    const blob = await result.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = blobUrl;

    a.setAttribute('download', 'tubeguruji');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(blobUrl);

  }



  const GenerateVideo = async (config: any) => {
    setLoading(true);
    const result = await axios.post('/api/generate-product-video', {
      imageUrl: config?.finalProductImageUrl,
      imageToVideoPromot: config?.imageToVideoPrompt,
      uid: user?.id,
      docId: config?.id
    });
    setLoading(false);

    console.log(result.data);
  }


  return (
    <div className='p-5 rounded-2xl border'>
      <h2 className="font-bold text-2xl">Generated Result</h2>

      <div className='grid grid-cols-2 mt-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 h-[90vh] overflow-auto'>
        {productList?.map((product, index) => (
          <div key={index}>
            {product?.status == 'completed' ?
              <div>
                <Image src={product.finalProductImageUrl}
                  alt={product.id}
                  width={500}
                  height={500}
                  className='w-full h-[250px] object-contain rounded-lg'
                />
                <div className='flex justify-between items-center mt-2'>
                  <div className='flex items-center gap-2'>
                    <Button variant={'ghost'} onClick={() => DownloadImage(product.finalProductImageUrl)}> <Download /> </Button>
                    <Link href={product.finalProductImageUrl} target='_blank'>
                      <Button variant={'ghost'}>View</Button>
                    </Link>
                    {product?.videoUrl && <Link href={product?.videoUrl} target='_blank'>
                      <Button variant={'ghost'}><Play /></Button>
                    </Link>}
                  </div>

                  {!product?.videoUrl && <Button
                    disabled={product?.imageToVideoStatus == 'pending'}
                    onClick={() => GenerateVideo(product)}>
                    {product?.imageToVideoStatus == 'pending' ? <LoaderCircle className='animate-spin' /> :
                      <Sparkles />} Animate</Button>}
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
