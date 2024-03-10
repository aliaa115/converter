import PropTypes from "prop-types";

const InputFormulario = ({ type, label, value, setValue, icon }) => {
  const handleChange = (evt) => {
    setValue(evt.currentTarget.value);
  };

  return (
    <div className="input-group mb-3">
      <span className="input-group-text">
        <span className={`c-${icon || "edit"} m-2`}></span>
      </span>
      <div className="form-floating">
        <input
          type={type}
          className="form-control"
          id="floatingInputGroup1"
          placeholder={label}
          value={value}
          onChange={handleChange}
        />
        <label htmlFor="floatingInputGroup1">{label}</label>
      </div>
    </div>
  );
};

InputFormulario.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.any,
  setValue: PropTypes.func,
  icon: PropTypes.string,
};

export default InputFormulario;
