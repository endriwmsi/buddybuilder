import type { LucideIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import * as LucideIcons from "lucide-react";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  // Dynamically get the icon from Lucide
  const Icon = LucideIcons[icon as keyof typeof LucideIcons] as LucideIcon;

  return (
    <Card className="bg-background/60 border backdrop-blur-sm transition-all hover:shadow-md">
      <CardHeader>
        <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
          {Icon && <Icon className="text-primary h-6 w-6" />}
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
