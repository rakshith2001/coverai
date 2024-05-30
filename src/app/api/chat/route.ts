'use server'
export async function POST(request: Request) {
  const { message } = await request.json();
  console.log(`You said: ${message}`);
  return new Response(JSON.stringify({ message: `you said ${message}` }), {
    headers: { 'Content-Type': 'application/json' },
  });
  

}