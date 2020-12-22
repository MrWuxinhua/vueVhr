import Vue from 'vue';
import Vuex from 'vuex';
import {getRequest} from "../util/api";
import {Notification} from 'element-ui';
import SockJS from "sockjs-client";
import Stomp from "stompjs";


Vue.use(Vuex);
const now = new Date();

const store = new Vuex.Store({

    state: {
        routes: [],
        sessions: [],
        hrs: [],
        currentSession: null,
        currentHr: JSON.parse(window.sessionStorage.getItem("user")),
        filterKey: '',
        stomp: null,
        isdot: {}


    },

    mutations: {
        INIT_CURRENTHR(state, hr) {
            state.currentHr = hr;
        },
        initRoutes(state, data) {
            state.routes = data;
        },
        changeCurrentSession(state, currentSession) {
            Vue.set(state.isdot, state.currentHr.username + "#" + currentSession.username, false)
            state.currentSession = currentSession;
        },
        addMessage(state, msg) {
            console.log("currentHR ==> " + JSON.stringify(state.currentHr))

            let message = state.sessions[state.currentHr.username + "#" + msg.to]
            if (!message) {
                // state.sessions[state.currentHr.username + "#" + msg.to] = []

                Vue.set(state.sessions, state.currentHr.username + "#" + msg.to, [])
            }
            state.sessions[state.currentHr.username + "#" + msg.to].push({
                content: msg.content,
                date: new Date(),
                self: !msg.notSelf
            })
        },
        INIT_DATA(state) {
            let data = localStorage.getItem('vue-chat-session');
            if (data) {
                state.sessions = JSON.parse(data);
            }
        },
        INIT_HR(state, data) {
            state.hrs = data
        },


    },
    actions: {
        initData(context) {
            // context.commit('INIT_DATA')
            getRequest("/chat/hrs/").then(resp => {
                if (resp) {
                    context.commit('INIT_HR', resp)
                }
            })
        },
        connect(context) {
            let sockjs = new SockJS("/ws/ep");
            context.state.stomp = Stomp.over(sockjs)
            context.state.stomp.connect({}, success => {
                context.state.stomp.subscribe("/user/queue/chat", msg => {
                    let receiveMsg = JSON.parse(msg.body);
                    receiveMsg.notSelf = true;
                    receiveMsg.to = receiveMsg.from;
                    context.commit("addMessage", receiveMsg);

                    //消息弹窗
                    if (!context.state.currentSession || receiveMsg.from != context.state.currentSession.username) {
                        Notification.info({
                            title: "来自[" + receiveMsg.fromZH + "] 的未读消息！",
                            message: receiveMsg.content.length > 10 ? receiveMsg.content.substr(0, 10) : receiveMsg.content
                        });
                    }
                    Vue.set(context.state.isdot, context.state.currentHr.username + "#" + receiveMsg.from, true)
                })
            }, error => {
                console.log("连接失败")
            })

        }
    }
})

store.watch(function (state) {
    return state.sessions
}, function (val) {
    localStorage.setItem('vue-chat-session', JSON.stringify(val));
}, {
    deep: true/*这个貌似是开启watch监测的判断,官方说明也比较模糊*/
})


export default store;
