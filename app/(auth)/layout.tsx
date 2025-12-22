
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export const  metadata = {
  title: "Auth | AskCortex",
  description: "Authenticate to access AskCortex's AI-powered features.",
};

export default async function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth.api.getSession({
        headers: await headers(), // you need to pass the headers object.
    });

    if (session) {
       return redirect('/');
    }

    return <div>{children}</div>;
}