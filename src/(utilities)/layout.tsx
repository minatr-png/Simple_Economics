import styles from '../app/(logged)/styles.module.css';

export function AddRecordLayout({
    children,
    params
}: {
    children: React.ReactNode
    params: {
      btnTitle: string,
      btnFunction
    }
}) {
    return (
      <div className={styles.inputsGroup}>
        {children}
        <button id="MainButton" onClick={params.btnFunction}>{params.btnTitle}</button>
      </div>
    );
}

export function NavButtonsLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className={styles.navigationGroup}>
      {children}
    </div>
  );
}