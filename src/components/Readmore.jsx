import { useState } from "react";

const ReadMore = ({ text, children, wordLimit = 30 }) => {
  const [expanded, setExpanded] = useState(false);
  const fullText = text || (typeof children === "string" ? children : "");

  if (!fullText) return null;

  const words = fullText.trim().split(/\s+/);
  const isLong = words.length > wordLimit;
  const displayText = isLong && !expanded
    ? words.slice(0, wordLimit).join(" ") + " ..."
    : fullText;

    return (
        <p>
            {displayText}
            {isLong && (
            <span
                style={{ color: "blue", cursor: "pointer", marginLeft: "5px" }}
                onClick={() => setExpanded(!expanded)}
            >
                {expanded ? "Read Less" : "Read More"}
            </span>
            )}
        </p>
    );
};

export default ReadMore;
