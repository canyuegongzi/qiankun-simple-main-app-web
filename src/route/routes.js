import MainRootView from "../view/main/MainRootView";

const routers = [
    {
        path: '/',
        // exact: true,
        component: MainRootView
    },
    /*{
        path:'/home',
        component:Home,
        children:[
            {
                path:'/',
                component:Demo1
            }
        ]
    },
    {
        path:'/home',
        component:Home
    },
    {
        path:'/user',
        component:User
    },
    {
        path:'/user/:userId',
        component:UserTwo
    }*/
]
export default routers
