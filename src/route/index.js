import React,{ Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import routers from "./routes";
class RouterComponent extends Component{
    constructor(props){
        super(props);
    }
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    {
                        routers.map((router,index)=>{
                            return (
                                <Route
                                    exact={ router.exact }
                                    key={index}
                                    path={router.path}
                                    render={ (props)=>{
                                        return (
                                            <div>
                                                <router.component { ...props } {...this.props}>
                                                    {
                                                        router.children?.map((item,itemIndex)=>{
                                                            const Com = item.component;
                                                            return (
                                                                <Route
                                                                    exact={ item.exact }
                                                                    key={itemIndex}
                                                                    path={item.path}
                                                                >
                                                                   <Com {...this.props} { ...props }/>
                                                                </Route>
                                                            )
                                                        })
                                                    }
                                                </router.component>
                                            </div>
                                        )
                                    } }
                                />
                            )
                        })
                    }
                </Switch>
            </BrowserRouter>
        )
    }
}
export default RouterComponent
