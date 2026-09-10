package com.acme.web;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

// @RestController forces every method below to classify `api` regardless of return type, and the
// class-level base composes onto each method's own path — the join `springFileRoutes` performs.
@RestController
@RequestMapping("/v2/employees")
public class EmployeeController {

    // Bare @GetMapping: declares no suffix of its own, so the route is the class base alone.
    @GetMapping
    public String list() {
        return "[]";
    }

    // `path =` naming the suffix, spelled with the keyword rather than a positional value.
    @GetMapping(path = "/legacy")
    public String legacy() {
        return "[]";
    }

    // `method =` before `value =`: the verb must come from the attribute (not default to ANY),
    // and the path must resolve regardless of attribute order.
    @RequestMapping(method = RequestMethod.POST, value = "/bulk")
    public String bulkCreate() {
        return "{}";
    }

    // The array form: one annotation, two emitted paths.
    @GetMapping({"/active", "/inactive"})
    public String byStatus() {
        return "[]";
    }

    // A positional value carrying a regex-constrained path variable, Symfony-`requirements:` style.
    @GetMapping("/{id:[0-9]+}")
    public String byId() {
        return "{}";
    }

    // A real mapping, commented out. java-parser drops comments from the CST, so this produces no
    // annotation node at all — a line-at-a-time regex would have matched the text below.
    // @GetMapping("/commented-out")
    public String neverCalled() {
        return "[]";
    }
}
