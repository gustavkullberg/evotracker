import { useState } from "react";
import styles from "./subscribeButton.module.css";

export const SubscribeButton = ({ onClickFunction }) => {
    const [mouseEntered, setMouseEntered] = useState(false);


    return (
        <div className={styles.subscribeButtonContainer}>
            <button onMouseEnter={() => setMouseEntered(true)} onMouseLeave={() => setMouseEntered(false)} className={styles.subscribeButton} onClick={onClickFunction}>
                {mouseEntered ?
                    <ion-icon size="large" name="notifications" /> :
                    <ion-icon size="large" name="notifications-outline" />
                }
            </button>
        </div>
    );
};