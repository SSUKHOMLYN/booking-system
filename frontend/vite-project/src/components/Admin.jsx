import React, { useState, useEffect } from "react";
import "../styles/admin.css";

const Admin = () => {
  const [users, setUsers] = useState([]); // Users for dropdown (if needed)
  const [slots, setSlots] = useState([]); // All booked appointments
  const [selectedSlot, setSelectedSlot] = useState(null); // Slot selected for update
  const [selectedDate, setSelectedDate] = useState(""); // Updated date
  const [selectedTime, setSelectedTime] = useState(""); // Updated time
  const [error, setError] = useState(""); // Error handling

  // Fetch all booked slots on component mount
  useEffect(() => {
    fetchAllSlots();
  }, []);

  const fetchAllSlots = async () => {
    try {
      const response = await fetch("/admin/slots"); // Fetch booked slots
      if (!response.ok) throw new Error("Failed to fetch slots.");
      const data = await response.json();
      setSlots(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (slotId) => {
    try {
      const response = await fetch(`/admin/slots/${slotId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete slot.");
      alert("Slot deleted successfully.");
      fetchAllSlots(); // Refresh the list
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async (slotId) => {
    const updatedDateTime = new Date(`${selectedDate}T${selectedTime}`);
    const updatedSlot = {
      ...selectedSlot,
      datetime: updatedDateTime.toISOString(),
    };

    try {
      const response = await fetch(`/admin/slots/${slotId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSlot),
      });
      if (!response.ok) throw new Error("Failed to update slot.");
      alert("Slot updated successfully.");
      fetchAllSlots(); // Refresh the list
      setSelectedSlot(null); // Reset selection
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Appointment Management</h1>

      {/* Error display */}
      {error && <p className="text-red-500">{error}</p>}

      {/* List of booked slots */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Booked Slots</h2>
        {slots.length === 0 ? (
          <p>No slots found.</p>
        ) : (
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Slot ID</th>
                <th className="border border-gray-300 px-4 py-2">User ID</th>
                <th className="border border-gray-300 px-4 py-2">
                  Date & Time
                </th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {slots.map((slot) => (
                <tr key={slot.id}>
                  <td className="border border-gray-300 px-4 py-2">
                    {slot.id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {slot.userId}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(slot.datetime).toLocaleString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => handleDelete(slot.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 ml-2"
                      onClick={() => setSelectedSlot(slot)}
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Update form */}
      {selectedSlot && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h3 className="text-lg font-bold mb-4">Update Slot</h3>
          <label className="block mb-2">Date:</label>
          <input
            type="date"
            className="w-full p-2 border rounded mb-4"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />

          <label className="block mb-2">Time:</label>
          <input
            type="time"
            className="w-full p-2 border rounded mb-4"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
          />

          <div className="flex gap-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => handleUpdate(selectedSlot.id)}
            >
              Update
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              onClick={() => setSelectedSlot(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
