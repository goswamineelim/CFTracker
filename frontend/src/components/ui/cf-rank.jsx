const rankColors = {
  newbie: "#808080",
  pupil: "#008000",
  specialist: "#03a89e",
  expert: "#0000ff",
  "candidate master": "#aa00aa",
  master: "#ff8c00",
  "international master": "#ff8c00",
  grandmaster: "#ff0000",
  "international grandmaster": "#ff0000",
  "legendary grandmaster": "#ff0000",
};
const formatRank = (rank) => {
  if (!rank) return "";
  return rank
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
export const CFRank = ({ handle, rank, rating }) => {
  const color = rankColors[rank?.toLowerCase()] || "#000000";
  rank = formatRank(rank);
  return (
    <div className="grid flex-1 text-left text-sm leading-tight">
      <span className="truncate font-medium" style={{ color }}>
        {handle}
      </span>
      <span className="truncate text-xs">
        <span className="truncate font-medium" style={{ color }}>{rank}</span> 
        <span className="text-black">
            {` ( Rating: `}
            <span className="truncate font-medium" style={{ color }}>
                {rating}
            </span>
            {" )"}
        </span>
      </span>
    </div>
  );
};
