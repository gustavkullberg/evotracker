import styles from '../styles/Home.module.css';

const filters = ['1D', '7D'];

export const TimeFilters = ({ selectedFilter, setFilterClick }) => {
    return <div className={styles.filterTilesContainer}>
        <div className={styles.filterTiles}>
            {filters.map((f, idx) => (
                <div key={idx}>
                    <h4
                        style={{
                            backgroundColor: selectedFilter === f ? '#1b2631' : 'white',
                            color: selectedFilter === f ? 'white' : '#1b2631',
                        }}
                        onClick={() => setFilterClick(f)}
                    >
                        {f}
                    </h4>
                </div>
            ))}
        </div>
    </div>
}