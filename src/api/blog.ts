import { servicePost } from './index';


export const getArticle = (url: string = '', data: any = {}) => servicePost("article" + url, data)

export const getTags = (url: string = '', data: any = {}) => servicePost("tags" + url, data)

export const getFriendLink = (url: string = '', data: any = {}) => servicePost("friendLink" + url, data)

