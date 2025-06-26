export default function Bubble({ text, from = "bot" }) {
  return (
    <div className={`bubble ${from}`}>
      {text}
    </div>
  );
}
