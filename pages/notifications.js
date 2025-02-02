'use client';

import { useEffect, useState } from 'react';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/notifications');
        if (!response.ok) {
          throw new Error('Gagal mengambil data notifikasi');
        }
        const data = await response.json();
        setNotifications(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Notifikasi</h1>
      <ul className="bg-white shadow-md rounded-lg p-4">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <li key={notif.notifid} className="border-b last:border-none p-2">
              <p className="text-lg font-semibold">{notif.pesan}</p>
              <span className="text-gray-500 text-sm">{new Date(notif.tanggal).toLocaleDateString()}</span>
            </li>
          ))
        ) : (
          <p className="text-gray-600">Tidak ada notifikasi</p>
        )}
      </ul>
    </div>
  );
}
