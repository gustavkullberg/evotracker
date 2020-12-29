import { useRef } from "react";
import styles from "./datanotice.module.css";
import { useOutsideClick } from "../../utils";

export const DataNotice = () => {
  const dropdownRef = useRef(null);

  /* 
    useOutsideClick(dropdownRef, () => {
      if (isOpen) {
        toggleDropdown();
      }
    }); */

  return (
    <div className={styles.dataNoticeContainer}>
      <div className={styles.dataNoticeBox}>
        <ion-icon name="alert-circle-outline"></ion-icon>
        <p>This application does not guarantee the exactness of data. The data is collected from William Hill, and does represent international tables and/or studios. This does not include North American tables. The term "All Shows" does not represent all of Evolutions tables, it simply represent tables and shows that are being tracked by this application, which is around 80. Nor does it represent any revenue, it simply tracks players in the lobby</p>
        <div className={styles.closeButton}>

          <ion-icon name="close-circle-outline"></ion-icon>

        </div>
      </div>

    </div>
  );
};
