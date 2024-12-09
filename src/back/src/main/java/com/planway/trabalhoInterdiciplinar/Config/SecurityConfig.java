package com.planway.trabalhoInterdiciplinar.Config;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import com.planway.trabalhoInterdiciplinar.Security.JWTAuthenticationFilter;
import com.planway.trabalhoInterdiciplinar.Security.JWTUtil;
import com.planway.trabalhoInterdiciplinar.Service.UserDetailsServiceImp;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    private UserDetailsServiceImp userDetailService;

    private AuthenticationManager authenticationManager;

    @Autowired
    private JWTUtil jwtUtil;

    private static final String[] PUBLIC_MATCHERS = {"/"};
    private static final String[] PUBLIC_MATCHERS_POST = {
        "/api/usuarios/cadastrar",
        "/api/usuarios/login",
        "/api/usuarios/criarRoteiro",
        "/api/usuarios/updateUser",
        "/api/roteiro/updateRoteiro/{id}",
        "/api/vendas/cadastro",
        "/api/vendas/listVenda/{email}",
        "/api/excursoes",
        "/api/excursoes/listExcursoes",
        "/api/excursoes/listExcursao/{id}",
        "/api/excursoes/update/{id}",
        "/api/excursoes/delete/{id}",
        "/api/excursoes/listExcursoesByEmail/{email}",
        "/api/excursoes/update/{id}"
    };

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors().and().csrf().disable()
                .authorizeHttpRequests(authz -> authz
                .requestMatchers(HttpMethod.POST, PUBLIC_MATCHERS_POST).permitAll()
                .requestMatchers(PUBLIC_MATCHERS).permitAll()
                .anyRequest().permitAll()
                )
                .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                );
        http.addFilter(new JWTAuthenticationFilter(this.authenticationManager, this.jwtUtil));
        return http.build();
    }

    @Bean
    public AuthenticationManager authManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder
                = http.getSharedObject(AuthenticationManagerBuilder.class);
        authenticationManagerBuilder
                .userDetailsService(userDetailService)
                .passwordEncoder(bCryptPasswordEncoder());
        return authenticationManagerBuilder.build();
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
