import React, { useCallback, useEffect, useState } from 'react';
import { Preloader } from '../components/Preloader';
import { Search } from '../components/Search';
import { useHttp } from "../hooks/http.hook";

export const PageAbout = () => { 
    const [isReady, setIsReady] = useState(true)
    const [listPhone, setListPhone] = useState([])
    const { loading, request } = useHttp()
console.log(listPhone)
    const fetchAbout = useCallback(async () => {
        try {
            setIsReady(true)
            const fetched = await request('/api/register', 'GET', null)
            setListPhone(fetched)
            setIsReady(false)
        } catch (e) { }
    }, [request])

    useEffect(() => {
        fetchAbout()
    }, [fetchAbout])

    return (<>
        <Search setListPhone={setListPhone} listPhone={listPhone} fetchAbout={fetchAbout} request={request}/>
        {isReady ? <Preloader/> : (listPhone.length != 0 
            ?
            <div className='pageAboutContainer'>
                {listPhone.map(e =>
                    <div key={e.id} className="pageAbout">
                        <div className="card  darken-1">
                            <div className="card-content  ">
                                <span className="card-title"><b>{e.name}</b></span>
                                <p><strong>Индификатор Id:</strong>  {e.id}</p>
                                <p><strong>Описание: </strong>{e.about}</p>
                            </div>
                            <div className="card-action">
                                <ul>
                                    <li><strong>Диагональ (дюйм): </strong>{e.specifications1}</li>
                                    <li><strong>Разрешение (пикс): </strong>{e.specifications2}</li>
                                    <li><strong>Встроенная память (Гб): </strong>{e.specifications3}</li>
                                    <li><strong>Процессор:</strong> {e.specifications4}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            :
            <div className='container'> <h4 style={{ 'textAlign': 'center' }}>Такого телефона нет</h4></div>)}
    </>)
}