import { useState } from "react";

const Fashion = ()=>{
    const [show, setShow] = useState("false");
    return(
        <div>
            
            <div>
                <ul>1) Shirt</ul>
                <ul>2) Jeans</ul>
                <ul>3) Trousers</ul>
            </div>
        </div>
    );
};
export default Fashion;