import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import TopNavigation from "@/components/TopNavigation";
import Sidebar from "@/components/Sidebar";
import { BackButton } from "@/components/ui/back-button";
import { Shield } from "lucide-react";
import PageSEO from "@/components/PageSEO";

export default function Privacy() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="h-[100dvh] overflow-hidden bg-background">
      <PageSEO
        title="Privacy Policy | Barbook"
        description="How Barbook collects, uses, and protects your data — including cookieless analytics and locally stored bar inventory."
        path="/privacy"
      />
      <TopNavigation
        user={user}
        activeLibrary=""
        onLibrarySelect={() => {}}
        onAddRecipe={() => navigate("/")}
        onSignInClick={() => {}}
        onSignUpClick={() => {}}
        onProfileClick={() => user && navigate(`/user/${user.id}`)}
        onMyRecipesClick={() => navigate("/recipes/my-drinks")}
        onFavoritesClick={() => navigate("/favorites")}
      />

      <div className="flex h-full">
        <div className="hidden md:block">
          <Sidebar
            active=""
            onSelect={(library) => {
              if (library === "featured") navigate("/");
              else if (library === "all") navigate("/recipes");
              else if (library === "ingredients") navigate("/mybar");
              else if (library === "discover") navigate("/discover");
              else if (library === "favorites") navigate("/favorites");
              else if (library === "mine") navigate("/recipes/my-drinks");
            }}
            onAdd={() => navigate("/")}
            user={user}
          />
        </div>

        <div className="flex-1 overflow-auto">
          <main id="main-content" className="w-full h-full">
            <div className="max-w-3xl mx-auto px-5 sm:px-4 lg:px-6 py-6 lg:py-8 pb-24 md:pb-6">
              <BackButton onClick={() => navigate(-1)} />

              <div className="mb-8 mt-4 flex items-center gap-2.5">
                <Shield className="h-4 w-4 text-pure-white flex-shrink-0" />
                <h1 className="text-pure-white tracking-[0.08em] leading-[1.45] uppercase font-bold text-sm md:text-[1rem]">
                  Privacy Policy
                </h1>
              </div>

              <div className="space-y-6 text-light-text leading-relaxed">
                <p className="text-sm text-muted-foreground">Last updated: May 1, 2026</p>

                <section className="space-y-2">
                  <h2 className="text-lg font-semibold text-pure-white">What we collect</h2>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong className="text-pure-white">Account data:</strong> email address, username, display name, optional profile photo and bio</li>
                    <li><strong className="text-pure-white">Content you create:</strong> recipes, ratings, comments, favorites, follows</li>
                    <li><strong className="text-pure-white">Bar inventory:</strong> ingredients you add to "My Bar"</li>
                    <li><strong className="text-pure-white">Usage data:</strong> aggregated, privacy-friendly analytics (page views, no personal identifiers) via Plausible</li>
                    <li><strong className="text-pure-white">Local storage:</strong> session preferences such as remembered email, sidebar state, and onboarding progress</li>
                  </ul>
                </section>

                <section className="space-y-2">
                  <h2 className="text-lg font-semibold text-pure-white">How we use it</h2>
                  <p>
                    We use your data to operate Barbook: authenticating you, displaying your recipes and profile, powering
                    "what can I make" recommendations, and delivering social features like comments, ratings, and follows.
                    We do not sell your personal data.
                  </p>
                </section>

                <section className="space-y-2">
                  <h2 className="text-lg font-semibold text-pure-white">Who we share with</h2>
                  <p>
                    Barbook uses Supabase as its backend infrastructure provider (database, authentication, storage).
                    Supabase processes data on our behalf under their own security and privacy commitments. Plausible
                    receives anonymized analytics events. We don't share data with advertisers.
                  </p>
                </section>

                <section className="space-y-2">
                  <h2 className="text-lg font-semibold text-pure-white">Profile visibility</h2>
                  <p>
                    You control how visible your profile is in Settings → Privacy. Choose <strong className="text-pure-white">Public</strong>
                    {" "}(anyone can view), <strong className="text-pure-white">Followers only</strong>, or <strong className="text-pure-white">Private</strong>.
                    Your recipes inherit your profile's visibility.
                  </p>
                </section>

                <section className="space-y-2">
                  <h2 className="text-lg font-semibold text-pure-white">Cookies & tracking</h2>
                  <p>
                    Barbook uses essential cookies and localStorage to keep you signed in and remember preferences.
                    Our analytics provider (Plausible) does not use cookies and does not track you across sites.
                  </p>
                </section>

                <section className="space-y-2">
                  <h2 className="text-lg font-semibold text-pure-white">Your rights</h2>
                  <p>
                    You can access, edit, or delete your data at any time from Settings, or by emailing us. Account
                    deletion removes your profile and personal content; aggregated analytics may persist in
                    de-identified form.
                  </p>
                </section>

                <section className="space-y-2">
                  <h2 className="text-lg font-semibold text-pure-white">Children</h2>
                  <p>
                    Barbook is not intended for users under the legal drinking age in their jurisdiction.
                  </p>
                </section>

                <section className="space-y-2">
                  <h2 className="text-lg font-semibold text-pure-white">Contact</h2>
                  <p>
                    For privacy questions or data requests, email{" "}
                    <a href="mailto:hello@barbook.io" className="text-emerald hover:underline">
                      hello@barbook.io
                    </a>
                    .
                  </p>
                </section>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}