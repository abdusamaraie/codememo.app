import type { Metadata } from 'next';
import { SignIn } from '@clerk/nextjs';

export const metadata: Metadata = {
  title: 'Sign In — CodeMemo',
  description: 'Sign in to your CodeMemo account.',
};

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[--background]">
      <SignIn routing="hash" />
    </div>
  );
}
