import { prisma } from "@/lib/prisma";
import { getFunctions, getRenderProgress } from "@remotion/lambda/client";

export async function POST(request: Request) {
  const body = await request.json();
  console.log('Request body:', body);

  const { renderId, bucketName } = body;

  if (!renderId) {
    return new Response(
      JSON.stringify({ error: 'Missing required field "renderId"' }),
      { status: 400 }
    );
  }

  try {
    const functions = await getFunctions({
      region: 'ap-south-1',
      compatibleOnly: true,
    });

    const functionName = functions[0].functionName;
    const progress = await getRenderProgress({
      renderId: renderId,
      bucketName: bucketName,
      functionName: functionName,
      region: 'ap-south-1',
    });

    if (progress.done) {
      await prisma.video.updateMany({
        where: {
          renderId,
          bucketName,
        },
        data: {
          url: progress.outputFile,
          completed: true,
        },
      });
    }

    console.log('Render progress:', progress);

    return new Response(JSON.stringify(progress), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error getting render progress:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to get render progress' }),
      { status: 500 }
    );
  }
}
