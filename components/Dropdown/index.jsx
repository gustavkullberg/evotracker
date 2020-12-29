import { useRef, useState } from "react";
import styles from "./dropdown.module.css";
import { useOutsideClick } from "../../utils";

export const Dropdown = ({ isOpen, options, label, setIsOpen, setClick, hasFilter }) => {
  const dropdownRef = useRef(null);
  const [text, setText] = useState("");

  const toggleDropdown = () => setIsOpen(!isOpen);

  useOutsideClick(dropdownRef, () => {
    if (isOpen) {
      toggleDropdown();
    }
  });

  return (
    <div ref={dropdownRef} className={styles.dropdownContainer}>
      <button onClick={toggleDropdown} className={styles.button} disabled={isOpen && hasFilter}>
        {isOpen && hasFilter ? <input type="text" onKeyUp={event => event.preventDefault()} value={text} onChange={event => setText(event.target.value)
        }></input> : <span>
            {label}
          </span>}
        <ion-icon
          name={isOpen ? "chevron-up-outline" : "chevron-down-outline"}
        />
      </button>
      {isOpen && (
        <div className={styles.dropdownList}>
          {options.map((option, idx) =>
            option !== label && option.toLowerCase().includes(text.toLowerCase()) ? (
              <button
                key={idx}
                className={styles.button}
                onClick={() => { setText(""); setClick(option) }}
              >
                {option}
              </button>
            ) : undefined
          )}
        </div>
      )}
    </div>
  );
};
