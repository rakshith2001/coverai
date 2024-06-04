'use server'
import Profile from "@/lib/database/models/profile.model";
import { auth } from '@clerk/nextjs';
import { getUserById } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';

export async function POST(request: Request) {
  const { userId } = auth();
  if(!userId) redirect('/sign-in');

  const user = await getUserById(userId);


  const profile = await Profile.findOne({ userId: user._id});
  if(!profile) {
    return new Response(JSON.stringify({ message: `Create A profile before chating` }), {
      headers: { 'Content-Type': 'application/json' },
    });
  
  }


  const { message } = await request.json();

  return new Response(JSON.stringify({ message: `you said ${message}` }), {
    headers: { 'Content-Type': 'application/json' },
  });
  

}