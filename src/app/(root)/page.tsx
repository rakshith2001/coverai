
import GptInterface from '@/components/shared/GptInterface';
import { auth } from '@clerk/nextjs';
import { getUserById } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';

const Home = async () => {


  return (
    <>
      <GptInterface  />
    </>
  );
};

export default Home;
