import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { jwtDecode } from "jwt-decode";
import "../styles/calendar.css";



const CalendarPage = ({ role }) => {
  const [adminAppointments, setAdminAppointments] = useState([]);
  useEffect(() => {
    if (role === "ADMIN") {
      fetchAllAdminAppointments();
    }
  }, [role]);

  const fetchAllAdminAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://cc-api-gateway-77eb02bcc7e1.herokuapp.com/admin/slots", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch all admin slots");
      }
      const data = await response.json();
      console.log("Admin appointments data:", data); // Debugging
      setAdminAppointments(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Admin can delete any slot
  const handleAdminDelete = async (slotId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://cc-api-gateway-77eb02bcc7e1.herokuapp.com/admin/slots/${slotId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        alert("Admin: Slot deleted successfully!"); // Add this
        fetchAllAdminAppointments();
      } else {
        alert("Failed to delete slot");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Admin can update any slot
  // you’d likely let them pick new date/time in a form
  const handleAdminUpdate = async (slotId, updatedData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://cc-api-gateway-77eb02bcc7e1.herokuapp.com/admin/slots/${slotId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        }
      );
      if (response.ok) {
        alert("Admin: Slot updated successfully!"); // Add this
        fetchAllAdminAppointments();
      } else {
        alert("Failed to update slot");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const [selectedDay, setSelectedDay] = useState(null);
  const [timeSlot, setTimeSlot] = useState("");

  // Separate error messages for booking vs. appointment
  const [bookingErrorMessage, setBookingErrorMessage] = useState("");
  const [appointmentErrorMessage, setAppointmentErrorMessage] = useState("");
  const [appointmentSuccessMessage, setAppointmentSuccessMessage] =
    useState("");

  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);

  // Store the user's existing appointment
  const [userAppointment, setUserAppointment] = useState(null);

  const [username, setUsername] = useState("");
  const [userid, setUserid] = useState(null);

  // Fetch current date from worldtimeapi OR fallback to local time
  const fetchCurrentDate = async () => {
    try {
      const response = await fetch(
        "https://timeapi.io/api/Time/current/zone?timeZone=UTC"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch current date");
      }
      const data = await response.json();
      setCurrentDate(new Date());
    } catch (error) {
      console.error("Error fetching current date:", error);
      // fallback to local system date
      setCurrentDate(new Date());
    }
  };

  // Decode JWT token
  const extractUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log(decodedToken);
        setUsername(decodedToken.username);
        // Some tokens store ID in `sub`, others in custom field
        setUserid(Number(decodedToken.sub || decodedToken.userid));
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  };

  // On mount, do 2 things: fetch date, decode token
  useEffect(() => {
    fetchCurrentDate();
    extractUserIdFromToken();
  }, []);

  // Whenever `userid` changes, fetch appointments
  useEffect(() => {
    if (userid) {
      fetchAppointments();
    }
  }, [userid]);

  // Fetch all appointments
  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://cc-api-gateway-77eb02bcc7e1.herokuapp.com/slots", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Convert backend dates to ISO format and extract date part
      const convertedAppointments = data.map((app) => ({
        ...app,
        date: new Date(app.date).toISOString().split("T")[0], // Standard ISO format
        time: app.time.split(":").slice(0, 2).join(":"), // Remove seconds if present
      }));

      setAppointments(convertedAppointments);

      // Find current user's appointment using the decoded user ID
      const userApp = convertedAppointments.find(
        (app) => app.userId === userid // Ensure this matches your data structure
      );

      setUserAppointment(userApp || null);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setAppointments([]); // Reset on error
      setUserAppointment(null);
    }
  };

  // Called when user clicks a calendar day
  const handleDayClick = (clickedDate) => {
    // Clear messages
    setBookingErrorMessage("");
    setAppointmentErrorMessage("");
    setAppointmentSuccessMessage("");

    // Convert to ISO date string (YYYY-MM-DD)
    const isoDate = clickedDate.toISOString().split("T")[0];
    const today = new Date().toISOString().split("T")[0];

    // Prevent selecting past or same-day
    if (isoDate <= today) {
      setBookingErrorMessage("Booking unavailable for the selected date.");
      setSelectedDay(null);
      return;
    }

    // Update state with ISO formatted date
    setSelectedDay(isoDate);
    setTimeSlot("");
    setCurrentDate(clickedDate);
  };
  
  // “Today” button
  const handleTodayClick = () => {
    setCurrentDate(new Date());
  };

  // Month/year dropdown changes
  const handleMonthChange = (e) => {
    const selectedMonth = parseInt(e.target.value, 10);
    setCurrentDate(
      new Date(currentDate.getFullYear(), selectedMonth, currentDate.getDate())
    );
  };

  const handleYearChange = (e) => {
    const selectedYear = parseInt(e.target.value, 10);
    setCurrentDate(
      new Date(selectedYear, currentDate.getMonth(), currentDate.getDate())
    );
  };

  // Book a new appointment
  const handleBookAppointment = async () => {
    try {
      setBookingErrorMessage("");
      setAppointmentErrorMessage("");
      setAppointmentSuccessMessage("");

      const token = localStorage.getItem("token");

      // If user already has an appointment
      if (userAppointment) {
        setBookingErrorMessage("You already have an appointment.");
        return;
      }

      // If this date/time is taken
      const convertedTime = convertTo24HourFormat(timeSlot);
      const isTaken = appointments.some(
        (app) => app.date === selectedDay && app.time === convertedTime
      );
      if (isTaken) {
        setBookingErrorMessage(
          "That date/time is already booked. Please select another slot."
        );
        return;
      }

      // Build the new appointment
      const response = await fetch("https://cc-api-gateway-77eb02bcc7e1.herokuapp.com/slots/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: selectedDay,
          time: convertedTime,
          username,
          roomNumber: generateRoomNumber(),
          registrarName: "Registrar Name",
          status: "BOOKED",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setBookingErrorMessage(
          errorData.error || "Failed to book appointment."
        );
        return;
      } else {
        alert("Appointment booked successfully!"); // Add this
        fetchAppointments();
        setSelectedDay(null);
        setTimeSlot("");
      }

      // Success -> refresh
      const data = await response.json();
      console.log("Booked Appointment:", data);
      fetchAppointments();

      // Reset local state
      setSelectedDay(null);
      setTimeSlot("");
    } catch (error) {
      console.error("Error booking appointment:", error);
      setBookingErrorMessage("Failed to book the appointment.");
    }
  };

  // Update existing appointment
  const handleUpdateAppointment = async () => {
    try {
      setAppointmentErrorMessage("");

      if (!userAppointment) {
        setAppointmentErrorMessage("No existing appointment to update.");
        return;
      }

      if (!selectedDay || !timeSlot) {
        setAppointmentErrorMessage(
          "Please select a new date and time before updating."
        );
        return;
      }

      const token = localStorage.getItem("token");
      const newDate = selectedDay;
      const newTime = convertTo24HourFormat(timeSlot);

      const response = await fetch("https://cc-api-gateway-77eb02bcc7e1.herokuapp.com/slots/appointment", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ date: newDate, time: newTime }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setAppointmentErrorMessage(errorData.error || "Failed to update.");
        return;
      } else {
        const updatedSlot = await response.json();
        alert("Appointment updated successfully!"); // Add this
        fetchAppointments();
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
      setAppointmentErrorMessage("Error updating appointment.");
    }
  };

  // Cancel (delete) existing appointment
  const handleCancelAppointment = async () => {
    try {
      setAppointmentErrorMessage("");

      if (!userAppointment) {
        setAppointmentErrorMessage("No existing appointment to delete.");
        return;
      }

      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://cc-api-gateway-77eb02bcc7e1.herokuapp.com/slots/appointment/delete",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        setAppointmentErrorMessage("Failed to cancel appointment.");
        return;
      } else {
        alert("Appointment deleted successfully!"); // Add this
        setUserAppointment(null);
        fetchAppointments();
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      setAppointmentErrorMessage("Error cancelling appointment.");
    }
  };

  // Generate random room (A0, etc.)
  const generateRoomNumber = () => {
    const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const number = Math.floor(Math.random() * 10);
    return `${letter}${number}`;
  };

  // Build time slot array (07:00 - 22:30)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 7; hour <= 22; hour++) {
      slots.push(formatTime(hour, 0));
      if (hour < 23) {
        slots.push(formatTime(hour, 30));
      }
    }
    return slots;
  };

  // Convert 24h to "hh:mm AM/PM"
  const formatTime = (hour, minute) => {
    const suffix = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${String(formattedHour).padStart(2, "0")}:${String(minute).padStart(
      2,
      "0"
    )} ${suffix}`;
  };

  // Convert "hh:mm AM/PM" => "HH:MM:00"
  const convertTo24HourFormat = (time12h) => {
    if (!time12h) return "";
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    } else if (modifier === "AM" && hours === 12) {
      hours = 0;
    }

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:00`;
  };

  return (
    <div className="calendar-page">
      <div className="content">
        {/* Calendar Container */}
        <div className="calendar-container" style={{ height: "400px" }}>
          {/* Custom navigation */}
          <div className="custom-navigation">
            <select
              value={currentDate.getMonth()}
              onChange={handleMonthChange}
              className="month-dropdown"
            >
              {[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ].map((month, index) => (
                <option key={index} value={index}>
                  {month}
                </option>
              ))}
            </select>
            <select
              value={currentDate.getFullYear()}
              onChange={handleYearChange}
              className="year-dropdown"
            >
              {Array.from(
                { length: 3001 - new Date().getFullYear() },
                (_, i) => {
                  const year = new Date().getFullYear() + i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                }
              )}
            </select>
            <button className="today-button" onClick={handleTodayClick}>
              Today
            </button>
          </div>

          {/* React Calendar */}
          <Calendar
            key={currentDate?.toISOString()}
            value={currentDate}
            onClickDay={handleDayClick}
            tileClassName={({ date }) => {
              // highlight current day
              if (date.toDateString() === new Date().toDateString()) {
                return "react-calendar__tile--now";
              }

              // Highlight selected day (compare local dates)
              const tileYear = date.getFullYear();
              const tileMonth = String(date.getMonth() + 1).padStart(2, "0");
              const tileDay = String(date.getDate()).padStart(2, "0");
              const tileDateStr = `${tileYear}-${tileMonth}-${tileDay}`;

              // highlight user-selected day
              if (selectedDay === tileDateStr) {
                return "react-calendar__tile--user-selected";
              }
              return null;
            }}
            showNavigation={false}
          />
        </div>

        {/* Book an Appointment */}
        <div className="menu">
          {selectedDay && (
            <div>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="time-slot-dropdown"
              >
                <option value="">Select a time slot</option>
                {generateTimeSlots().map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              <button
                className={`book-appointment-button ${
                  selectedDay && timeSlot ? "enabled" : "disabled"
                }`}
                onClick={handleBookAppointment}
                disabled={!selectedDay || !timeSlot}
              >
                Book Appointment
              </button>
            </div>
          )}
          {/* Booking errors */}
          {bookingErrorMessage && (
            <div className="error-message">{bookingErrorMessage}</div>
          )}
          The Appointment Container (shows if user has an appointment or success
          msg)
          <div className="appointment-container">
            {/* Left side: either success or appointment details */}
            {/* Before */}
            <div className="appointment-info">
              {appointmentSuccessMessage ? (
                <div className="success-message">
                  {appointmentSuccessMessage}
                </div>
              ) : userAppointment ? (
                <div>
                  <p>Date: {userAppointment.date}</p>
                  <p>Time: {userAppointment.time}</p>
                  <p>Room: {userAppointment.roomNumber}</p>
                  <p>Registrar: {userAppointment.registrarName}</p>
                </div>
              ) : (
                <div>No current appointment</div>
              )}
            </div>

            {/* Right side: two stacked buttons */}
            <div className="appointment-buttons">
              <button
                className="appointment-button"
                onClick={handleUpdateAppointment}
              >
                Update
              </button>
              <button
                className="appointment-button"
                onClick={handleCancelAppointment}
              >
                Cancel
              </button>
            </div>
          </div>
          {/* Update/Delete errors */}
          {appointmentErrorMessage && (
            <div className="error-message">{appointmentErrorMessage}</div>
          )}
        </div>
      </div>
      {role === "ADMIN" && (
        <div className="admin-panel">
          <h2>All Booked Appointments (Admin)</h2>
          {adminAppointments.length === 0 ? (
            <p>No appointments found.</p>
          ) : (
            adminAppointments.map((slot) => (
              <div key={slot.id} className="appointment-container">
                <div className="appointment-info">
                  <p>Slot ID: {slot.id}</p>
                  <p>User ID: {slot.userId}</p> {/* Use slot.userId */}
                  <p>Date: {slot.date}</p>
                  <p>Time: {slot.time}</p>
                  <p>Room: {slot.roomNumber}</p>
                  <p>Registrar: {slot.registrarName}</p>
                </div>
                <div className="appointment-buttons">
                  <button
                    className="appointment-button"
                    onClick={() =>
                      handleAdminUpdate(slot.id, {
                        /* updated data */
                      })
                    }
                  >
                    Update
                  </button>
                  <button
                    className="appointment-button"
                    onClick={() => handleAdminDelete(slot.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
