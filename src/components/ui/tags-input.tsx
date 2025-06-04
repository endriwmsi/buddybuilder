import { useState } from "react";
import { Badge } from "./badge";
import { X } from "lucide-react";

interface TagsInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function TagsInput({
  value,
  onChange,
  placeholder,
}: TagsInputProps) {
  const [inputValue, setInputValue] = useState("");
  const tags = value ? value.split(",").filter(Boolean) : [];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (newTag && !tags.includes(newTag)) {
        const newTags = [...tags, newTag];
        onChange(newTags.join(","));
      }
      setInputValue("");
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      const newTags = tags.slice(0, -1);
      onChange(newTags.join(","));
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    onChange(newTags.join(","));
  };

  return (
    <div className="dark:bg-input/30 flex flex-wrap gap-2 rounded-md border bg-transparent px-3 py-2 text-sm">
      {tags.map((tag) => (
        <Badge key={tag} variant="secondary" className="gap-1">
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="ring-offset-background focus:ring-ring ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2"
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Remove tag</span>
          </button>
        </Badge>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? placeholder : ""}
        className="placeholder:text-muted-foreground flex-1 outline-none"
      />
    </div>
  );
}
