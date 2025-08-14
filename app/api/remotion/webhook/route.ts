import { appRouterWebhook } from '@remotion/lambda/client';
import { prisma } from "@/lib/prisma";

export const POST = appRouterWebhook({
  secret: process.env.REMOTION_WEBHOOK_SECRET!,
  testing: process.env.NODE_ENV === 'development',

  onSuccess: async ({ renderId, outputUrl }) => {
    console.log(`✅ Render ${renderId} completed: ${outputUrl}`);
    // Your success logic here
    await prisma.video.updateMany({
      where: {
        renderId: renderId,
      },
      data: {
        completed: true,
        url: outputUrl,
        error: false,
      },
    })
  },

  onError: ({ renderId, errors }) => {
    console.error(`❌ Render ${renderId} failed:`, errors);
    // Your error handling logic
  },

  onTimeout: ({ renderId }) => {
    console.warn(`⏰ Render ${renderId} timed out`);
    // Your timeout handling logic
  }
});

export const OPTIONS = POST;
