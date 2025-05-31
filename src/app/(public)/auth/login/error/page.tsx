import Link from "next/link";

interface ErrorPageProps {
  searchParams: Promise<{ error: string }>;
}

const ErrorPage = async ({ searchParams }: ErrorPageProps) => {
  const sp = await searchParams;

  return (
    <div className="lg:p-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Ops... Ocorreu um erro.
          </h1>
          <p className="text-muted-foreground text-sm">
            {sp.error === "USER_ALREADY_EXISTS"
              ? "Essa conta já está vinculada a um usuário. Por favor, use outro método para fazer login."
              : "Por favor, tente novamente mais tarde."}
          </p>

          <Link href="/auth/login">Voltar para o login</Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
