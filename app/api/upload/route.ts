import { NextResponse } from 'next/server';
import axios from 'axios';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const formData = await req.formData();
    const videoFile = formData.get('video');
    
    if (!videoFile || !(videoFile instanceof Blob)) {
      return new NextResponse(
        JSON.stringify({ error: 'No video file provided' }),
        { status: 400, headers }
      );
    }

    const uploadFormData = new FormData();
    uploadFormData.append('video', videoFile, videoFile.name || 'video.mp4');

    const response = await axios.post(
      'https://decentrabackend-production.up.railway.app/upload',
      uploadFormData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      }
    );

    return new NextResponse(
      JSON.stringify({ 
        message: 'Video uploaded successfully', 
        data: response.data 
      }),
      { headers }
    );

  } catch (error) {
    return new NextResponse(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Upload failed',
      }),
      { status: 500, headers }
    );
  }
}