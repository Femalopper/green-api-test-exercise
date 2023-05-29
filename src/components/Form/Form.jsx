import "./Form.css";
import {
  selectApiTokenInstance,
  selectIdInstance,
  selectTel,
  setFieldStatus,
  setValue,
} from "../../store/formSlice";
import { useDispatch, useSelector } from "react-redux";

const Form = () => {
  const idInstance = useSelector(selectIdInstance);
  const apiTokenInstance = useSelector(selectApiTokenInstance);
  const tel = useSelector(selectTel);
  const dispatch = useDispatch();

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

  return (
    <form>
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
      <button type="submit" className="btn btn-success">
        Создать чат
      </button>
      </fieldset>
    </form>
  );
};

export default Form;
