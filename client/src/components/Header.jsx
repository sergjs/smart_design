import React from "react";
import { NavLink } from 'react-router-dom'


export const Header = () => {
    return (<>
        <nav>
            <div className="nav-wrapper green">
            <a href='/' className="brand-logo logo-margin">  Phone </a>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    <li><NavLink to='/pageadd'>Добавить телефон</NavLink></li>
                </ul>
            </div>
        </nav>
    </>
    )
}