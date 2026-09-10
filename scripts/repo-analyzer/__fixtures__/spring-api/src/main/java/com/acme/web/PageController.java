package com.acme.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

// @Controller, not @RestController: a method returning a plain String view name is a page, not
// an api — the return-type chain the extractor's `kind` classification rests on.
@Controller
public class PageController {

    @GetMapping("/home")
    public String home() {
        return "home";
    }
}
