package com.thurudichoi.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {

    @GetMapping({
            "/invite/{code}",
            "/invite/{code}/pin",
            "/invite/{code}/letter",
            "/invite/{code}/special/step/{n}",
            "/invite/{code}/special/done",
            "/admin",
            "/admin/login",
            "/admin/invitations",
            "/admin/choices"
    })
    public String index() {
        return "forward:/index.html";
    }
}
