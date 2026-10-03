import {
  ArrowLeft,
  Construction,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import "./Placeholder.css";

interface PlaceholderProps {
  title: string;
}

export default function Placeholder({
  title,
}: PlaceholderProps) {
  const navigate = useNavigate();

  return (
    <div className="placeholder-page">
      <div className="placeholder-icon">
        <Construction size={38} />
      </div>

      <h2>{title}</h2>

      <p>
        This section is ready for the API
        integration.
      </p>

      <button
        onClick={() => navigate("/")}
      >
        <ArrowLeft size={17} />
        Back to Dashboard
      </button>
    </div>
  );
}
