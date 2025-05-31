import Link from "next/link";

export default function Page() {
  return (
    <div className="lg:p-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Tudo pronto!
          </h1>
          <p className="text-muted-foreground text-sm">
            Enviamos um link de redefinição de senha para seu e-mail.
          </p>

          <Link href="/auth/login">Voltar para o login</Link>
        </div>
      </div>
    </div>
  );
}
