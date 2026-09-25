import { initials, avatarColor } from "../utils";

type Props = {
  name: string;
  size?: number;
  online?: boolean;
  className?: string;
};

function Avatar({ name, size = 49, online, className = "" }: Props) {
  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: size, height: size }}>
      <div
        className="grid h-full w-full place-items-center rounded-full text-white"
        style={{
          background: avatarColor(name),
          fontSize: Math.max(12, size * 0.32),
          fontWeight: 600,
        }}
      >
        {initials(name)}
      </div>
      {online ? (
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-wa-panel bg-[#00a884]" />
      ) : null}
    </div>
  );
}

export default Avatar;
