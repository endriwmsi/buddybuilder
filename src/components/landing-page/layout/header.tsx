import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MobileMenu } from "./mobile-menu";
import Image from "next/image";

const Header = () => {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 px-4 py-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/placeholder.svg?height=40&width=40"
            alt="Logo"
            width={40}
            height={40}
            className="h-10 w-10"
          />
          <span className="text-xl font-bold">AIMarketing</span>
        </Link>

        <nav className="bg-background/80 hidden items-center rounded-full px-6 py-2 shadow-lg backdrop-blur-md md:flex">
          <ul className="flex space-x-8">
            <li>
              <Link
                href="#features"
                className="hover:text-primary text-sm font-medium transition-colors"
              >
                Recursos
              </Link>
            </li>
            <li>
              <Link
                href="#product"
                className="hover:text-primary text-sm font-medium transition-colors"
              >
                Produto
              </Link>
            </li>
            <li>
              <Link
                href="#testimonials"
                className="hover:text-primary text-sm font-medium transition-colors"
              >
                Depoimentos
              </Link>
            </li>
            <li>
              <Link
                href="#pricing"
                className="hover:text-primary text-sm font-medium transition-colors"
              >
                Planos
              </Link>
            </li>
            <li>
              <Link
                href="#faq"
                className="hover:text-primary text-sm font-medium transition-colors"
              >
                FAQ
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-4 md:flex">
            <Button variant="outline" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/waitlist">Lista de Espera</Link>
            </Button>
          </div>
          <ThemeToggle />
          <div className="md:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
