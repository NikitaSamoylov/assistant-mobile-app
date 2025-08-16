export const PromoBtnApp = () => {
  return (
    <button
      style={{
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        margin: '20px',
      }}
      onClick={() => alert('Кнопка из Next.js')}
    >
      кнопка из Next App
    </button>
  )
};