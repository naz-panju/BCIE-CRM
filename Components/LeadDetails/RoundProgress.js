import RoundProgress from './RoundProgress';

function MyComponent() {
  const [currentPercent, setCurrentPercent] = useState(75);

  const handleProgressChange = (newPercent) => {
    setCurrentPercent(newPercent);
  };

  return (
    <div>
      <RoundProgress percent={currentPercent} />
      <button onClick={() => handleProgressChange(50)}>Set to 50%</button>
    </div>
  );
}
