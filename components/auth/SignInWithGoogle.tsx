import { signIn } from '@/auth';

import { Button } from '@/components/ui/button';

export default function SignInWithGoogle() {
  return (
    <form
      action={async () => {
        'use server';
        await signIn('google');
      }}
    >
      <Button variant="outline" className="w-full" type="submit">
        Login with Google
      </Button>
    </form>
  );
}
