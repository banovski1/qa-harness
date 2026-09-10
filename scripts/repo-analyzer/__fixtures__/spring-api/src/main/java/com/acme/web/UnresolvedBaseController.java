package com.acme.web;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// The class-level base is a compile-time string concatenation, which `mappingPaths` cannot
// resolve without the classpath. An unresolvable base must drop the whole class rather than emit
// its methods without their prefix — half a path is worse than none.
@RestController
@RequestMapping(UnresolvedBaseController.BASE_PATH + "/legacy")
public class UnresolvedBaseController {
    static final String BASE_PATH = "/dynamic";

    @GetMapping("/never")
    public String neverAppears() {
        return "[]";
    }
}
