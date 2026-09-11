// The Bullbone shape: the route table is an array of {route, resolution} rows, ordered by a
// fallback order rather than by declaration. `*actions` is the catch-all, not a screen.
import Backbone from 'backbone';

export default class Router extends Backbone.Router {
    routeList = [
        {route: "clearCache", resolution: "clearCache"},
        {route: ":controller/view/:id", resolution: "view"},
        {route: ":controller/create", resolution: "create"},
        {route: ":controller", resolution: "defaultAction", order: 300},
        {route: "*actions", resolution: "home", order: 500},
    ]
}
