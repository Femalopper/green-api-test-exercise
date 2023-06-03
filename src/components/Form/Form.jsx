import React, { useEffect } from 'react';
import './Form.css';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import classNames from 'classnames';
import { setChatId } from '../../store/chatSlice';
import {
  selectApiTokenInstance,
  selectApiTokenInsStatus,
  selectError,
  selectFormStatus,
  selectIdInstance,
  selectIdInstanceStatus,
  selectTel,
  selectTelStatus,
  setError,
  setFieldStatus,
  setFormStatus,
  setValue,
} from '../../store/formSlice';

function Form() {
  const idInstance = useSelector(selectIdInstance);
  const idInstanceStatus = useSelector(selectIdInstanceStatus);
  const apiTokenInstance = useSelector(selectApiTokenInstance);
  const apiTokenInstanceStatus = useSelector(selectApiTokenInsStatus);
  const tel = useSelector(selectTel);
  const telInstanceStatus = useSelector(selectTelStatus);
  const formStatus = useSelector(selectFormStatus);
  const err = useSelector(selectError);
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      idInstanceStatus === 'filled'
      && apiTokenInstanceStatus === 'filled'
      && telInstanceStatus === 'filled'
    ) {
      dispatch(setFormStatus('filled'));
    } else {
      dispatch(setFormStatus('unfilled'));
    }
  }, [idInstanceStatus, apiTokenInstanceStatus, telInstanceStatus, dispatch]);

  const changeIdInstance = (val) => {
    dispatch(setValue([val, 'idInstance']));
    if (val) {
      dispatch(setFieldStatus(['filled', 'idInstance']));
    } else {
      dispatch(setFieldStatus(['unfilled', 'idInstance']));
    }
  };

  const changeApiTokenInstance = (val) => {
    dispatch(setValue([val, 'apiTokenInstance']));
    if (val) {
      dispatch(setFieldStatus(['filled', 'apiTokenInstance']));
    } else {
      dispatch(setFieldStatus(['unfilled', 'apiTokenInstance']));
    }
  };

  const changeTel = (val) => {
    dispatch(setValue([val, 'tel']));
    if (val) {
      dispatch(setFieldStatus(['filled', 'tel']));
    } else {
      dispatch(setFieldStatus(['unfilled', 'tel']));
    }
  };

  const isSubmitDisabled = () => formStatus === 'unfilled';

  const handleSubmit = (e) => {
    e.preventDefault();
    const regExp = /\d/g;
    const validTel = tel.match(regExp).join('');
    const chatId = `${validTel}@c.us`;

    const headers = {
      'Content-Type': 'application/json',
    };
    axios
      .get(
        `https://api.green-api.com/waInstance${idInstance}/getStateInstance/${apiTokenInstance}`,
        { headers },
      )
      .then((res) => console.log(res.data))
      .then(() => axios.post(
        `https://api.green-api.com/waInstance${idInstance}/checkWhatsapp/${apiTokenInstance}`,
        JSON.stringify({ phoneNumber: validTel }),
        { headers },
      ))
      .then((res) => {
        if (res.data.existsWhatsapp) {
          console.log(res.data);
        } else {
          throw new Error('This number is not registered in WhatsApp');
        }
      })
      .then(() => {
        dispatch(setChatId(chatId));
        dispatch(setFormStatus('created'));
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 400) {
          dispatch(setError(error.response.data.message));
        } else if (error.response && error.response.status === 401) {
          dispatch(setError('The user is unauthorized'));
        } else if (error.response && error.response.status === 466) {
          dispatch(setError('Limit exhausted'));
        } else {
          dispatch(setError(error.message));
        }
      });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={classNames({
        hide: formStatus === 'created',
      })}
    >
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
            autoComplete="off"
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
            autoComplete="off"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="tel" className="col-form-label">
            Телефон:
          </label>
          <input
            type="number"
            className="form-control"
            id="tel"
            placeholder="Введите телефон"
            value={tel}
            onChange={(e) => changeTel(e.target.value)}
            autoComplete="off"
            required
          />
        </div>
        <div className="error-and-button">
          <div className="error">{err}</div>
          <div>
            <button
              type="submit"
              className="btn btn-success"
              disabled={isSubmitDisabled()}
            >
              Создать чат
            </button>
          </div>
        </div>
      </fieldset>
    </form>
  );
}

export default Form;
