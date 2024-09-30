import { LuLoader2 } from "react-icons/lu";

export default function Spinner({ size = 28 }) {
  return (
    <div className="spinIt">
      <LuLoader2 size={size} />
    </div>
  );
}
