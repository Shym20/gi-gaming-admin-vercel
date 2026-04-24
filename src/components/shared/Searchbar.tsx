import React from "react"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}) => {
  return (
    <div className={`relative  ${className}`}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full sm:w-64 md:w-80
          pl-10 pr-4 py-4
         
          bg-white
          focus:bg-gray-200
          focus:outline-none
          transition-colors
          border-2 border-black brutal-shadow
        "
      />

      <i className="ph ph-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-lg"></i>
    </div>
  )
}

export default SearchBar