import { useRef, useState } from "react";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { addRow } from "../redux/monthSlice";

export const AddRow = () => {
  //___________________________________________________ Variables

  const [date, setDate] = useState(null);
  const [lib, setLib] = useState("");
  const [deb, setDeb] = useState(null);
  const [cred, setCred] = useState(null);
  const [value, setValue] = useState("");
  const dispatch = useDispatch();

  const dateRef = useRef();
  const libRef = useRef();

  const selectDateStyle = {
    singleValue: (base, state) => ({
      ...base,
      color: "var(--orange)",
      fontFamily: "var(--num-font)",
    }),
    control: (base, state) => ({
      ...base,
      cursor: "pointer",
      border: state.isFocused ? "1px var(--orange) solid" : "1px black solid",
      boxShadow: "none",
      "&:hover": {
        border: "1px var(--orange) solid",
      },
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
    }),
    control: (base, state) => ({
      ...base,
      cursor: "pointer",
      border: state.isFocused ? "1px var(--orange) solid" : "1px black solid",
      boxShadow: "none",
      "&:hover": {
        border: "1px var(--orange) solid",
      },
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

  //___________________________________________________ Functions

  const handleDate = (event) => {
    if (event) setDate(event.value);
  };

  const handleLib = (event) => {
    if (event) setLib(event.value);
  };

  const handleValue = (event) => {
    const val = parseInt(event.target.value);
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

  const handleSaveRow = () => {
    if (deb === null || cred === null || !date || lib === "") return;

    dispatch(
      addRow({
        date,
        lib,
        value: cred ? value : value * -1,
        sold: 0,
        recurrent: true,
      })
    );
    dateRef.current.clearValue();
    libRef.current.clearValue();
    setDate(null);
    setLib("");
    setDeb(null);
    setCred(null);
    setValue(0);
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
        className="selectDate"
        onChange={handleDate}
        options={[...Array(31).keys()].map((item) => {
          return { value: item + 1, label: item + 1 };
        })}
      />
      <Select
      ref={libRef}
        isSearchable={true}
        placeholder="Libellé"
        styles={selectLibStyle}
        className="selectLib"
        onChange={handleLib}
        options={[{ value: "salaire", label: "Salaire" }]}
      />
      <input
        className="inputPrice"
        type="number"
        name="price"
        min="0"
        id="price"
        placeholder="Valeur"
        value={value}
        onChange={handleValue}
      />
      <div className="selectCredOrDeb">
        <div
          className={`deb ${deb ? "isActive" : ""}`}
          onClick={() => handleDebOrCred("deb")}
        />
        <div
          className={`cred ${cred ? "isActive" : ""}`}
          onClick={() => handleDebOrCred("cred")}
        />
      </div>
      <button className="primaryButton" onClick={handleSaveRow}>
        Ajouter
      </button>
    </div>
  );
};
