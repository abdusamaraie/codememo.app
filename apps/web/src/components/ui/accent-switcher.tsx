"use client"

const ACCENTS = [
  { name: "sky",    swatch: "#00a6f4" },
  { name: "blue",   swatch: "#2b7fff" },
  { name: "indigo", swatch: "#615fff" },
  { name: "teal",   swatch: "#00bba7" },
  { name: "green",  swatch: "#12b76a" },
  { name: "yellow", swatch: "#f0b100" },
  { name: "orange", swatch: "#fb6514" },
  { name: "red",    swatch: "#fb2c36" },
  { name: "rose",   swatch: "#ff2056" },
  { name: "gray",   swatch: "#6a7282" },
] as const

type AccentName = typeof ACCENTS[number]["name"]

export function AccentSwitcher() {
  function switchAccent(name: AccentName) {
    document.documentElement.setAttribute("data-accent", name)
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {ACCENTS.map(({ name, swatch }) => (
        <button
          key={name}
          title={name}
          onClick={() => switchAccent(name)}
          className="h-7 w-7 rounded-full border-2 border-white shadow ring-1 ring-black/10 hover:scale-110 transition-transform capitalize text-[0px]"
          style={{ background: swatch }}
        >
          {name}
        </button>
      ))}
    </div>
  )
}
