import React from 'react';
import styles from './switch.module.css';

export const Switch = ({ isChecked, handleToggle }) => {
    return (
        <>
            <input
                className={styles.reactSwitch}
                type="checkbox"
                checked={isChecked}
            />
            <label
                className={styles.reactSwitchLabel}
                style={{ background: isChecked ? "#d60656" : '#06D6A0' }}
                htmlFor={"reactSwitch"}
                onClick={() => handleToggle(!isChecked)}
            >
                <span className={styles.reactSwitchButton} />
            </label>
        </>
    );
};
