// The classic Backbone shape: a `routes` hash of fragment -> handler name, with one optional
// group — `admin/jobs(/:status)` is a real URL with the group left out.
const AdminRouter = Backbone.Router.extend({
    routes: {
        "admin": "index",
        "admin/settings": "settings",
        "admin/users/:id": "user",
        "admin/jobs(/:status)": "jobs",
    },
});
