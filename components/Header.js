import Link from "next/link";

export default function Header() {
  return (
    <header>
      <nav>
        <ul className="flex space-x-4">
          <li><Link href="/dashboard">Dashboard</Link></li>
          <li><Link href="/chat">Chat</Link></li>
          <li><Link href="/group">Group</Link></li>
          <li><Link href="/notifications">Notifications</Link></li>
          <li><Link href="/tasks">Tasks</Link></li>
        </ul>
      </nav>
    </header>
  );
}
