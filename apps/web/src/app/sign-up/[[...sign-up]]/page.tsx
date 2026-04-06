import type { Metadata } from 'next';
import { SignUp } from '@clerk/nextjs';

export const metadata: Metadata = {
  title: 'Create Account — CodeMemo',
  description: 'Create your free CodeMemo account and start learning.',
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[--background]">
      <SignUp routing="hash" />
    </div>
  );
}
