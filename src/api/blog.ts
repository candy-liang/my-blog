import { servicePost } from './index';


export const apiArticle = (url: string = '', data: any = {}) => servicePost("article" + url, data)

export const apiMessage = (url: string = '', data: any = {}) => servicePost("message" + url, data)

export const apiFriendLink = (url: string = '', data: any = {}) => servicePost("friendLink" + url, data)

