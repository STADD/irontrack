
import { Bell, Search } from "lucide-react";

export default function Header() {
  return (
    <header className="flex h-20 items-center justify-between border-b border-zinc-800 px-8">
      <div>
        <h2 className="text-xl font-semibold text-white">
          Your training overview
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="rounded-xl border border-zinc-800 p-2.5 text-zinc-400 hover:bg-zinc-800">
          <Bell size={19} />
        </button>
      </div>
    </header>
  );
}
