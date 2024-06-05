'use server'
import Profile from "@/lib/database/models/profile.model";
import { auth } from '@clerk/nextjs';
import { getUserById } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
import Replicate from "replicate";

export async function POST(request: Request) {
  const { userId } = auth();
  if (!userId) redirect('/sign-in');

  const user = await getUserById(userId);
  const profile = await Profile.findOne({ userId: user._id });
  if (!profile) {
    return new Response(JSON.stringify({ message: `Create A profile before chatting` }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { message } = await request.json();
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  const input = {
    top_k: 0,
    top_p: 0.9,
    prompt: `You are a CV Generator designed to assist users in creating professional cover letters. Please generate a cover letter based on the job description: "${message}". My name is "${profile.name}", and I am applying for this position. My profile highlights include "${profile.description}" and "${profile.workExperience}". Please ensure the cover letter reflects my skills and experience effectively. Just the answer is sufficient, because the answer is directly converted to a pdf`,
    max_tokens: 512,
    min_tokens: 0,
    temperature: 0.6,
    system_prompt: "You are a helpful assistant",
    length_penalty: 1,
    stop_sequences: ",",
    prompt_template: "system\n\nYou are a helpful assistantuser\n\n{prompt}assistant\n\n",
    presence_penalty: 1.15,
    log_performance_metrics: false
  };

  try {
    const responseIterator = replicate.stream("meta/meta-llama-3-70b-instruct", { input });
    let answer = '';

    for await (const event of responseIterator) {
      // Assuming 'event' contains the text response
      answer += event.toString();
    }

    console.log('Answer:', answer);
    return new Response(JSON.stringify({ message: answer }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ message: 'Error generating response' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}
