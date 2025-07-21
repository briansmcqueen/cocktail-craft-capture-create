-- Create user roles enum and table
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create articles table
CREATE TABLE public.articles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image_url TEXT,
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    source_url TEXT,
    source_name TEXT,
    is_published BOOLEAN DEFAULT false,
    slug TEXT UNIQUE,
    tags TEXT[] DEFAULT '{}'::TEXT[]
);

-- Enable RLS on articles
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Create articles policies
CREATE POLICY "Published articles are viewable by everyone" 
ON public.articles 
FOR SELECT 
USING (is_published = true OR auth.uid() = author_id);

CREATE POLICY "Admins can insert articles" 
ON public.articles 
FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authors and admins can update their articles" 
ON public.articles 
FOR UPDATE 
USING (auth.uid() = author_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authors and admins can delete their articles" 
ON public.articles 
FOR DELETE 
USING (auth.uid() = author_id OR public.has_role(auth.uid(), 'admin'));

-- Create article_favorites table
CREATE TABLE public.article_favorites (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, article_id)
);

-- Enable RLS on article_favorites
ALTER TABLE public.article_favorites ENABLE ROW LEVEL SECURITY;

-- Create article_favorites policies
CREATE POLICY "Users can view their own article favorites" 
ON public.article_favorites 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own article favorites" 
ON public.article_favorites 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own article favorites" 
ON public.article_favorites 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create article_comments table
CREATE TABLE public.article_comments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on article_comments
ALTER TABLE public.article_comments ENABLE ROW LEVEL SECURITY;

-- Create article_comments policies
CREATE POLICY "Article comments are viewable by everyone" 
ON public.article_comments 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own article comments" 
ON public.article_comments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own article comments" 
ON public.article_comments 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own article comments" 
ON public.article_comments 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for user_roles
CREATE POLICY "Admins can view all user roles" 
ON public.user_roles 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert user roles" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update user roles" 
ON public.user_roles 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete user roles" 
ON public.user_roles 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- Create triggers for updated_at
CREATE TRIGGER update_articles_updated_at
BEFORE UPDATE ON public.articles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_article_comments_updated_at
BEFORE UPDATE ON public.article_comments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert admin role for briansmcqueen@gmail.com
-- Note: This will only work if the user exists in auth.users
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'briansmcqueen@gmail.com';
    
    IF admin_user_id IS NOT NULL THEN
        INSERT INTO public.user_roles (user_id, role) 
        VALUES (admin_user_id, 'admin')
        ON CONFLICT (user_id, role) DO NOTHING;
    END IF;
END $$;