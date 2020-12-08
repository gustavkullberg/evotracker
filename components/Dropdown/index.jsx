import { useRef } from "react";
import styles from "./dropdown.module.css";
import { useOutsideClick } from "../../utils";

export const Dropdown = ({ isOpen, options, label, setIsOpen, setClick }) => {
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  useOutsideClick(dropdownRef, () => {
    if (isOpen) {
      toggleDropdown();
    }
  });

  return (
    <div ref={dropdownRef} className={styles.dropdownContainer}>
      <button onClick={toggleDropdown} className={styles.button}>
        <span>{label}</span>
        <ion-icon
          name={isOpen ? "chevron-up-outline" : "chevron-down-outline"}
        />
      </button>
      {isOpen && (
        <div className={styles.dropdownList}>
          {options.map((option, idx) =>
            option !== label ? (
              <button
                key={idx}
                className={styles.button}
                onClick={() => setClick(option)}
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