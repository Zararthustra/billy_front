import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { useSelector } from "react-redux";
import CreatableSelect from "react-select/creatable";

export const AddRow = ({
  month,
  year,
  movements,
  setMovements,
  newRows,
  setNewRows,
}) => {
  //___________________________________________________ Variables

  const [date, setDate] = useState(null);
  const [lib, setLib] = useState("");
  const [deb, setDeb] = useState(null);
  const [cred, setCred] = useState(null);
  const [value, setValue] = useState("");
  const [isRec, setIsRec] = useState(false);
  const [libs, setLibs] = useState(
    useSelector((state) => state.movements).map((item) => {
      return { value: item.lib, label: item.lib };
    })
  );
  const dateRef = useRef();
  const libRef = useRef();

  const selectDateStyle = {
    singleValue: (base, state) => ({
      ...base,
      color: "var(--orange)",
      fontFamily: "var(--num-font)",
      fontWeight: 600,
    }),
    control: (base, state) => ({
      ...base,
      cursor: "pointer",
      border: "none",
      boxShadow: "none",
    }),
    option: (base, state) => ({
      ...base,
      cursor: "pointer",
      fontFamily: "var(--num-font)",
      backgroundColor: state.isFocused ? "var(--orange)" : "white",
      color: state.isFocused ? "white" : "var(--orange)",
      "&:hover": {
        backgroundColor: "var(--orange)",
        color: "white",
      },
    }),
  };

  const selectLibStyle = {
    singleValue: (base, state) => ({
      ...base,
      color: "var(--orange)",
      fontFamily: "var(--num-font)",
      fontWeight: 600,
    }),
    control: (base, state) => ({
      ...base,
      cursor: "pointer",
      border: "none",
      boxShadow: "none",
    }),
    option: (base, state) => ({
      ...base,
      cursor: "pointer",
      fontFamily: "var(--num-font)",
      backgroundColor: state.isFocused ? "var(--orange)" : "white",
      color: state.isFocused ? "white" : "var(--orange)",
      "&:hover": {
        backgroundColor: "var(--orange)",
        color: "white",
      },
    }),
  };

  useEffect(() => {}, [libs]);

  //___________________________________________________ Functions

  const handleDate = (event) => {
    if (event) setDate(event.value);
  };

  const handleLib = (event) => {
    if (event) setLib(event.value);
  };
  const handleCreateLib = (val) => {
    if (val.length > 35) return; //add toast error message
    setLibs([...libs, { value: val, label: val }]);
  };

  const handleValue = (event) => {
    const val = parseInt(event.target.value);
    if (event.target.value.length > 7) return;
    setValue(val < 0 ? val * -1 : val);
  };

  const handleDebOrCred = (debOrCred) => {
    switch (debOrCred) {
      case "deb": {
        setCred(false);
        return setDeb(true);
      }
      case "cred": {
        setDeb(false);
        return setCred(true);
      }

      default:
        break;
    }
  };

  const handleAddRow = () => {
    if (deb === null || cred === null || !date || lib === "") return;
    const payload = {
      year,
      month,
      date,
      lib,
      value: cred ? value : value * -1,
      sold: 0,
      recurrent: isRec,
    };

    const containsDuplicateRow =
      newRows.filter(
        (item) =>
          item.date === payload.date &&
          item.lib === payload.lib &&
          item.value === payload.value &&
          item.recurrent === payload.recurrent
      ).length > 0;

    if (containsDuplicateRow) return; // add toast error

    setMovements([...movements, payload]);
    setNewRows([...newRows, payload]);

    // Clear inputs
    dateRef.current.clearValue();
    libRef.current.clearValue();
    setDate(null);
    setLib("");
    setDeb(null);
    setCred(null);
    setValue(0);
    setIsRec(false);
    return;
  };

  //___________________________________________________ Render

  return (
    <div className="addRowContainer">
      <Select
        ref={dateRef}
        isSearchable={true}
        placeholder="Date"
        styles={selectDateStyle}
        isClearable={true}
        className="selectDate"
        onChange={handleDate}
        options={[...Array(31).keys()].map((item) => {
          return { value: item + 1, label: item + 1 };
        })}
      />
      <CreatableSelect
        ref={libRef}
        isSearchable={true}
        placeholder="Libellé"
        styles={selectLibStyle}
        isClearable={true}
        className="selectLib"
        onCreateOption={handleCreateLib}
        onChange={handleLib}
        options={libs}
        loadingMessage={"defefe"}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: ".2rem",
        }}
      >
        <div className="selectCredOrDeb">
          <p>Débit</p>
          <div
            className={`deb ${deb ? "isActive" : ""}`}
            onClick={() => handleDebOrCred("deb")}
          >
            -
          </div>
        </div>
        <div className="selectCredOrDeb">
          <p>Crédit</p>
          <div
            className={`cred ${cred ? "isActive" : ""}`}
            onClick={() => handleDebOrCred("cred")}
          >
            +
          </div>
        </div>
      </div>
      <input
        className="inputPrice"
        type="number"
        name="price"
        min="0"
        id="price"
        placeholder="............ €"
        value={value}
        onChange={handleValue}
      />
      <label className="box">
        Récurrent
        <input type="checkbox" onChange={() => setIsRec(!isRec)} />
        <svg
          className={`check ${isRec ? "check--active" : ""}`}
          aria-hidden="true"
          viewBox="0 0 15 10"
          fill="none"
        >
          <path
            d="M1 4.5L5 9L14 1"
            strokeWidth="2"
            stroke={isRec ? "#fff" : "none"}
          />
        </svg>
      </label>
      <button className="primaryButton" onClick={handleAddRow}>
        Ajouter
      </button>
    </div>
  );
};
