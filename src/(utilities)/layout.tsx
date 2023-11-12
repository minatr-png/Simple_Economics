import styles from '../app/styles.module.css';

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
    // URL -> /shop/shoes/nike-air-max-97
    // `params` -> { tag: 'shoes', item: 'nike-air-max-97' }
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
  // URL -> /shop/shoes/nike-air-max-97
  // `params` -> { tag: 'shoes', item: 'nike-air-max-97' }
  return (
    <div className={styles.navigationGroup}>
      {children}
    </div>
  );
}