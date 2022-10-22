import { useState } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { useDispatch } from "react-redux";
import { deleteMovements, updateMovements } from "../redux/movementSlice";

export const EditRow = ({
  month,
  year,
  row,
  setRow,
  deletedRows,
  setDeletedRows,
  libsArray
}) => {
  //___________________________________________________ Variables
  const dispatch = useDispatch();

  const [day, setDay] = useState(row.day);
  const [lib, setLib] = useState(row.lib);
  const [deb, setDeb] = useState(
    row.value ? (row.value > 0 ? false : true) : null
  );
  const [cred, setCred] = useState(
    row.value ? (row.value > 0 ? true : false) : null
  );
  const [value, setValue] = useState(Math.abs(row.value));
  const [isRec, setIsRec] = useState(row.rec);
  const [libs, setLibs] = useState(
    libsArray.map((item) => {
      return { value: item, label: item };
    })
  );
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

  //___________________________________________________ Functions

  const handleDate = (event) => {
    if (event) setDay(event.value);
  };

  const handleLib = (event) => {
    if (event) setLib(event.value);
  };
  const handleCreateLib = (val) => {
    if (val.length > 35) return; //add toast error message
    setLibs([...libs, { value: val, label: val }]);
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

  const handleValue = (event) => {
    const val = parseFloat(event.target.value);
    if (event.target.value.length > 7) return;
    setValue(val < 0 ? val * -1 : val);
  };

  const handleEditRow = () => {
    if (deb === null || cred === null || !day || lib === "") return;
    const payload = {
      id: row.id,
      year,
      month,
      day,
      lib,
      value: cred ? value : value * -1,
      sold: 0,
      rec: isRec,
    };

    dispatch(updateMovements(payload));

    setRow(null);
    return;
  };

  const handleDeleteRow = () => {
    dispatch(deleteMovements(row));
    setDeletedRows([...deletedRows, row])
    setRow(null);
    return
  };

  //___________________________________________________ Render

  return (
    <>
      <div className="editRowPage">
        <div className="editRowContainer">
          <div className="closeEditRow" onClick={() => setRow(null)}>
            x
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              gap: "2rem",
            }}
          >
            <div className="labelWraper">
              Date
              <Select
                isSearchable={true}
                // placeholder="Date"
                styles={selectDateStyle}
                isClearable={true}
                className="selectDate"
                onChange={handleDate}
                defaultValue={{ value: day, label: day }}
                options={[...Array(31).keys()].map((item) => {
                  return { value: item + 1, label: item + 1 };
                })}
              />
            </div>
            <div className="labelWraper">
              Libellé
              <CreatableSelect
                isSearchable={true}
                // placeholder="Libellé"
                styles={selectLibStyle}
                isClearable={true}
                className="selectLib"
                onCreateOption={handleCreateLib}
                onChange={handleLib}
                options={libs}
                defaultValue={{ value: lib, label: lib }}
              />
            </div>
            <div className="labelWraper">
              Montant
              <input
                className="inputPrice"
                type="number"
                name="price"
                min="0"
                id="price"
                placeholder=". . ."
                step="0.01"
                value={value}
                onChange={handleValue}
                style={{ width: value.toString().length + 2 + "ch" }}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: ".2rem",
                minWidth: "8rem",
              }}
            >
              <div
                className="selectCredOrDeb"
                onClick={() => handleDebOrCred("deb")}
              >
                <p
                  style={{
                    fontWeight: deb ? "600" : "",
                    color: deb ? "#000" : "#9b9999",
                    cursor: "pointer",
                  }}
                >
                  Débit
                </p>
                <div className={`deb ${deb ? "isActive" : ""}`}>-</div>
              </div>
              <div
                className="selectCredOrDeb"
                onClick={() => handleDebOrCred("cred")}
              >
                <p
                  style={{
                    fontWeight: cred ? "600" : "",
                    color: cred ? "#000" : "#9b9999",
                    cursor: "pointer",
                  }}
                >
                  Crédit
                </p>
                <div className={`cred ${cred ? "isActive" : ""}`}>+</div>
              </div>
            </div>

            <label
              className="box"
              style={{
                fontWeight: isRec ? "600" : "",
                color: isRec ? "#000" : "#9b9999",
                minWidth: "8rem",
              }}
            >
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
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            <button className="primaryButton" onClick={handleEditRow}>
              Modifier
            </button>
            <button className="secondaryButton" onClick={handleDeleteRow}>
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
