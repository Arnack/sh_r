"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Input } from "@/components/ui/input"

// Define the entity type
interface Entity {
  code: string
  name: string
}

// Sample data
const entities: Entity[] = [
  { code: "001", name: "Apple Inc." },
  { code: "002", name: "Microsoft Corporation" },
  { code: "003", name: "Amazon" },
  { code: "004", name: "Google" },
  { code: "005", name: "Facebook" },
  { code: "006", name: "Tesla" },
  { code: "007", name: "Netflix" },
  { code: "008", name: "Adobe" },
  { code: "009", name: "Intel" },
  { code: "010", name: "IBM" },
]

export default function Autocomplete() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [inputValue, setInputValue] = useState("")
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)
  const [filteredEntities, setFilteredEntities] = useState<Entity[]>(entities)
  const commandRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const itemsRef = useRef<(HTMLDivElement | null)[]>([])

  // Get display value for the selected entity
  const getDisplayValue = () => {
    if (!value) return ""
    const entity = entities.find((entity) => entity.code === value)
    return entity ? `${entity.code} - ${entity.name}` : ""
  }

  // Filter entities based on input
  useEffect(() => {
    if (inputValue) {
      const filtered = entities.filter(
        (entity) =>
          entity.code.toLowerCase().includes(inputValue.toLowerCase()) ||
          entity.name.toLowerCase().includes(inputValue.toLowerCase()),
      )
      setFilteredEntities(filtered)

      // Auto-highlight the only result
      if (filtered.length === 1) {
        setHighlightedIndex(0)
      } else {
        setHighlightedIndex(-1)
      }

      // Open dropdown when typing
      setOpen(true)
    } else {
      setFilteredEntities(entities)
      setHighlightedIndex(-1)

      // Close dropdown if there's a selected value but no input
      if (value) {
        setOpen(false)
      }
    }
  }, [inputValue, value])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent arrow keys from moving cursor in input when dropdown is open
    if (open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault()
    }

    if (!open && e.key !== "Escape" && e.key !== "Tab") {
      setOpen(true)
    }

    switch (e.key) {
      case "ArrowDown":
        if (open) {
          e.preventDefault()
          setHighlightedIndex((prevIndex) => (prevIndex < filteredEntities.length - 1 ? prevIndex + 1 : 0))
        }
        break
      case "ArrowUp":
        if (open) {
          e.preventDefault()
          setHighlightedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : filteredEntities.length - 1))
        }
        break
      case "Enter":
        if (open && highlightedIndex >= 0 && highlightedIndex < filteredEntities.length) {
          e.preventDefault()
          const selectedEntity = filteredEntities[highlightedIndex]
          setValue(selectedEntity.code)
          setInputValue(`${selectedEntity.code} - ${selectedEntity.name}`)
          setOpen(false)
        }
        break
      case "Escape":
        e.preventDefault()
        setOpen(false)
        break
    }
  }

  // Clear the input and selected value
  const handleClear = () => {
    setValue("")
    setInputValue("")
    setOpen(false)
    inputRef.current?.focus()
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)

    // If input is cleared, also clear the selected value
    if (!newValue) {
      setValue("")
    }
  }

  // Handle item selection
  const handleSelect = (entity: Entity) => {
    setValue(entity.code)
    setInputValue(`${entity.code} - ${entity.name}`)
    setOpen(false)
  }

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && itemsRef.current[highlightedIndex]) {
      itemsRef.current[highlightedIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      })
    }
  }, [highlightedIndex])

  // Reset refs when filtered entities change
  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, filteredEntities.length)
  }, [filteredEntities])

  return (
    <div className="w-full max-w-md relative">
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search by code or name..."
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => {
            if (!value) setOpen(true)
          }}
          onKeyDown={handleKeyDown}
          className="w-full pr-10"
          aria-expanded={open}
          aria-autocomplete="list"
        />
        {(inputValue || value) && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear input"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {open && (
        <div className="absolute z-50 w-full mt-1 bg-popover shadow-md rounded-md border">
          <Command ref={commandRef} className="w-full">
            {filteredEntities.length > 0 && <CommandList className="max-h-60 overflow-y-auto">
                <CommandGroup>
                  {filteredEntities.map((entity, index) => (
                    <CommandItem
                      key={entity.code}
                      ref={(el) => (itemsRef.current[index] = el)}
                      value={`${entity.code} ${entity.name}`}
                      onSelect={() => handleSelect(entity)}
                      className={cn("flex items-center gap-2 px-2 py-1.5", highlightedIndex === index && "bg-accent")}
                    >
                      <Check className={cn("h-4 w-4", value === entity.code ? "opacity-100" : "opacity-0")} />
                      <span className="font-medium">{entity.code}</span>
                      <span className="text-muted-foreground">{entity.name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
            </CommandList>}
          </Command>
        </div>
      )}
    </div>
  )
}
