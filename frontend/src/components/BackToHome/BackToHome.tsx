import { useRouter } from 'next/navigation';

export default function BackToHome({ error }: { error?: string }) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      { error && <div className="text-red-500 mb-4">{ error }</div> }
      <button 
        onClick={() => router.push('/')}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Back to Home
      </button>
    </div>
  );
}
