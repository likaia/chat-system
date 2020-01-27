import Vue from 'vue'
import VueRouter from 'vue-router'
import MainBody from '../components/main-body'
import MsgList from '../views/msg-list'
import ContactList from '../views/contact-list'
import MoreList from '../views/more-list'
import MessageDisplay from '../components/message-display'
import Login from "../views/login";
Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        redirect: '/contents/message/message',
    },
    {
        name: 'contents',
        path: '/contents/:thisStatus',
        // 重定向到嵌套路由
        redirect: '/contents/:thisStatus/:thisStatus/',
        components: {
            mainArea: MainBody
        },
        props: {
            mainArea: true
        },
        children: [
            {
                path: 'message',
                components: {
                    msgList: MsgList
                },
                children:[
                    {
                        name:"messageDisplay",
                        path:'messageDisplay/:userId',
                        components: {
                            messageDisplay:MessageDisplay
                        }
                    }
                ]
            },
            {
                path: "list",
                components: {
                    contactList: ContactList
                }
            },
            {
                path: "more",
                components: {
                    moreList: MoreList
                }
            },
        ],
    },
    {
        name: 'login',
        path: "/login",
        components: {
            login:Login
        }
    }
];

const router = new VueRouter({
    mode: 'history',
    routes,
});

export default router
