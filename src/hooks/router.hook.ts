import { RouteRecordName } from "vue-router";
import Router from '../router'
// const route = Router.currentRoute.value 
// 无法拿到当前的route,因此采用传参route
const router = Router

export const updateQuery = async function (route: any, new_query: any) {
    const { name, query } = route
    console.log({ ...query, ...new_query });
    await router.push({
        name: name as RouteRecordName,
        query: { ...query, ...new_query }
    })
}
export const skipRouter = async function (name: string, query: any = {}) {
    await router.push({ name, query })
}


