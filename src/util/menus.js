import {getRequest} from './api'

export const initMenu = (router, store) => {

    if (store.state.routes.length > 0) {
        //表示vuex中的routes里有内容
        return;
    }
    //从后端获取菜单信息
    getRequest("/system/config/menu").then(data => {
        if (data) {
            //对获取到的信息进行格式化
            let fmtRoutes = formatRoutes(data);
            router.addRoutes(fmtRoutes);
            store.commit('initRoutes', fmtRoutes);
        }
    })
}

//格式化信息
export const formatRoutes = data => {
    let fmtRoutes = [];

    //循环定义router
    data.forEach(router => {
        let {
            path,
            component,
            name,
            meta,
            iconCls,
            children
        } = router;
        //递归children内容
        if (children && children instanceof Array) {
            children = formatRoutes(children);
        }

        let fmRouter = {
            path: path,
            name: name,
            meta: meta,
            iconCls: iconCls,
            children: children,
            component(resolve) {
                if (component.startsWith("Home")) {
                    require(['../views/' + component + '.vue'], resolve);
                } else if (component.startsWith("Emp")) {
                    require(['../views/emp/' + component + '.vue'], resolve);
                } else if (component.startsWith("Per")) {
                    require(['../views/per/' + component + '.vue'], resolve);
                } else if (component.startsWith("Sal")) {
                    require(['../views/sal/' + component + '.vue'], resolve);
                } else if (component.startsWith("Sta")) {
                    require(['../views/sta/' + component + '.vue'], resolve);
                } else if (component.startsWith("Sys")) {
                    require(['../views/sys/' + component + '.vue'], resolve);
                }
            }
        }
        fmtRoutes.push(fmRouter);

    })
    return fmtRoutes;

}