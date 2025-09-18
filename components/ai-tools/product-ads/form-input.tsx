'use client'

import { Textarea } from '@/components/ui/textarea';
import { ImagePlus, Loader2Icon, Monitor, Smartphone, Sparkles, Square } from 'lucide-react'
import Image from 'next/image';
import React, { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const sampleProduct = [
  '/products/headphone.png',
  '/products/juice-can.png',
  '/products/perfume2.png',
  '/products/burger.png',
  '/products/ice-creame.png'
]

const AvatarList = [
  {
    name: 'Avatar 1',
    imageUrl: '/products/avatar1.avif'
  },
  {
    name: 'Avatar 2',
    imageUrl: '/products/avatar2.webp'
  },
  {
    name: 'Avatar 3',
    imageUrl: '/products/avatar3.avif'
  },
  {
    name: 'Avatar 4',
    imageUrl: '/products/avatar4.webp'
  },
  {
    name: 'Avatar 5',
    imageUrl: '/products/avatar5.webp'
  },
  {
    name: 'Avatar 6',
    imageUrl: '/products/avatar6.webp'
  },

]

type Props = {
  onHandleInputChange: any,
  OnGenerate: any,
  loading: boolean,
}

/**
 * Convert a File object OR a URL/path string to a base64 string (without prefix).
 */
export async function convertImageToBase64(
  input: File | string
): Promise<string> {
  // Case 1: File object (from input type="file")
  if (input instanceof File) {
    return fileToBase64(input);
  }

  // Case 2: URL or relative path
  const response = await fetch(input);
  if (!response.ok) throw new Error(`Failed to fetch: ${input}`);
  const blob = await response.blob();
  return blobToBase64(blob);
}

// helper for File
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsDataURL(file);
  });
}

// helper for Blob/URL fetch
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      } else {
        reject(new Error('Failed to read blob'));
      }
    };
    reader.onerror = () => reject(new Error('Error reading blob'));
    reader.readAsDataURL(blob);
  });
}


export const FormInput = ({ onHandleInputChange, OnGenerate, loading }: Props) => {

  const [preview, setPreview] = useState<string | null>()
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null)


  const onFileSelect = async (input: FileList | string | null) => {
    try {
      // Case 1: Input from file input
      if (input && typeof input !== 'string') {
        if (input.length === 0) return;

        const file = input[0];
        if (file.size > 5 * 1024 * 1024) {
          alert('File size greater than 5 MB');
          return;
        }

        const base64Image = await convertImageToBase64(file);

        onHandleInputChange('base64Image', base64Image);

        // Show preview with object URL
        setPreview(URL.createObjectURL(file));
        return;
      }

      // Case 2: Input is a URL string (clicked sample product)
      if (typeof input === 'string') {
        const base64Image = await convertImageToBase64(input);

        // Clear base64 and store URL if you prefer using URL
        onHandleInputChange('base64Image', base64Image);

        setPreview(input);
        return;
      }
    } catch (error) {
      console.error('Error converting image to base64:', error);
      toast.error('Error processing image');
    }
  };


  return (
    <div className='p-7 border rounded-2xl'>
      <div>
        <h2 className='font-semibold'>1. Upload Product Image</h2>
        <div>
          <label htmlFor='imageUpload' className='mt-2 border-dashed border-2 rounded-xl
                    flex flex-col p-4 bg-zinc-800 items-center justify-center min-h-[200px] cursor-pointer'>
            {!preview ? <div className='flex flex-col items-center gap-3'>
              <ImagePlus className='h-8 w-8 opacity-40' />
              <h2 className='text-xl'>Click here to upload Image</h2>
              <p className='opacity-45'>Upload image upto 5MB</p>
            </div>
              : <Image src={preview} alt='preview' width={300} height={300}
                className='w-full h-full max-h-[200px] object-contain 
                                rounded-lg'
              />}
          </label>
          <input type='file' id="imageUpload" className='hidden' accept='image/*'
            onChange={(event) => onFileSelect(event.target.files)}
          />
        </div>
        {/* Sample Products  */}
        <div>
          <h2 className='opacity-40 text-center mt-3'>Select Sample product to try</h2>
          <div className='flex gap-5 items-center flex-wrap'>
            {sampleProduct.map((product, index) => (
              <Image src={product} alt={product} width={100} height={100} key={index}
                className='w-[60px] h-[60px] rounded-lg cursor-pointer hover:scale-105 transition-all'
                onClick={() => onFileSelect(product)}
              />
            ))}
          </div>
        </div>

      </div>

      <div className='mt-8'>
        <h2 className='font-semibold'>2. Select Avatar</h2>
        <div className='grid grid-cols-4 gap-3 mt-2'>
          {/* No Avatar option */}
          <div
            className={cn('rounded-lg h-[100px] w-[80px] cursor-pointer border-2 border-solid flex items-center justify-center bg-transparent', !selectedAvatar && 'border-2 border-primary')}
            onClick={() => {
              setSelectedAvatar(null);
              onHandleInputChange('avatarName', '')
            }}
          >
            <span className='text-xs text-gray-400 text-center'>No Avatar</span>
          </div>

          {/* Avatar options */}
          {AvatarList.map((avatar, index) => (
            <Image src={avatar.imageUrl} alt={avatar.name} width={200} height={200}
              className={`rounded-lg h-[100px] w-[80px] cursor-pointer object-cover
                                ${avatar.name == selectedAvatar && 'border-2 border-primary'}
                                `} key={index}
              onClick={async () => {
                setSelectedAvatar(avatar.name);

                onHandleInputChange('avatarName', avatar.name)
              }}
            />
          ))}
        </div>
      </div>

      <div className='mt-8'>
        <h2 className='font-semibold'>3. Enter product description</h2>
        <Textarea placeholder='Tell me more about product and how you want to display'
          className='min-h-[150px] mt-2 bg-zinc-800'
          onChange={(event) => onHandleInputChange('description', event.target.value)}
        />
      </div>

      <div className='mt-8'>
        <h2 className='font-semibold'>4.Select Image Size</h2>
        <Select onValueChange={(value) => onHandleInputChange('resolution', value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Resolution" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1024x1024">
              <div className='flex gap-2 items-center'>
                <Square className='h-4 w-4' />
                <span>1:1</span>
              </div>
            </SelectItem>
            <SelectItem value="1536x1024">
              <div className='flex gap-2 items-center'>
                <Monitor className='h-4 w-4' />
                <span>16:9</span>
              </div>
            </SelectItem>
            <SelectItem value="1024x1536">
              <div className='flex gap-2 items-center'>
                <Smartphone className='h-4 w-4' />
                <span>9:16</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        disabled={loading}
        className='mt-5 w-full' onClick={OnGenerate}>
        {loading ? <Loader2Icon className='animate-spin' /> : <Sparkles />}Generate </Button>
      <h2 className='mt-1 text-sm opacity-35 text-center'>5 Credit to Generate</h2>
    </div>
  )
}
