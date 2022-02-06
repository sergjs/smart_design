import React from "react";

export const Modal = ({ setFlag, comment }) => {

    return <>
        <div className="modal-container">
            <div className="modal-body">
                <h5 style={{ textAlign: 'center' }} >{comment}</h5>
                <button className='modal-close waves-effect waves-green btn-flat right ' onClick={() => setFlag(false)}>Ok</button>
            </div>
        </div>
    </>
}