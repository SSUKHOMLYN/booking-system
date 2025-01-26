import React, { useState, useEffect } from 'react';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');

  // Fetch users from database
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  // Generate time options (07:00 AM - 10:30 PM with 30min intervals)
  const generateTimeOptions = () => {
    const times = [];
    let startTime = 7 * 60; // 7:00 AM in minutes
    const endTime = 22 * 60 + 30; // 10:30 PM in minutes

    while (startTime <= endTime) {
      const hours = Math.floor(startTime / 60);
      const minutes = startTime % 60;
      const period = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const timeString = `${formattedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
      
      times.push(<option key={startTime} value={timeString}>{timeString}</option>);
      startTime += 30;
    }

    return times;
  };

  const handleUpdate = async () => {
    // Combine date and time into a single datetime object
    const appointmentDate = new Date(
      `${selectedYear}-${selectedMonth.padStart(2, '0')}-${selectedDay.padStart(2, '0')}T${selectedTime}`
    );

    // Send update to backend
    try {
      const response = await fetch('/api/appointments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedUserId,
          datetime: appointmentDate.toISOString(),
        }),
      });

      if (response.ok) {
        alert('Appointment updated successfully');
        // Reset form or navigate away
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const handleCancel = () => {
    // Reset form or navigate back
    setSelectedDay('');
    setSelectedMonth('');
    setSelectedYear('');
    setSelectedTime('');
    setSelectedUserId('');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Appointment Management</h1>
      
      <div className="space-y-4">
        {/* Date Selection */}
        <div className="flex gap-4">
          <select 
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="flex-1 p-2 border rounded"
            required
          >
            <option value="">Day</option>
            {Array.from({length: 31}, (_, i) => (
              <option key={i+1} value={i+1}>{i+1}</option>
            ))}
          </select>

          <select 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="flex-1 p-2 border rounded"
            required
          >
            <option value="">Month</option>
            {Array.from({length: 12}, (_, i) => (
              <option key={i+1} value={i+1}>
                {new Date(0, i).toLocaleString('default', {month: 'long'})}
              </option>
            ))}
          </select>

          <select 
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="flex-1 p-2 border rounded"
            required
          >
            <option value="">Year</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
          </select>
        </div>

        {/* Time Selection */}
        <select
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Time</option>
          {generateTimeOptions()}
        </select>

        {/* User Selection */}
        <select
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select User</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleUpdate}
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Update
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Admin;