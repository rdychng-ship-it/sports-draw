import { useState } from 'react';

/**
 * Number input for how many courts the table has.
 *
 * @param {Object} props
 * @param {number} props.courts - The current number of courts
 * @param {(n: number) => void} props.onCourtsChange - Called with a valid new court count
 * @returns {JSX.Element} A labelled number input
 */
export default function UserInputs({ courts, onCourtsChange }) {
  // What's in the box right now; can be empty or invalid while typing
  const [text, setText] = useState(String(courts));

  function handleChange(e) {
    const value = e.target.value;
    setText(value);

    const n = Number(value);
    if (Number.isInteger(n) && n >= 1 && n <= 20) {
      onCourtsChange(n); // only pass valid numbers up
    }
  }

  return (
    <div>
      <label htmlFor="courts">Courts</label>
      <input
        id="courts"
        type="number"
        min="1"
        max="20"
        value={text}
        onChange={handleChange}
      />
    </div>
  );
}
