import React, { useState, useEffect } from "react";

const Admin = () => {
  const [slots, setSlots] = useState([]);
  const [editSlotId, setEditSlotId] = useState(null);

  // Form fields for editing
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");

  // Fetch all slots on mount
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        // Optionally include an Authorization header if needed
        // const token = localStorage.getItem("token");
        const response = await fetch("/admin/slots", {
          // headers: {
          //   Authorization: `Bearer ${token}`
          // }
        });
        if (!response.ok) {
          throw new Error("Failed to fetch slots");
        }
        const data = await response.json();
        setSlots(data);
      } catch (error) {
        console.error("Error fetching slots:", error);
      }
    };

    fetchSlots();
  }, []);

  // Handle delete (cancel)
  const handleDelete = async (slotId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      // const token = localStorage.getItem("token");
      const response = await fetch(`/admin/slots/${slotId}`, {
        method: "DELETE",
        // headers: {
        //   Authorization: `Bearer ${token}`
        // }
      });

      if (!response.ok) {
        throw new Error("Failed to delete slot");
      }
      // Remove the deleted slot from the UI
      setSlots(slots.filter((slot) => slot.id !== slotId));
      alert("Appointment canceled successfully.");
    } catch (error) {
      console.error("Error deleting slot:", error);
      alert("Failed to cancel the appointment. Please try again.");
    }
  };

  // Begin editing a slot
  const handleEdit = (slot) => {
    setEditSlotId(slot.id);
    // Initialize form fields with slot's current values
    setEditDate(slot.date);
    setEditTime(slot.time);
  };

  // Save changes to a slot (PUT request)
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // const token = localStorage.getItem("token");
      const response = await fetch(`/admin/slots/${editSlotId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          id: editSlotId, // must include ID if your backend requires it
          date: editDate,
          time: editTime,
          // ...any other fields your Slots model needs
        }),
      });

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg);
      }

      const updatedSlot = await response.json();
      // Update the slot in our local state
      setSlots((prevSlots) =>
        prevSlots.map((slot) => (slot.id === editSlotId ? updatedSlot : slot))
      );
      // Clear edit form
      setEditSlotId(null);
      setEditDate("");
      setEditTime("");
      alert("Appointment updated successfully. User will be notified!");
    } catch (error) {
      console.error("Error updating slot:", error);
      alert("Failed to update the appointment. Please try again.");
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditSlotId(null);
    setEditDate("");
    setEditTime("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin - All Booked Appointments</h1>

      <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>Slot ID</th>
            <th>Date</th>
            <th>Time</th>
            <th>User</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {slots.map((slot) => (
            <tr key={slot.id}>
              <td>{slot.id}</td>
              <td>{slot.date}</td>
              <td>{slot.time}</td>
              <td>
                {slot.user
                  ? `${slot.user.name} (${slot.user.email})`
                  : "Unknown User"}
              </td>
              <td>
                {/* If this slot is currently being edited, show a "Editing..." message instead of the Edit button */}
                {editSlotId === slot.id ? (
                  <span style={{ color: "orange" }}>Editing...</span>
                ) : (
                  <button onClick={() => handleEdit(slot)}>Edit</button>
                )}{" "}
                <button onClick={() => handleDelete(slot.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Editing Form */}
      {editSlotId && (
        <div style={{ marginTop: "20px" }}>
          <h2>Edit Slot</h2>
          <form onSubmit={handleSave}>
            <div style={{ marginBottom: "10px" }}>
              <label htmlFor="date">Date: </label>
              <input
                type="date"
                id="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label htmlFor="time">Time: </label>
              <input
                type="time"
                id="time"
                value={editTime}
                onChange={(e) => setEditTime(e.target.value)}
                required
              />
            </div>

            <button type="submit">Save Changes</button>
            <button type="button" onClick={handleCancelEdit} style={{ marginLeft: "10px" }}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Admin;
