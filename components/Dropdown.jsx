import styles from '../styles/Home.module.css';

export const Dropdown = ({ isOpen, options, label, setIsOpen, setClick }) => {
    return <div>
        <button
            className={styles.gameButton}
            style={{ marginBottom: '3px', boxShadow: 'rgba(0, 0, 0, 0.5) 7px 7px 10px 0px' }}
            onClick={() => setIsOpen(!isOpen)}
        >
            {label}
            <span style={{ marginLeft: '0.5rem' }}>
                <ion-icon name={isOpen ? 'chevron-up-outline' : 'chevron-down-outline'} />
            </span>
        </button>

        <div className={styles.buttonDropdown}>
            {isOpen &&
                options.map((f, idx) =>
                    f !== label ? (
                        <button key={idx} className={styles.gameButton} onClick={() => setClick(f)}>
                            {f}
                        </button>
                    ) : undefined
                )}
        </div>
    </div>
}