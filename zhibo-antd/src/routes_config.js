import GameTemplate from './pages/Game';
import UserTemplate from './pages/User';

const routers = [
    {
        path: "/",
        exact : true,
        name:'3333',
        component : UserTemplate,
    },
    {
        path: "/user",
        name:'2222',
        component : UserTemplate,
    },
    {
        path: "/game",
        name:'1111',
        component : GameTemplate,
    }
]

export default routers;