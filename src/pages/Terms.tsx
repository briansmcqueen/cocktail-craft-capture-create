import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import TopNavigation from "@/components/TopNavigation";
import Sidebar from "@/components/Sidebar";
import { BackButton } from "@/components/ui/back-button";
import { FileText } from "lucide-react";
import PageSEO from "@/components/PageSEO";

export default function Terms() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="h-[100dvh] overflow-hidden bg-background">
      <PageSEO
        title="Terms of Service | Barbook"
        description="Read the Barbook terms of service covering account use, age requirements, and content rules for our cocktail community."
        path="/terms"
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
                <FileText className="h-4 w-4 text-pure-white flex-shrink-0" />
                <h1 className="text-pure-white tracking-[0.08em] leading-[1.45] uppercase font-bold text-sm md:text-[1rem]">
                  Terms of Service
                </h1>
              </div>

              <div className="space-y-6 text-light-text leading-relaxed">
                <p className="text-sm text-muted-foreground">Last updated: May 3, 2026</p>

                <section className="space-y-2">
                  <h2 className="text-lg font-semibold text-pure-white">1. Welcome to Barbook</h2>
                  <p>
                    Barbook ("we", "us") provides a digital cocktail companion that lets you discover, create, save,
                    and share cocktail recipes. By creating an account or using the service, you agree to these Terms.
                    If you don't agree, please don't use Barbook.
                  </p>
                </section>

                <section className="space-y-2">
                  <h2 className="text-lg font-semibold text-pure-white">2. Your account</h2>
                  <p>
                    You must be of legal drinking age in your jurisdiction to use Barbook. You are responsible for
                    safeguarding your password and for any activity under your account. Notify us immediately if you
                    suspect unauthorized use.
                  </p>
                </section>

                <section className="space-y-2">
                  <h2 className="text-lg font-semibold text-pure-white">3. Your content</h2>
                  <p>
                    You retain ownership of recipes, photos, comments, ratings, and other content you post ("Your
                    Content"). By posting Your Content, you grant Barbook a worldwide, non-exclusive, royalty-free
                    license to host, display, reproduce, and distribute it within the service for the purpose of
                    operating and promoting Barbook.
                  </p>
                  <p>
                    You represent that Your Content is yours to share and does not infringe anyone else's rights.
                  </p>
                </section>

                <section className="space-y-2">
                  <h2 className="text-lg font-semibold text-pure-white">4. Acceptable use</h2>
                  <p>You agree not to:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Post unlawful, harmful, harassing, or hateful content</li>
                    <li>Spam, scrape, or abuse the service</li>
                    <li>Impersonate others or misrepresent your affiliation</li>
                    <li>Attempt to bypass security, rate limits, or access controls</li>
                    <li>Promote dangerous or excessive alcohol consumption</li>
                  </ul>
                </section>

                <section className="space-y-2">
                  <h2 className="text-lg font-semibold text-pure-white">5. Termination</h2>
                  <p>
                    We may suspend or terminate accounts that violate these Terms. You may delete your account at any
                    time from Settings; we will remove your personal data as described in our Privacy Policy.
                  </p>
                </section>

                <section className="space-y-2">
                  <h2 className="text-lg font-semibold text-pure-white">6. Disclaimers</h2>
                  <p>
                    Barbook is provided "as is" without warranties of any kind. Recipes are user-generated and for
                    personal, non-commercial use. Drink responsibly. We are not liable for any damages arising from
                    your use of the service to the maximum extent allowed by law.
                  </p>
                </section>

                <section className="space-y-2">
                  <h2 className="text-lg font-semibold text-pure-white">7. Changes</h2>
                  <p>
                    We may update these Terms from time to time. Continued use after changes means you accept the
                    updated Terms.
                  </p>
                </section>

                <section className="space-y-2">
                  <h2 className="text-lg font-semibold text-pure-white">8. Contact</h2>
                  <p>
                    Questions? Reach us at{" "}
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