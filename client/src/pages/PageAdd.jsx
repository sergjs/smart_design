import React, { useEffect, useState } from "react";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hook";
import { NavLink } from 'react-router-dom'
import { Modal } from "../modal/modal";

export const PageAdd = () => {
  const message = useMessage()
  const { loading, error, request } = useHttp()
  const [form, setForm] = useState({
    name: '', id: '', about: '', specifications1: '',
    specifications2: '', specifications3: '', specifications4: ''
  })
  const [flag, setFlag] = useState(false);
  const [comment, setComment] = useState('');

  useEffect(() => {
    console.log(error)
    message(error)
  }, [error, message])

  const changeHandler = event => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const registerHandler = async () => {
    try {
      const data = await request('/api/register', 'POST', { ...form })
      setFlag(true)
      setComment(data.message)
      
    } catch (e) {

    }
  }
  return (
    <div className="row container">
      <div className="row">
        <div className="input-field col s3">
          <input name='name' id='name'
            value={form.name} type="text" className="validate"
            onChange={changeHandler} />
          <label htmlFor="name">name</label>
        </div>
        <div className="input-field col s3">
          <input name='id' id='id'
            value={form.id} type="text" className="validate"
            onChange={changeHandler} />
          <label htmlFor="id">id</label>
        </div>
      </div>
      <div className="row">
        <div className="input-field col s12">
          <textarea name='about'
            id='about' type="text" className="validate materialize-textarea"
            value={form.about}
            onChange={changeHandler} />
          <label htmlFor="about">Введите описание </label>
        </div>
      </div>
      <div className="row">
        <div className="input-field col s2">
          <input name='specifications1' id='specifications1'
            value={form.specifications1} type="text" className="validate"
            onChange={changeHandler} />
          <label htmlFor="specifications1">Диагональ</label>
        </div>
        <div className="input-field col s2">
          <input name='specifications2' id='specifications2'
            value={form.specifications2} type="text" className="validate"
            onChange={changeHandler} />
          <label htmlFor="specifications2">Разрешение </label>
        </div>

        <div className="input-field col s2">
          <input name='specifications3' id='specifications3'
            value={form.specifications3} type="text" className="validate"
            onChange={changeHandler} />
          <label htmlFor="specifications3">Память  </label>

        </div>
        <div className="input-field col s2">
          <input name='specifications4' id='specifications4'
            value={form.specifications4} type="text" className="validate"
            onChange={changeHandler} />
          <label htmlFor="specifications4">Процессор </label>
        </div>
      </div>
      <button className="btn grey lighten-1 black-text"
        onClick={registerHandler}
        disabled={loading}>
        Добавить
      </button>
      <button style={{ marginLeft: '15px' }} className="btn grey lighten-1"><NavLink to='/'>Вернуться</NavLink></button>
      {flag && <Modal setFlag={setFlag} comment={comment}/>}
    </div>

  )
}