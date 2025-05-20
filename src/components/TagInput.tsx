
import React, { useState } from "react";
import { Tag } from "lucide-react";
import TagBadge from "./ui/tag";

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

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, i) => (
          <TagBadge
            key={tag}
            className="bg-muted"
            onClick={() => removeTag(i)}
            removable
          >
            {tag}
          </TagBadge>
        ))}
      </div>
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          className="px-2 py-1 border rounded flex-1"
          placeholder="Add tag and press enter"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button type="submit" className="bg-primary text-white px-2 rounded">
          <Tag size={16} />
        </button>
      </form>
    </div>
  );
}
