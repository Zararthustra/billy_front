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
  libsArray,
  isRec,
  setTriggerRefreshToken,
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
      fontFamily: "var(--num-font)",
      width: "15rem",
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

    dispatch(updateMovements(payload))
      .then((res) => {
        if (res.error?.message.split(" ").at(-1) === "401")
          setTriggerRefreshToken(true);
      })
      .catch((err) => console.log(err));

    setRow(null);
    return;
  };

  const handleDeleteRow = () => {
    setDeletedRows([...deletedRows, row]);
    if (isRec)
      dispatch(deleteMovements(row))
        .then((res) => {
          if (res.error?.message.split(" ").at(-1) === "401")
            setTriggerRefreshToken(true);
        })
        .catch((err) => console.log(err));
    setRow(null);
    return;
  };

  //___________________________________________________ Render

  return (
    <>
      <div className="editRowPage">
        <div className="editRowContainer">
          <div className="closeEditRow" onClick={() => setRow(null)}>
            <svg
              width="15"
              height="15"
              viewBox="0 0 49 49"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.77589 1.81503C6.21379 0.252932 3.68113 0.252931 2.11904 1.81503C0.556938 3.37713 0.556938 5.90979 2.11904 7.47188L19.1472 24.5L2.11904 41.5281C0.556938 43.0902 0.556938 45.6229 2.11904 47.185C3.68113 48.7471 6.21379 48.7471 7.77589 47.185L24.804 30.1569L41.8321 47.185C43.3942 48.7471 45.9269 48.7471 47.489 47.185C49.0511 45.6229 49.0511 43.0902 47.489 41.5281L30.4609 24.5L47.489 7.47188C49.0511 5.90978 49.0511 3.37712 47.489 1.81502C45.9269 0.252927 43.3942 0.252928 41.8321 1.81503L24.804 18.8431L7.77589 1.81503Z"
                fill="white"
              />
            </svg>
          </div>
          <div
            className="editRowFields"
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
