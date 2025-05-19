import { Icons } from "@/components/icons";
import Link from "next/link";

const SuccessPage = () => {
  return (
    <div className="lg:p-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Icons.logo className="h-10 w-10" />
          <p className="text-muted-foreground text-sm">
            Tudo pronto! Você registrou-se com sucesso. Por favor, verifique seu
            e-mail para continuar.
          </p>

          <Link href="/auth/login">Voltar para o login</Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
