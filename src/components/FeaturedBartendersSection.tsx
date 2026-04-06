import React, { useState, useEffect } from "react";
import { socialService, SuggestedUser, TrendingUser } from "@/services/socialService";
import UserCard from "@/components/social/UserCard";
import { useAuth } from "@/hooks/useAuth";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type BartenderUser = SuggestedUser | TrendingUser;

type FeaturedBartendersSectionProps = {
  onShowAuthModal?: () => void;
};

export default function FeaturedBartendersSection({ onShowAuthModal }: FeaturedBartendersSectionProps) {
  const { user } = useAuth();
  const [bartenders, setBartenders] = useState<BartenderUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBartenders = async () => {
      try {
        setLoading(true);
        // Try to get suggested users first, fall back to trending if not authenticated
        const users = user 
          ? await socialService.getSuggestedUsers(6)
          : await socialService.getTrendingUsers(6);
        setBartenders(users);
      } catch (error) {
        console.error("Error fetching featured bartenders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBartenders();
  }, [user]);

  if (loading) {
    return (
      <section className="mb-8 md:mb-12">
        <div className="mb-4 md:mb-6">
          <h2 className="text-pure-white mb-2 tracking-[0.08em] leading-[1.45] uppercase font-bold text-sm md:text-[1rem]">
            Featured Bartenders
          </h2>
          <p className="text-soft-gray text-sm md:text-base leading-relaxed max-w-2xl">
            Meet talented creators from our community. Follow them to see their latest recipes and techniques.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-card rounded-organic-md animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (bartenders.length === 0) {
    return null;
  }

  return (
    <section className="mb-8 md:mb-12">
      <div className="mb-4 md:mb-6">
        <h2 className="text-pure-white mb-2 tracking-[0.08em] leading-[1.45] uppercase font-bold text-sm md:text-[1rem]">
          Featured Bartenders
        </h2>
        <p className="text-soft-gray text-sm md:text-base leading-relaxed max-w-2xl">
          Follow creators to see their latest recipes.
        </p>
      </div>
      
      <div className="relative">
        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {bartenders.map((bartender) => {
              const followerCount = 'follower_count' in bartender 
                ? bartender.follower_count 
                : bartender.total_follower_count;
              
              return (
                <CarouselItem key={bartender.user_id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                  <UserCard
                    userId={bartender.user_id}
                    username={bartender.username}
                    fullName={bartender.full_name}
                    avatarUrl={bartender.avatar_url}
                    bio={bartender.bio}
                    recipeCount={bartender.recipe_count}
                    followerCount={followerCount}
                    isCurrentUser={user?.id === bartender.user_id}
                  />
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-4" />
          <CarouselNext className="hidden md:flex -right-4" />
        </Carousel>
      </div>
    </section>
  );
}
