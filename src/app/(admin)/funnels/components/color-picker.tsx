"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const COLORS = [
  { value: "#64748b", label: "border-slate-600" },
  { value: "#3b82f6", label: "border-blue-600" },
  { value: "#22c55e", label: "border-green-600" },
  { value: "#eab308", label: "border-yellow-600" },
  { value: "#f97316", label: "border-orange-600" },
  { value: "#ef4444", label: "border-red-600" },
  { value: "#a855f7", label: "border-purple-600" },
  { value: "#ec4899", label: "border-pink-600" },
];

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
}

const ColorPicker = ({ value, onChange }: ColorPickerProps) => {
  const [open, setOpen] = useState(false);
  const selectedColor = COLORS.find((color) => color.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "h-4 w-4 rounded-full border-2",
                selectedColor?.label
              )}
            />
            <span>{value}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="grid grid-cols-4 gap-2">
          {COLORS.map((color) => (
            <div
              key={color.value}
              className={cn(
                "flex h-8 w-full cursor-pointer items-center justify-center rounded-md border-2",
                color.label,
                value === color.value ? "ring-primary ring-2" : ""
              )}
              onClick={() => {
                onChange(color.value);
                setOpen(false);
              }}
            >
              {value === color.value && <Check className="h-4 w-4" />}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;
