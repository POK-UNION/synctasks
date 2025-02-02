'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Home, MessageCircle, Bell, Users, List } from 'lucide-react';
import Chat from './chat';
import Notifikasi from './notifications';
import Group from './group';
import Tasks from './tasks';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("session"));
    if (!session) {
      router.push("/login");
    } else {
      setUser(session);
    }

    // Retrieve the saved tab state from localStorage
    const savedTab = localStorage.getItem('selectedTab');
    if (savedTab) {
      setActiveTab(savedTab);
    }

    // Add event listeners for tab clicks
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', (event) => {
        const selectedTab = event.target.id;
        setActiveTab(selectedTab);
        localStorage.setItem('selectedTab', selectedTab);
      });
    });

    return () => {
      // Clean up event listeners
      tabs.forEach(tab => {
        tab.removeEventListener('click', () => {});
      });
    };
  }, [router]);

  useEffect(() => {
    console.log("User:", user);
    console.log("Active Tab:", activeTab);
  }, [user, activeTab]);

  const handleLogoff = () => {
    localStorage.removeItem("session");
    router.push("/login");
  };

  const menuItems = [
    { name: 'Dashboard', icon: <Home size={20} />, id: 'dashboard' },
    { name: 'Chat', icon: <MessageCircle size={20} />, id: 'chat' },
    { name: 'Notifikasi', icon: <Bell size={20} />, id: 'notifikasi' },
    { name: 'Group', icon: <Users size={20} />, id: 'group' },
    { name: 'Tugas', icon: <List size={20} />, id: 'tugas' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-5 flex flex-col">
        <h2 className="text-2xl font-bold text-blue-600 text-center mb-8">SyncTask</h2>
        <nav className="flex flex-col space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              id={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`tab flex items-center p-3 rounded-lg transition ${
                activeTab === item.id ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              {item.icon}
              <span className="ml-3">{item.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="flex justify-end items-center mb-4">
          {user && (
            <>
              <img
                src={`https://ui-avatars.com/api/?name=${user.email}&background=random`}
                alt="User Avatar"
                className="w-10 h-10 rounded-full mr-2"
              />
              <span className="mr-4">{user.email}</span>
              <button onClick={handleLogoff} className="bg-red-500 text-white px-4 py-2 rounded">Logoff</button>
            </>
          )}
        </div>
        {activeTab === 'dashboard' && <h1 className="text-3xl font-semibold">Selamat Datang di Dashboard</h1>}
        {activeTab === 'chat' && <Chat userName={user ? user.name : ''} />}
        {activeTab === 'notifikasi' && <Notifikasi />}
        {activeTab === 'group' && <Group />}
        {activeTab === 'tugas' && <Tasks />}
      </div>
    </div>
  );
}