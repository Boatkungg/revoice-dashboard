import Image from "next/image";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="h-screen w-screen relative">
      <Image src={"/background.jpg"} layout="fill" objectFit="cover" alt="" draggable={false} className="-z-50 brightness-75" />
      <div className="h-full w-full flex items-center justify-center">
        {/* <div className="w-3xs h-40 bg-amber-600"></div> */}
        {children}
      </div>
    </main>
  );
}