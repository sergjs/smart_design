import React, { useCallback, useEffect, useState } from 'react';
import { Preloader } from '../components/Preloader';
import { Search } from '../components/Search';
import { useHttp } from "../hooks/http.hook";
import { Modal } from '../modal/modal';


export const PageAbout = () => {
    const [isReady, setIsReady] = useState(true)
    const [listPhone, setListPhone] = useState([])
    const {  request } = useHttp()
    const [flag, setFlag] = useState(false);
    const [idDelete, setIdDelete] = useState();
    const [nameDelete, setNameDelete] = useState();

    const fetchAbout = useCallback(async () => {
        try {
            const fetched = await request('/api/register', 'GET', null)
            setListPhone(fetched)
            setIsReady(false)
        } catch (e) { }
    }, [request])

    useEffect(() => {
        fetchAbout()
    }, [fetchAbout])

    const deleteId = async (id) => {
        try {
            setIsReady(true)
            await request('/api/delete', 'DELETE', { id })
            const fetched = await request('/api/register', 'GET', null)
            setListPhone(fetched)
            setIsReady(false)
            setFlag(false)
        } catch (e) { }
    }

    const modalAdd = (name, id) => {
        setFlag(true)
        setNameDelete(name)
        setIdDelete(id)
    }

    return (<>
        <Search setListPhone={setListPhone} fetchAbout={fetchAbout} request={request} />
        {isReady ? <Preloader /> : (listPhone.length != 0
            ?
            <div className='pageAboutContainer'>
                {listPhone.map(e =>
                    <div key={e.id} className="pageAbout">
                        <div className="card  darken-1">
                            <div className="card-content  ">
                                <span className="card-title"><b>{e.name}</b></span>
                                <span><strong>Индификатор Id:</strong></span> <span  >{e.id}</span>
                                <p className='info-text'><strong>Описание: </strong>{e.about}</p>
                            </div>
                            <div className="card-action margin-down">
                                <ul>
                                    <li><strong>Диагональ (дюйм): </strong>{e.specifications1}</li>
                                    <li><strong>Разрешение (пикс): </strong>{e.specifications2}</li>
                                    <li><strong>Встроенная память (Гб): </strong>{e.specifications3}</li>
                                    <li  ><strong>Процессор:</strong> {e.specifications4}</li>
                                </ul>
                                <button onClick={() => modalAdd(e.name, e.id)} className='waves-effect waves-light btn-small  button-delete'  >
                                    <i  className="material-icons">delete</i>
                                </button>
                            </div>
                        </div>
                        {flag && <Modal setFlag={setFlag} comment={`Удалить телефон ${nameDelete} ?`} action={deleteId.bind(null, idDelete)} />}
                    </div>
                )}
            </div>
            :
            <div className='container'> <h4 style={{ 'textAlign': 'center' }}>Пусто</h4></div>)}
    </>)
}