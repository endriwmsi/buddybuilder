"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="py-6">
          <nav className="flex flex-col space-y-4">
            <Link
              href="#features"
              className="hover:text-primary px-4 py-2 text-lg font-medium transition-colors"
              onClick={handleLinkClick}
            >
              Recursos
            </Link>
            <Link
              href="#product"
              className="hover:text-primary px-4 py-2 text-lg font-medium transition-colors"
              onClick={handleLinkClick}
            >
              Produto
            </Link>
            <Link
              href="#testimonials"
              className="hover:text-primary px-4 py-2 text-lg font-medium transition-colors"
              onClick={handleLinkClick}
            >
              Depoimentos
            </Link>
            <Link
              href="#pricing"
              className="hover:text-primary px-4 py-2 text-lg font-medium transition-colors"
              onClick={handleLinkClick}
            >
              Planos
            </Link>
            <Link
              href="#faq"
              className="hover:text-primary px-4 py-2 text-lg font-medium transition-colors"
              onClick={handleLinkClick}
            >
              FAQ
            </Link>
          </nav>

          <div className="mt-8 space-y-4">
            <Button className="w-full" asChild>
              <Link href="/waitlist" onClick={handleLinkClick}>
                Lista de Espera
              </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/login" onClick={handleLinkClick}>
                Login
              </Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
