
import React, { useState } from "react";
import { Tag } from "lucide-react";
import TagBadge from "./ui/tag";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

type TagInputProps = {
  value: string[];
  onChange: (tags: string[]) => void;
};

export default function TagInput({ value, onChange }: TagInputProps) {
  const [input, setInput] = useState("");
  const tags = value || [];

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const tag = input.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      onChange([...tags, tag]);
      setInput("");
    }
  }

  function removeTag(idx: number) {
    const newTags = [...tags];
    newTags.splice(idx, 1);
    onChange(newTags);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const tag = input.trim().toLowerCase();
      if (tag && !tags.includes(tag)) {
        onChange([...tags, tag]);
        setInput("");
      }
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, i) => (
          <TagBadge
            key={`${tag}-${i}`}
            className="bg-muted text-white cursor-pointer"
            onClick={() => removeTag(i)}
            removable
          >
            {tag}
          </TagBadge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Add tag and press enter"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
        />
        <Button type="button" onClick={handleAdd} size="sm" variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300">
          <Tag size={16} />
        </Button>
      </div>
    </div>
  );
}
