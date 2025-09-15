"use client"

import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { FormInput } from '@/components/ai-tools/product-ads/form-input'
import { useUserStore } from '@/store/store'
import { PreviewResult } from '@/components/ai-tools/product-ads/preview-result'

// Updated FormData structure - removed file, added base64Image
type FormData = {
  base64Image?: string,  // Base64 encoded image string
  description: string,
  resolution: string,
  base64Avatar?: string
}

// Utility function to convert file to base64
const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.result) {
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,") 
        // and keep only the base64 string
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      } else {
        reject(new Error('Failed to read file'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };

    reader.readAsDataURL(file);
  });
};

export default function CreateAdsPage() {
  const [formData, setFormData] = useState<FormData>();
  const [loading, setLoading] = useState(false);
  const user = useUserStore((state) => state.user);
  const router = useRouter();

  // Updated handler to process file uploads and convert to base64
  const onHandleInputChange = async (field: string, value: string) => {
    console.log({ [field]: value })
      // Handle other form fields normally
      setFormData((prev: any) => ({
        ...prev,
        [field]: value
      }));
  }

  const OnGenerate = async () => {
    // Updated validation: check for base64Image OR imageUrl
    if (!formData?.base64Image) {
      alert('Please upload a Product Image');
      return;
    }

    setLoading(true);

    // Create JSON payload instead of FormData since we're not sending files
    const payload = {
      base64Image: formData?.base64Image ?? '',
      description: formData?.description ?? '',
      size: formData?.resolution ?? '1028x1028',
      userEmail: user?.email ?? '',
      base64Avatar: formData?.base64Avatar ?? ''
    };

    try {
      // Send JSON payload instead of FormData
      const result = await axios.post('/api/generate-product-image', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(result.data);

      if (result.data.error) {
        toast.error('Please Try Again');
      }
    } catch (error) {
      console.error('API call failed:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className='font-bold text-2xl mb-3'>AI Product Ads Generator</h2>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
        <div>
          <FormInput
            onHandleInputChange={(field: string, value: string) => onHandleInputChange(field, value)}
            OnGenerate={OnGenerate}
            loading={loading}
          />
        </div>
        <div className='md:col-span-2'>
          <PreviewResult />
        </div>
      </div>
    </div>
  )
}
