import React, { useState } from "react";
import { useHttp } from "../hooks/http.hook";

export const Search = ({ setListPhone, listPhone, fetchAbout, request }) => {
    const [textSearch, setTextSearch] = useState('')


    const filterListInput = (event) => {
        setTextSearch(event.target.value)
    }

    const filterListButton = async () => {
        
        if (!textSearch) return fetchAbout();
        try {
            const fetched = await request('/api/register', 'GET', null)
            setListPhone(fetched)
            setListPhone((prevState) => prevState.filter(elem =>
                textSearch == elem.name))
        } catch (e) { }
    }

    return (
        <div className="row">
            <div className="col s3">
                <div className="row">
                    <div className="input-field col s12">
                        <input onChange={filterListInput} value={textSearch} name='search'
                            id='search' type="text" className="card-title" />
                        <label htmlFor="search">Введите название телефона</label>
                        <button className="btn grey lighten-1 black-text"
                            onClick={filterListButton}  >
                            Поиск
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
