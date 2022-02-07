import React, { useState } from "react";
import { debounce } from "debounce";

export const Search = ({ setListPhone, fetchAbout, request }) => {
    const [textSearch, setTextSearch] = useState('')


    const filterListInput = (event) => {
        setTextSearch(event.target.value)
    }

    const filterListButton = async () => {
        if (!textSearch) return debounce(fetchAbout, 1200);
        try {
            const fetched = await request('/api/register', 'GET', null)
            setListPhone(fetched)
            setListPhone((prevState) => prevState.filter(elem =>
                elem.name.toLowerCase().match(textSearch)))
        } catch (e) { }
    }
    // function debounce(f, ms) {
    //     let isCooldown = false;
    //     return function () {
    //         if (isCooldown) return;
    //         f.apply(this, arguments);
    //         isCooldown = true;
    //         setTimeout(() => isCooldown = false, ms);
    //     };
    // }

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
