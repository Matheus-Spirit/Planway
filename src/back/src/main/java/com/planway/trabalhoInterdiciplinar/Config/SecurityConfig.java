package com.planway.trabalhoInterdiciplinar.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import com.planway.trabalhoInterdiciplinar.Security.JWTAuthenticationFilter;
import com.planway.trabalhoInterdiciplinar.Security.JWTUtil;
import com.planway.trabalhoInterdiciplinar.Service.UserDetailsServiceImp;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UserDetailsServiceImp userDetailService;
    private final JWTUtil jwtUtil;

    // Endpoints públicos GET e POST
    private static final String[] PUBLIC_MATCHERS_GET = {
        "/health"
    };

    private static final String[] PUBLIC_MATCHERS_POST = {
        "/api/usuarios/cadastrar",
        "/api/usuarios/login"
    };

    private static final String[] PUBLIC_MATCHERS = {
        "/"
    };

    public SecurityConfig(UserDetailsServiceImp userDetailService, JWTUtil jwtUtil) {
        this.userDetailService = userDetailService;
        this.jwtUtil = jwtUtil;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors().and().csrf().disable() // Desabilita CORS e CSRF
                .authorizeHttpRequests(authz -> authz
                    .requestMatchers(HttpMethod.GET, PUBLIC_MATCHERS_GET).permitAll() // Permite health check
                    .requestMatchers(HttpMethod.POST, PUBLIC_MATCHERS_POST).permitAll() // Permite endpoints POST
                    .requestMatchers(PUBLIC_MATCHERS).permitAll() // Outros endpoints públicos
                    .anyRequest().authenticated() // Resto exige autenticação
                )
                .sessionManagement(session -> session
                    .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // Stateless (sem sessões)
                );

        // Adiciona o filtro JWT
        http.addFilter(new JWTAuthenticationFilter(authenticationManager(http), jwtUtil));

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        return http.getSharedObject(AuthenticationManagerBuilder.class)
                .userDetailsService(userDetailService)
                .passwordEncoder(bCryptPasswordEncoder())
                .and()
                .build();
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
