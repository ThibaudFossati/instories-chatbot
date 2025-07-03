import './Button.css';

export default function Button({ onClick }) {
  return (
    <button
      className="send"
      type="submit"
      onClick={onClick}
      aria-label="Envoyer le message"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M2 21 23 12 2 3l5 9-5 9z" />
      </svg>
    </button>
  );
}
