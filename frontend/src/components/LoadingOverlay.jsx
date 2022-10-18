import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toggleLoading } from '../context/redux.loading'
import { LoadingSpiner } from './LoadingSpiner'



export const LoadingOverlay = () => {

    const loading = useSelector(state=> state.loading)
    const dispatch = useDispatch()
    
    const closeModel = ()=> dispatch(toggleLoading(false))

    return (
        <>
            <div className={`modal fade  ${loading? 'show' :'hide'}`} tabIndex="-1" style={{display: loading? 'block' :'none'}}>
                <div className="modal-dialog modal-fullscreen">
                    <div className="modal-content" style={{background: 'rgba(1,1,1,0.3)'}}>
                        <div className="modal-header" style={{border: 'hidden', background: 'rgba(255,255,255,0.7)'}}>
                            <h5 className="modal-title text-white"></h5>
                            <button type="button" className="btn-close btn btn-danger" style={{backgroundColor: 'red', opacity: 1}} onClick={closeModel}></button>
                        </div>
                        <div className="modal-body d-flex justify-content-center align-items-center flex-column">
                            <LoadingSpiner text={"Loading ..."} />
                        </div>
                        {/* <div className="modal-footer" style={{border: 'hidden', background: 'rgba(255,255,255,0.7)'}}>
                            <button type="button" className="btn-close btn btn-danger" data-bs-dismiss="modal" aria-label="Close" onClick={closeModel}></button>
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    )
}
