import "./Form.css";
import {
  selectApiTokenInstance,
  selectApiTokenInstanceStatus,
  selectFormStatus,
  selectIdInstance,
  selectIdInstanceStatus,
  selectTel,
  selectTelStatus,
  setFieldStatus,
  setFormStatus,
  setValue,
} from "../../store/formSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

const Form = () => {
  const idInstance = useSelector(selectIdInstance);
  const idInstanceStatus = useSelector(selectIdInstanceStatus);
  const apiTokenInstance = useSelector(selectApiTokenInstance);
  const apiTokenInstanceStatus = useSelector(selectApiTokenInstanceStatus);
  const tel = useSelector(selectTel);
  const telInstanceStatus = useSelector(selectTelStatus);
  const formStatus = useSelector(selectFormStatus);
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      idInstanceStatus === "filled" &&
      apiTokenInstanceStatus === "filled" &&
      telInstanceStatus === "filled"
    ) {
      dispatch(setFormStatus("filled"));
    }
  }, [idInstanceStatus, apiTokenInstanceStatus, telInstanceStatus, dispatch]);

  const changeIdInstance = (val) => {
    dispatch(setValue([val, "idInstance"]));
    dispatch(setFieldStatus(["filled", "idInstance"]));
  };

  const changeApiTokenInstance = (val) => {
    dispatch(setValue([val, "apiTokenInstance"]));
    dispatch(setFieldStatus(["filled", "apiTokenInstance"]));
  };

  const changeTel = (val) => {
    dispatch(setValue([val, "tel"]));
    dispatch(setFieldStatus(["filled", "tel"]));
  };

  const isSubmitDisabled = () => formStatus === "unfilled";

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset className="border px-4 pt-1 pb-4">
        <legend className="float-none w-auto title">Создать чат</legend>
        <div className="form-group">
          <label htmlFor="idInstance" className="col-form-label">
            idInstance:
          </label>
          <input
            type="text"
            className="form-control"
            id="idInstance"
            aria-describedby="emailHelp"
            placeholder="Введите idInstance"
            value={idInstance}
            onChange={(e) => changeIdInstance(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="apiTokenInstance" className="col-form-label">
            apiTokenInstance:
          </label>
          <input
            type="text"
            className="form-control"
            id="apiTokenInstance"
            placeholder="Введите apiTokenInstance"
            value={apiTokenInstance}
            onChange={(e) => changeApiTokenInstance(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="tel" className="col-form-label">
            Телефон:
          </label>
          <input
            type="tel"
            className="form-control"
            id="tel"
            placeholder="Введите телефон"
            value={tel}
            onChange={(e) => changeTel(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-success"
          disabled={isSubmitDisabled()}
        >
          Создать чат
        </button>
      </fieldset>
    </form>
  );
};

export default Form;
