
import GptInterface from '@/components/shared/GptInterface';
import { auth } from '@clerk/nextjs';
import { getUserById } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';

const Home = async () => {
  const { userId } = auth();
  if (!userId) redirect('/sign-in');
  const user = await getUserById(userId);

  return (
    <>
      <GptInterface initialCreditBalance={user.creditBalance} />
    </>
  );
};

export default Home;
