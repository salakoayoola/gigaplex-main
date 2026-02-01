"use client";

import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/Button";
import { Copy, RefreshCw, Delete } from "lucide-react";
import { cn } from "@/lib/utils";

const SPECIAL_CHARS = [
  { char: 'Ẹ', lower: 'ẹ', name: 'E with dot' },
  { char: 'Ọ', lower: 'ọ', name: 'O with dot' },
  { char: 'Ṣ', lower: 'ṣ', name: 'S with dot' },
  { char: 'Gb', lower: 'gb', name: 'Gb digraph' },
  { char: '́', lower: '́', name: 'High Tone (Acute)', isTone: true },
  { char: '̀', lower: '̀', name: 'Low Tone (Grave)', isTone: true },
  { char: '̄', lower: '̄', name: 'Mid Tone (Macron)', isTone: true },
];

export function YorubaKeyboard() {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertChar = (char: string, isTone: boolean = false) => {
    if (!textareaRef.current) return;

    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    
    // For tones, we might want to ensure they combine with previous char
    // But modern browsers handle combining diacritics well if just inserted
    
    const newText = text.substring(0, start) + char + text.substring(end);
    setText(newText);
    
    // Restore focus and cursor position after insertion
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newCursorPos = start + char.length;
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const clearText = () => {
    setText("");
    textareaRef.current?.focus();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-warm-sand/20 overflow-hidden">
      {/* Toolbar */}
      <div className="bg-warm-cream/50 p-4 border-b border-warm-sand/10 flex justify-between items-center">
        <h3 className="font-heading font-bold text-deep-forest">Yoruba Editor</h3>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={clearText} title="Clear text">
            <Delete className="h-4 w-4 text-stone-gray" />
          </Button>
          <Button variant="outline" size="sm" onClick={copyToClipboard} className="gap-2">
            <Copy className="h-4 w-4" />
            Copy
          </Button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="p-4">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing here..."
          className="w-full h-48 p-4 text-lg font-body bg-off-white rounded-xl border border-warm-sand/20 focus:outline-none focus:ring-2 focus:ring-terracotta/20 resize-y"
        />
      </div>

      {/* Virtual Keyboard */}
      <div className="bg-stone-50 p-4 border-t border-warm-sand/10">
        <p className="text-xs font-bold text-stone-gray uppercase tracking-wider mb-3">Special Characters & Tones</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Letters */}
          <div className="flex flex-wrap gap-2">
            {SPECIAL_CHARS.filter(c => !c.isTone).map((item) => (
              <div key={item.char} className="flex flex-col gap-2">
                <button
                  onClick={() => insertChar(item.char)}
                  className="h-12 w-12 flex items-center justify-center bg-white border border-stone-200 rounded-lg shadow-sm hover:bg-terracotta hover:text-white hover:border-terracotta transition-colors text-xl font-bold font-display"
                  title={item.name}
                >
                  {item.char}
                </button>
                <button
                  onClick={() => insertChar(item.lower)}
                  className="h-12 w-12 flex items-center justify-center bg-white border border-stone-200 rounded-lg shadow-sm hover:bg-terracotta hover:text-white hover:border-terracotta transition-colors text-xl font-body"
                  title={`Lowercase ${item.name}`}
                >
                  {item.lower}
                </button>
              </div>
            ))}
          </div>

          {/* Tones */}
          <div className="flex flex-col gap-2">
             <div className="flex gap-2">
                {SPECIAL_CHARS.filter(c => c.isTone).map((item) => (
                  <button
                    key={item.char}
                    onClick={() => insertChar(item.char, true)}
                    className="h-12 flex-1 flex items-center justify-center bg-warm-cream border border-warm-sand/30 rounded-lg shadow-sm hover:bg-wura-gold hover:text-deep-forest transition-colors text-2xl font-bold"
                    title={item.name}
                  >
                    ◌{item.char}
                  </button>
                ))}
             </div>
             <p className="text-xs text-stone-500 italic">
               Tip: Type the letter first, then click the tone mark to add it on top.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
