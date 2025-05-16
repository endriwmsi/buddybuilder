import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const SuccessPage = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Icons.logo className="h-10 w-10" />
        <p className="text-muted-foreground">
          Tudo pronto! Um novo link de verificação foi enviado para o seu
          e-mail.
        </p>
      </div>

      <Link href="/auth/login">
        <Button>Voltar para a página de login</Button>
      </Link>
    </div>
  );
};

export default SuccessPage;
