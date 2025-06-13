import {Outlet} from "react-router-dom";
import {Button} from "antd-mobile";

const Layout=()=>{
    return (
        <div>
            <Outlet/>
            Layout框架
            <Button color="primary">button 1</Button>
            <div className="purple">
                <Button color="primary">button 2</Button>
            </div>
        </div>
    )

}

export default Layout