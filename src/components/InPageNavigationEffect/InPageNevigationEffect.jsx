import React, { useEffect, useRef, useState } from 'react'


export let activeTabRef;
export let activeTabInLineRef;


// defaultHidden = {}
const InPageNevigationEffect = ({ routes, defaultActiveIndex = 0, defaultHidden = [], children }) => {

    // using Ref-Hook inOrder to access the HTML-components
    activeTabRef = useRef()
    activeTabInLineRef = useRef();

    // setting the Hooks
    const [inPageActiveNav, setInPageActiveNav] = useState(defaultActiveIndex);

    const [width, setWidth] = useState(window.innerWidth);
    const [isResizeEventAdded, setIsResizeEventAdded] = useState(false);

    // function to create the sliding effect on the tab-section
    const changePageState = (btn, idx) => {
        // console.log(btn, idx);
        let { offsetWidth, offsetLeft } = btn;

        activeTabInLineRef.current.style.width = offsetWidth + "px";
        activeTabInLineRef.current.style.left = offsetLeft + "px";

        setInPageActiveNav(idx);
    }


    useEffect(() => {
        if (width >= 766 && inPageActiveNav != defaultActiveIndex) {
            changePageState(activeTabRef.current, defaultActiveIndex)
        }

        if (!isResizeEventAdded) {
            window.addEventListener("resize", () => {
                if (!isResizeEventAdded) {
                    setIsResizeEventAdded(true)
                }

                setWidth(window.innerWidth);
            })
        }

    }, [width]);




    return (
        <>
            <div className="relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto">
                {
                    routes.map((route, idx) => {
                        return (
                            <button
                                ref={idx == defaultActiveIndex ? activeTabRef : null}
                                key={idx}
                                className={'p-4 px-5 capitalize ' + (inPageActiveNav == idx ? "text-black " : "text-dark-grey ") + (defaultHidden.includes(route) ? "md:hidden" : "")}
                                onClick={(e) => { changePageState(e.target, idx) }}
                            >
                                {route}
                            </button>
                        )
                    })
                }

                <hr ref={activeTabInLineRef} className='absolute bottom-0 duration-300 border-dark-grey' />
            </div>

            {
                Array.isArray(children) ? (
                    children[inPageActiveNav]
                ) : (
                    children
                )
            }
        </>
    )
}

export default InPageNevigationEffect
