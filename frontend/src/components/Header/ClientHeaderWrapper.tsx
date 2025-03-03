'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';


// Dynamically import the Header with no SSR to avoid hydration issues with auth state
const Header = dynamic(() => import('@/components/header/Header'), { ssr: false });

export default function ClientHeaderWrapper() {
  const pathname = usePathname();
  
  // Don't show header on login page
  if (pathname === '/login') {
    return null;
  }
  
  return <Header />;
} 