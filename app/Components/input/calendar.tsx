"use client";

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./calendar.css";

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <div>
      <DatePicker
        selected={selectedDate}
        onChange={(date: Date | null) => setSelectedDate(date)}
        dateFormat="dd/MM/yyyy"
        className="datepicker"
        placeholderText="Dates"
      />
    </div>
  );
};

export default Calendar;
