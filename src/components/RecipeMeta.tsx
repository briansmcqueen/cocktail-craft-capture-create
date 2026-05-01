import { Helmet } from "react-helmet-async";
import { Cocktail } from "@/data/classicCocktails";
import { getRecipeUrl } from "@/utils/slugUtils";

const FALLBACK_IMAGE =
  "https://qwfoumoaotswlzbzbcdt.supabase.co/storage/v1/object/public/recipe-images/americano.webp";
const SITE_URL = "https://barbook.io";

interface RecipeMetaProps {
  recipe: Cocktail;
}

/**
 * Sets per-recipe Open Graph and Twitter Card metadata so that
 * shared cocktail links render rich previews in browsers, iMessage,
 * Slack, X, Facebook and other platforms that scrape OG tags.
 */
export default function RecipeMeta({ recipe }: RecipeMetaProps) {
  const url = `${SITE_URL}${getRecipeUrl(recipe)}`;
  const image = recipe.image && recipe.image.startsWith("http") ? recipe.image : FALLBACK_IMAGE;

  const title = `${recipe.name} — Cocktail Recipe | Barbook`;
  const ingredientPreview = recipe.ingredients?.slice(0, 4).join(", ") ?? "";
  const description =
    (recipe.notes && recipe.notes.slice(0, 155)) ||
    `How to make a ${recipe.name}${ingredientPreview ? `: ${ingredientPreview}` : ""}.`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content="article" />
      <meta property="og:site_name" content="Barbook" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={`${recipe.name} cocktail`} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@barbook" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={`${recipe.name} cocktail`} />

      {/* Recipe structured data for richer previews on Google */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Recipe",
          name: recipe.name,
          image: [image],
          description,
          recipeCategory: "Cocktail",
          recipeCuisine: recipe.origin || undefined,
          recipeIngredient: recipe.ingredients,
          recipeInstructions: recipe.steps,
          author: recipe.creatorUsername
            ? { "@type": "Person", name: recipe.creatorUsername }
            : { "@type": "Organization", name: "Barbook" },
        })}
      </script>
    </Helmet>
  );
}
