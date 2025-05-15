export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background flex h-screen w-full items-center justify-center">
      <div className="flex h-full w-full flex-col items-center justify-center gap-16 lg:w-1/2">
        <div className="w-full max-w-[504px] px-8">{children}</div>
      </div>

      <div className="bg-muted relative hidden h-full flex-col p-10 text-white lg:flex lg:w-1/2 dark:border-r">
        <div
          className="absolute inset-0 bg-zinc-900"
          style={{
            // backgroundImage: `url(${bgImage.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="relative z-20 flex items-center justify-end text-lg font-medium">
          {/* <AppLogo /> */} Logo
        </div>

        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Essa plataforma simplificou meu processo de gerenciamento
              de estratégias de marketing do meu negócio, basicamente me deixou
              respirar ar fresco.&rdquo;
            </p>
            <footer className="text-sm">Valéria Cunha</footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
