package com.bl.mb;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.bl.mb.repo")
@ComponentScan(basePackages = "com.bl.mb.*")
@EnableWebMvc
public class Libra {

	public static void main(String[] args) {
		SpringApplication.run(Libra.class, args);
	}

}
