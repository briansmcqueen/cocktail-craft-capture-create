import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { Article, articlesService } from "@/services/articlesService";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import TagBadge from "@/components/ui/tag";
import MDEditor from '@uiw/react-md-editor';
import TurndownService from 'turndown';

type ArticleFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (article: Article) => void;
  article?: Article | null;
};

export default function ArticleForm({
  isOpen,
  onClose,
  onSave,
  article
}: ArticleFormProps) {
  const [title, setTitle] = useState(article?.title || "");
  const [content, setContent] = useState(article?.content || "");
  const [excerpt, setExcerpt] = useState(article?.excerpt || "");
  const [featuredImageUrl, setFeaturedImageUrl] = useState(article?.featured_image_url || "");
  const [sourceUrl, setSourceUrl] = useState(article?.source_url || "");
  const [sourceName, setSourceName] = useState(article?.source_name || "");
  
  const [tags, setTags] = useState<string[]>(article?.tags || []);
  const [newTag, setNewTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize Turndown service for converting HTML to Markdown
  const turndownService = new TurndownService({
    headingStyle: 'atx',
    hr: '---',
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
    fence: '```'
  });

  // Handle paste events to convert rich text to markdown
  const handlePaste = (event: ClipboardEvent) => {
    const clipboardData = event.clipboardData;
    if (!clipboardData) return;

    const htmlData = clipboardData.getData('text/html');
    const textData = clipboardData.getData('text/plain');

    // If we have HTML data, convert it to markdown
    if (htmlData && htmlData !== textData) {
      event.preventDefault();
      const markdown = turndownService.turndown(htmlData);
      
      // Get current cursor position and insert the markdown
      const textarea = event.target as HTMLTextAreaElement;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentContent = content;
        const newContent = 
          currentContent.substring(0, start) + 
          markdown + 
          currentContent.substring(end);
        
        setContent(newContent);
        
        // Set cursor position after the inserted text
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + markdown.length;
        }, 0);
      }
    }
  };

  const handleAddTag = () => {
    const tag = newTag.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Title and content are required.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const articleData = {
        title: title.trim(),
        content: content.trim(),
        excerpt: excerpt.trim() || undefined,
        featured_image_url: featuredImageUrl.trim() || undefined,
        source_url: sourceUrl.trim() || undefined,
        source_name: sourceName.trim() || undefined,
        is_published: true,
        published_at: new Date().toISOString(),
        tags,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      };

      let savedArticle: Article;
      if (article) {
        savedArticle = await articlesService.updateArticle(article.id, articleData);
        toast({
          title: "Article updated",
          description: "Your article has been updated successfully.",
        });
      } else {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error("User must be logged in to create articles");
        }
        
        savedArticle = await articlesService.createArticle({
          ...articleData,
          author_id: user.id
        });
        toast({
          title: "Article created",
          description: "Your article has been created successfully.",
        });
      }

      onSave(savedArticle);
      onClose();
    } catch (error) {
      console.error('Error saving article:', error);
      toast({
        title: "Error",
        description: "Failed to save article. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setExcerpt("");
    setFeaturedImageUrl("");
    setSourceUrl("");
    setSourceName("");
    
    setTags([]);
    setNewTag("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {article ? 'Edit Article' : 'Create New Article'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter article title"
              required
            />
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief description of the article"
              className="min-h-[80px]"
            />
          </div>

          {/* Featured Image URL */}
          <div className="space-y-2">
            <Label htmlFor="featuredImage">Featured Image URL</Label>
            <Input
              id="featuredImage"
              value={featuredImageUrl}
              onChange={(e) => setFeaturedImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              type="url"
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <div data-color-mode="light">
              <MDEditor
                value={content}
                onChange={(val) => setContent(val || "")}
                preview="edit"
                height={400}
                visibleDragbar={false}
                textareaProps={{
                  onPaste: handlePaste as any
                }}
              />
            </div>
          </div>

          {/* Source Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sourceName">Source Name</Label>
              <Input
                id="sourceName"
                value={sourceName}
                onChange={(e) => setSourceName(e.target.value)}
                placeholder="e.g., Difford's Guide"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sourceUrl">Source URL</Label>
              <Input
                id="sourceUrl"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="https://example.com/source"
                type="url"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a tag"
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleAddTag}
                variant="outline"
                disabled={!newTag.trim()}
              >
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <TagBadge
                    key={tag}
                    removable
                    onClick={() => handleRemoveTag(tag)}
                    className="bg-blue-100 text-blue-800 border border-blue-200 text-xs"
                  >
                    {tag}
                  </TagBadge>
                ))}
              </div>
            )}
          </div>


          {/* Submit Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !title.trim() || !content.trim()}
            >
              {isSubmitting ? 'Saving...' : (article ? 'Update Article' : 'Create Article')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}