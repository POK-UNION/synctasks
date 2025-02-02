"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FaTrash, FaUserPlus, FaUserMinus } from "react-icons/fa";

export default function GroupPage() {
  const [groups, setGroups] = useState([]);
  const [newGroup, setNewGroup] = useState({ namaGroup: "", deskripsi: "" });
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [showPopup, setShowPopup] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [errors, setErrors] = useState({ namaGroup: false, deskripsi: false });
  const router = useRouter();

  useEffect(() => {
    fetch("/api/group/list")
      .then((res) => res.json())
      .then((data) => setGroups(data));

    fetch("/api/user/list")
      .then((res) => res.json())
      .then((data) => setAllUsers(data));
  }, []);

  const validateForm = () => {
    let valid = true;
    let newErrors = { namaGroup: false, deskripsi: false };

    if (!newGroup.namaGroup.trim()) {
      newErrors.namaGroup = true;
      valid = false;
    }
    if (!newGroup.deskripsi.trim()) {
      newErrors.deskripsi = true;
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const createGroup = async () => {
    if (!validateForm()) return;

    const response = await fetch("/api/group/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newGroup),
    });

    if (response.ok) {
      const newGroupData = await response.json();
      setGroups([...groups, newGroupData]); // Update state tanpa reload
      setNewGroup({ namaGroup: "", deskripsi: "" }); // Reset input
    }
  };

  const deleteGroup = async (groupID) => {
    await fetch("/api/group/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groupID }),
    });

    window.location.reload();
  };

  const updateMember = async (action, groupID) => {
    const apiEndpoint =
      action === "add" ? "/api/group/addMember" : "/api/group/removeMember";

    for (const userID of selectedUsers) {
      await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupID, userID }),
      });
    }

    setShowPopup(null);
    window.location.reload();
  };

  const openChat = (groupID) => {
    router.push(`/chat?groupID=${groupID}`);
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Group Management</h1>

      <div className="mb-4 flex space-x-2">
        <input
          className={`border p-2 ${
            errors.namaGroup ? "border-red-500" : "border-gray-300"
          }`}
          placeholder={
            errors.namaGroup ? "Nama grup harus diisi!" : "Nama Group"
          }
          value={newGroup.namaGroup}
          onChange={(e) => {
            setNewGroup({ ...newGroup, namaGroup: e.target.value });
            if (errors.namaGroup) setErrors({ ...errors, namaGroup: false }); // Hapus error saat user mengetik
          }}
        />

        <input
          className={`border p-2 ${
            errors.deskripsi ? "border-red-500" : "border-gray-300"
          }`}
          placeholder={
            errors.deskripsi ? "Deskripsi harus diisi!" : "Deskripsi"
          }
          value={newGroup.deskripsi}
          onChange={(e) => {
            setNewGroup({ ...newGroup, deskripsi: e.target.value });
            if (errors.deskripsi) setErrors({ ...errors, deskripsi: false }); // Hapus error saat user mengetik
          }}
        />

        <button onClick={createGroup} className="bg-blue-500 text-white p-2">
          Buat Grup
        </button>
      </div>

      <ul>
        {groups.map((group) => (
          <li
            key={group.groupID}
            className="p-2 border relative"
            onClick={() => openChat(group.groupID)}
          >
            <h3 className="font-semibold">{group.namaGroup}</h3>
            <p>{group.deskripsi}</p>
            <div className="absolute top-2 right-2 flex space-x-2">
              <button
                onClick={() => deleteGroup(group.groupID)}
                className="flex items-center"
              >
                <FaTrash />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedGroup(group.groupID);
                  setShowPopup("remove");
                }}
                className="flex items-center"
              >
                <FaUserMinus />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedGroup(group.groupID);
                  setShowPopup("add");
                }}
                className="flex items-center"
              >
                <FaUserPlus />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {showPopup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-5 rounded">
            <h2 className="text-xl mb-4">
              {showPopup === "add" ? "Tambah Anggota" : "Hapus Anggota"}
            </h2>
            <div className="max-h-60 overflow-y-auto">
              {allUsers.map((user) => (
                <div key={user.userID}>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.userID)}
                    onChange={() => {
                      setSelectedUsers((prev) =>
                        prev.includes(user.userID)
                          ? prev.filter((id) => id !== user.userID)
                          : [...prev, user.userID]
                      );
                    }}
                  />
                  {user.name}
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setShowPopup(null)}
                className="bg-gray-500 text-white p-2 rounded"
              >
                Batal
              </button>
              <button
                onClick={() => updateMember(showPopup, selectedGroup)}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
