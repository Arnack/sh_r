"use client"

import * as React from "react"
import { useState, useRef, useEffect } from "react"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// Sample data - replace with your actual data
const entities = [
  { code: "ABC", name: "Acme Business Corp" },
  { code: "BCD", name: "Blue Cloud Development" },
  { code: "CDE", name: "Creative Digital Enterprises" },
  { code: "DEF", name: "Dynamic Engineering Firm" },
  { code: "EFG", name: "Evergreen Financial Group" },
  { code: "FGH", name: "Future Growth Holdings" },
  { code: "GHI", name: "Global Healthcare Industries" },
  { code: "HIJ", name: "Horizon Innovation Junction" },
  { code: "IJK", name: "Infinite Journey Knowledge" },
  { code: "JKL", name: "Jade Kingdom Logistics" }
]

export interface AutocompleteProps {
  placeholder?: string
  maxResults?: number
}

export const Autocomplete = ({
  placeholder = "Search by code or name...",
  maxResults = 7,
}: AutocompleteProps) => {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [filteredItems, setFilteredItems] = useState(entities)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const filtered = entities.filter(item => 
      item.code.toLowerCase().includes(inputValue.toLowerCase()) ||
      item.name.toLowerCase().includes(inputValue.toLowerCase())
    )
    setFilteredItems(filtered.slice(0, maxResults))
    setSelectedIndex(filtered.length === 1 ? 0 : -1)
  }, [inputValue, maxResults])

  const highlightText = (text: string) => {
    if (!inputValue.trim()) return text
    
    const parts = text.split(new RegExp(`(${inputValue})`, 'gi'))
    
    return parts.map((part, i) => 
      part.toLowerCase() === inputValue.toLowerCase() ? (
        <span key={i} className="bg-yellow-200 dark:bg-yellow-800">{part}</span>
      ) : (
        part
      )
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < filteredItems.length - 1 ? prev + 1 : prev
        )
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev)
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0) {
          const selected = filteredItems[selectedIndex]
          setInputValue(selected.name)
          setOpen(false)
        }
        break
      case "Escape":
        setOpen(false)
        break
    }
  }

  const handleClear = () => {
    setInputValue("")
    inputRef.current?.focus()
  }

  const handleSelect = (item: typeof entities[0]) => {
    setInputValue(item.name)
    setOpen(false)
  }

  return (
    <div className="relative w-full max-w-lg">
      <div className="relative">
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
            setOpen(true)
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="w-full"
        />
        {inputValue && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear</span>
          </Button>
        )}
      </div>
      
      <Popover open={open && filteredItems.length > 0} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="h-0 w-0" />
        </PopoverTrigger>
        <PopoverContent 
          className="p-0 w-[var(--radix-popover-trigger-width)]" 
          align="start"
          sideOffset={5}
        >
          <Command>
            <CommandList>
              {filteredItems.length === 0 && (
                <CommandEmpty>No results found.</CommandEmpty>
              )}
              <CommandGroup>
                {filteredItems.map((item, index) => (
                  <CommandItem
                    key={item.code}
                    onSelect={() => handleSelect(item)}
                    className={cn(
                      "flex gap-10",
                      selectedIndex === index && "bg-accent"
                    )}
                  >
                    <span className="overflow-hidden text-ellipsis whitespace-nowrap font-medium text-muted-foreground text-sm">
                      {highlightText(item.code)}
                    </span>
                    <span className="overflow-hidden text-ellipsis whitespace-nowrap font-medium">
                      {highlightText(item.name)}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedIndex >= 0 && filteredItems.length > 0 && !open && (
        <p className="text-sm text-muted-foreground mt-1">
          {filteredItems[selectedIndex].name}
        </p>
      )}
    </div>
  )
}

export default Autocomplete;