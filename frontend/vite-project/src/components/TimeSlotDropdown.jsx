import React from "react";
import Select from "react-select";
import "../styles/timeslotdropdown.css";

// Generates an array of time slots between 07:00 and 23:00 in 30-minute intervals
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 7; hour <= 22; hour++) {
    slots.push(`${String(hour).padStart(2, "0")}:00`); // Add full-hour slots (e.g., 07:00, 08:00)
    slots.push(`${String(hour).padStart(2, "0")}:30`); // Add half-hour slots (e.g., 07:30, 08:30)
  }
  slots.push("23:00"); // Add the final slot for 23:00
  return slots.map((slot) => ({ value: slot, label: slot })); // Map slots to objects with `value` and `label`
};

const TimeSlotDropdown = ({ timeSlot, setTimeSlot, onBook }) => {
  const options = generateTimeSlots(); // List of available time slots

  return (
    <div>
      <Select
        options={options} // Backend Note: These time slots are static; however, dynamically available slots should be fetched from the server.
        value={options.find((o) => o.value === timeSlot)} // Backend Note: Selected slot should match an available slot from the server.
        onChange={(selectedOption) => setTimeSlot(selectedOption.value)} // Updates the selected time slot
        placeholder="Select a time slot" // Placeholder text for the dropdown
        className="time-slot-dropdown" // Custom styles applied through CSS
      />
      <button
        className="book-appointment-button"
        onClick={onBook} // Backend Note: This triggers the booking process, which should validate the selected slot.
      >
        Book Appointment
      </button>
    </div>
  );
};

export default TimeSlotDropdown;
