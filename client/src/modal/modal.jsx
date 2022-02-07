import React from "react";

export const Modal = ({ setFlag, comment, action = false}) => {

    return <>
        <div className="modal-container">
            <div className="modal-body">
                <h5 style={{ textAlign: 'center' }} >{comment}</h5>
                {action && <button className='modal-close waves-effect waves-green btn-flat right ' onClick={() => action() }>Ok</button>}
                <button className='modal-close waves-effect waves-green btn-flat right ' onClick={() => setFlag(false)}>Oтмена</button>
            </div>
        </div>
    </>
}