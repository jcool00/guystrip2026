import React, { useState, useEffect } from "react";

export default function App() {
  // 15 default destinations
  const [destinations, setDestinations] = useState([
    "Miami",
    "Las Vegas",
    "Austin",
    "New Orleans",
    "Nashville",
    "Denver",
    "Chicago",
    "Los Angeles",
    "San Diego",
    "Orlando",
    "Montreal",
    "Cancun",
    "San Francisco",
    "Boston",
    "Seattle",
  ]);

  // Generate all weekends of 2026
  const generateWeekends = () => {
    const weekends = [];
    const year = 2026;
    let d = new Date(year, 0, 1); // Jan 1, 2026
    // Move to first Friday of the year
    while (d.getDay() !== 5) d.setDate(d.getDate() + 1);

    while (d.getFullYear() === year) {
      const start = new Date(d);
      const end = new Date(d);
      end.setDate(d.getDate() + 2); // Friday-Sunday
      const formatDate = (date) =>
        date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      weekends.push(`${formatDate(start)}–${formatDate(end)}`);
      d.setDate(d.getDate() + 7); // next Friday
    }
    return weekends;
  };

  const [weekends, setWeekends] = useState(generateWeekends());

  const [votes, setVotes] = useState({});
  const [finalTrip, setFinalTrip] = useState(null);

  // Initialize votes
  useEffect(() => {
    const initialVotes = {};
    destinations.forEach((d) => (initialVotes[d] = []));
    weekends.forEach((w) => (initialVotes[w] = []));
    setVotes(initialVotes);
  }, []);

  const handleVote = (option, value) => {
    setVotes((prev) => {
      const updated = { ...prev };
      updated[option] = [...(updated[option] || []), value];
      return updated;
    });
  };

  const calculateScores = () => {
    const destScores = destinations.map((d) => {
      const votesArr = votes[d] || [];
      const avg = votesArr.length
        ? votesArr.reduce((a, b) => a + b, 0) / votesArr.length
        : 0;
      return { name: d, score: avg };
    });

    const weekendScores = weekends.map((w) => {
      const votesArr = votes[w] || [];
      const avg = votesArr.length
        ? votesArr.reduce((a, b) => a + b, 0) / votesArr.length
        : 0;
      return { name: w, score: avg };
    });

    const topDest = destScores.reduce((a, b) => (a.score >= b.score ? a : b));
    const topWeekend = weekendScores.reduce((a, b) =>
      a.score >= b.score ? a : b
    );

    setFinalTrip({
      destination: topDest.name,
      weekend: topWeekend.name,
      emoji: "🛫",
    });
  };

  return (
    <div className="p-6 max-w-xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-4">
        Jagielkys, Exactly Guys Trip 2026 😎
      </h1>

      <div className="mb-6">
        <h2 className="font-semibold mb-2">Destinations</h2>
        {destinations.map((d) => (
          <div key={d} className="mb-2">
            <span>{d}</span>
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                key={val}
                className="ml-2 px-2 py-1 bg-blue-200 rounded hover:bg-blue-300"
                onClick={() => handleVote(d, val)}
              >
                {val} ⭐
              </button>
            ))}
            <span className="ml-2 text-gray-500">
              Votes: {votes[d]?.length || 0}
            </span>
          </div>
        ))}
      </div>

      <div className="mb-6 max-h-80 overflow-y-scroll">
        <h2 className="font-semibold mb-2">Weekends 2026</h2>
        {weekends.map((w) => (
          <div key={w} className="mb-1">
            <span>{w}</span>
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                key={val}
                className="ml-2 px-2 py-1 bg-green-200 rounded hover:bg-green-300"
                onClick={() => handleVote(w, val)}
              >
                {val} ⭐
              </button>
            ))}
            <span className="ml-2 text-gray-500">
              Votes: {votes[w]?.length || 0}
            </span>
          </div>
        ))}
      </div>

      <button
        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 mb-4 mt-4"
        onClick={calculateScores}
      >
        Calculate Best Trip
      </button>

      {finalTrip && (
        <div className="mt-4 p-4 bg-yellow-100 rounded">
          <h2 className="text-xl font-bold">Top Pick {finalTrip.emoji}</h2>
          <p>
            Destination: <strong>{finalTrip.destination}</strong>
          </p>
          <p>
            Weekend: <strong>{finalTrip.weekend}</strong>
          </p>
        </div>
      )}
    </div>
  );
}
