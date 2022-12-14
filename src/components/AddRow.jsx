import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { createMovements } from "../redux/movementSlice";

export const AddRow = ({
  month,
  year,
  libsArray,
  newRows,
  setNewRows,
  isRec,
  setTriggerRefreshToken,
  setTriggerToaster,
}) => {
  //___________________________________________________ Variables

  const dispatch = useDispatch();

  const [day, setDay] = useState(null);
  const [lib, setLib] = useState("");
  const [deb, setDeb] = useState(null);
  const [cred, setCred] = useState(null);
  const [value, setValue] = useState("");
  const [libs, setLibs] = useState([]);
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
      fontFamily: "var(--num-font)",
      width: "8rem",
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
    if (val.length > 35)
      return setTriggerToaster({
        type: "error",
        message: "Libell?? trop long. 35 caract??res maximum.",
      });
    setLibs([...libs, { value: val, label: val }]);
  };

  const handleValue = (event) => {
    const val = parseFloat(event.target.value) || "";
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
    if (deb === null || cred === null || !day || lib === "") {
      return setTriggerToaster({
        type: "error",
        message: !day
          ? "Veuillez choisir une date."
          : lib === ""
          ? "Veuillez selectionner un libell??."
          : value === ""
          ? "Veuillez ??crire un montant."
          : deb === null || cred === null
          ? 'Veuillez choisir "D??bit" ou "Cr??dit".'
          : "",
      });
    }
    const payload = {
      year,
      month,
      day,
      lib,
      value: cred ? value : value * -1,
      sold: 0,
      rec: isRec,
    };

    const containsDuplicateRow =
      newRows.filter(
        (item) =>
          item.day === payload.day &&
          item.lib === payload.lib &&
          item.value === payload.value
      ).length > 0;

    if (containsDuplicateRow)
      return setTriggerToaster({
        type: "error",
        message: "Cette r??currence existe d??j??",
      });

    setNewRows([...newRows, payload]);
    if (isRec)
      dispatch(createMovements(payload))
        .then((res) => {
          if (res.error?.message.split(" ").at(-1) === "401") {
            setTriggerToaster({
              type: "error",
              message: res.error?.message,
            });
            setTriggerRefreshToken(true);
          } else
            setTriggerToaster({
              type: "success",
              message: "R??currence ajout??e avec succ??s !",
            });
        })
        .catch((err) => console.log(err));
    else
      setTriggerToaster({
        type: "info",
        message: "Cette ligne sera ajout??e lorsque vous aurez enregistr??.",
      });

    // Clear inputs
    dateRef.current.clearValue();
    libRef.current.clearValue();
    setDay(null);
    setLib("");
    setDeb(null);
    setCred(null);
    setValue("");
    return;
  };

  //___________________________________________________ Render

  return (
    <>
      <div className="addRowContainer">
        <div className="labelWraper">
          Date
          <Select
            ref={dateRef}
            isSearchable={true}
            styles={selectDateStyle}
            isClearable={true}
            className="selectDate"
            onChange={handleDate}
            options={[...Array(31).keys()].map((item) => {
              return { value: item + 1, label: item + 1 };
            })}
          />
        </div>
        <div className="labelWraper">
          Libell??
          <CreatableSelect
            ref={libRef}
            isSearchable={true}
            styles={selectLibStyle}
            isClearable={true}
            className="selectLib"
            onCreateOption={handleCreateLib}
            onChange={handleLib}
            options={libs.concat(
              libsArray.map((item) => {
                return { value: item, label: item };
              })
            )}
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
            step="0.01"
            placeholder="0.00"
            value={value}
            onChange={handleValue}
            style={{ width: value.toString().length + 5 + "ch" }}
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
                color: deb ? "#000" : "#222",
                cursor: "pointer",
              }}
            >
              D??bit
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
                color: cred ? "#000" : "#222",
                cursor: "pointer",
              }}
            >
              Cr??dit
            </p>
            <div className={`cred ${cred ? "isActive" : ""}`}>+</div>
          </div>
        </div>
        <button className="primaryButton" onClick={handleAddRow}>
          Ajouter
        </button>
      </div>
    </>
  );
};
