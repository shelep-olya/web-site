function isActiveRoute(route, cuurentRoute){
    return route === cuurentRoute ? 'active' : ''
}

module.exports = {isActiveRoute};