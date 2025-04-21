import { Logo } from './_components/logo';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex flex-col h-full items-center justify-center space-y-6'>
      <Logo />
      {children}
    </div>
  );
}
