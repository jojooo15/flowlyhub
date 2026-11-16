import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import { registerLocale } from 'react-datepicker';
import id from 'date-fns/locale/id';
import "react-datepicker/dist/react-datepicker.css";
import '../styles/Calendar.css';

// Register Indonesian locale
registerLocale('id', id);

const CustomDatePicker = ({ 
  selected, 
  onChange,
  ...props 
}) => {
  return (
    <div className="custom-date-picker">
      <DatePicker
        selected={selected}
        onChange={onChange}
        dateFormat="dd MMMM yyyy"
        locale="id"
        className="form-control"
        {...props}
      />
    </div>
  );
};

CustomDatePicker.propTypes = {
  selected: PropTypes.instanceOf(Date),
  onChange: PropTypes.func.isRequired
};

export default CustomDatePicker;
