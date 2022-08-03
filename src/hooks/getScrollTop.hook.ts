export const goAnchor = (selector: string = 'top') => {
    document.getElementById(selector)?.scrollIntoView({ block: "start", inline: "center", behavior: "smooth" })
}