import styles from './LoadingScreen.module.css';

export function LoadingScreen() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.spinner}></div>
        <h2 className={styles.text}>GENERATING YOUR QUESTIONS</h2>
        <p className={styles.subtext}>Powered by Claude</p>
      </div>
    </div>
  );
}
