import React from "react";
import { LucideIcon, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthModal } from "@/contexts/AuthModalContext";

interface AuthPromptProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  iconSize?: number;
  iconClassName?: string;
}

export default function AuthPrompt({
  icon: Icon = User,
  title,
  description,
  iconSize = 64,
  iconClassName = "text-available"
}: AuthPromptProps) {
  const { openAuthModal } = useAuthModal();

  return (
    <div className="container mx-auto px-md py-xl text-center animate-fade-in">
      <Icon className={`mx-auto mb-lg ${iconClassName}`} size={iconSize} />
      <h2 className="text-3xl font-medium mb-4 text-pure-white">{title}</h2>
      <p className="text-light-text text-base max-w-md mx-auto mb-lg">
        {description}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={() => openAuthModal('signup')}
          size="lg"
          className="rounded-organic-md"
        >
          <User className="mr-2 h-5 w-5" />
          Create Free Account
        </Button>
        <Button
          onClick={() => openAuthModal('signin')}
          variant="outline"
          size="lg"
          className="rounded-organic-md"
        >
          Sign In
        </Button>
      </div>
    </div>
  );
}
