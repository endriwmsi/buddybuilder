import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { QuoteIcon } from "lucide-react";

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  avatarUrl: string;
}

export function TestimonialCard({
  quote,
  author,
  role,
  avatarUrl,
}: TestimonialCardProps) {
  return (
    <Card className="bg-background/60 flex h-full flex-col border backdrop-blur-sm">
      <CardContent className="flex-grow pt-6">
        <QuoteIcon className="text-muted-foreground/40 mb-4 h-8 w-8" />
        <p className="text-muted-foreground">{quote}</p>
      </CardContent>
      <CardFooter className="border-t px-4">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={author} />
            <AvatarFallback>
              {author
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{author}</p>
            <p className="text-muted-foreground text-sm">{role}</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
