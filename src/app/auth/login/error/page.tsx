import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ErrorPageProps {
  searchParams: Promise<{ error: string }>;
}

const ErrorPage = async ({ searchParams }: ErrorPageProps) => {
  const sp = await searchParams;

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Icons.logo className="h-10 w-10" />
        <p className="text-destructive">
          {sp.error === "USER_ALREADY_EXISTS"
            ? "Essa conta já está vinculada a um usuário. Por favor, use outro método para fazer login."
            : "Por favor, tente novamente mais tarde."}
        </p>

        <Link href="/auth/login">
          <Button>Voltar para a página de login</Button>
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
