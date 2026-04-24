import React from "react"

interface Accessory {
  item: string
  qty: number
}

interface Props {
  accessories: Accessory[]
  setAccessories: React.Dispatch<React.SetStateAction<Accessory[]>>
}

const CreateAccessoriesRows: React.FC<Props> = ({
  accessories,
  setAccessories
}) => {
  const removeRow = (index: number) => {
    setAccessories((prev) => prev.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, value: string) => {
    setAccessories((prev) =>
      prev.map((acc, i) =>
        i === index ? { ...acc, item: value } : acc
      )
    )
  }

  const updateQty = (index: number, value: number) => {
    setAccessories((prev) =>
      prev.map((acc, i) =>
        i === index ? { ...acc, qty: value } : acc
      )
    )
  }

  const addRow = () => {
    setAccessories((prev) => [...prev, { item: "", qty: 1 }])
  }

  return (
    <>
      {accessories.map((acc, index) => (
        <div
          key={index}
          className="flex gap-2 mb-2 items-center"
        >
          <input
            type="text"
            value={acc.item}
            onChange={(e) =>
              updateItem(index, e.target.value)
            }
            className="brutal-input flex-1 text-xs"
            required
          />

          <input
            type="number"
            value={acc.qty}
            min={1}
            onChange={(e) =>
              updateQty(index, Number(e.target.value))
            }
            className="brutal-input w-20 text-xs"
            required
          />

          <button
            type="button"
            onClick={() => removeRow(index)}
            className="brutal-btn bg-[#ff3366] text-white px-2 py-1 text-xs shadow-none border-b-2"
          >
            🗑
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addRow}
        className="brutal-btn bg-white text-xs px-2 py-1 shadow-none border-dashed border-2 border-black"
      >
        + Add Item
      </button>
    </>
  )
}

export default CreateAccessoriesRows