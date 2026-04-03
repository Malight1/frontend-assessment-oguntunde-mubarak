/**
 * Detail page loading skeleton.
 *
 * - Mirrors the hero layout (poster + info column) to prevent CLS.
 * - Shimmer animation signals activity without a bare spinner.
 */

import styles from "./loading.module.css";

export default function MovieDetailLoading() {
  return (
    <div className={styles.page}>
      <div className={styles.breadcrumb} />
      <div className={styles.hero}>
        <div className={styles.poster} />
        <div className={styles.info}>
          <div className={styles.titleLine} />
          <div className={styles.titleLineShort} />
          <div className={styles.metaRow}>
            <div className={styles.chip} />
            <div className={styles.chip} />
            <div className={styles.chip} />
          </div>
          <div className={styles.overview} />
          <div className={styles.overviewShort} />
        </div>
      </div>
    </div>
  );
}
