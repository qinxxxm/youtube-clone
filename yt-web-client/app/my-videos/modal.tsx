import styles from "./modal.module.css";
export const CustomModal = ({
  videoId,
  exitModalNo,
  exitModalYes,
}: {
  videoId: string;
  exitModalNo: () => void;
  exitModalYes: (videoId: string) => void;
}) => {
  return (
    <div className={styles.backshadow}>
      <div className={styles.modal}>
        <h3>Are you sure you want to delete this video?</h3>
        <div className={styles.choices}>
          <button className={styles.no} onClick={exitModalNo}>
            No
          </button>
          <button className={styles.yes} onClick={() => exitModalYes(videoId)}>
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};
