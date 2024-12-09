package com.planway.trabalhoInterdiciplinar.Security;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Optional;

import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.planway.trabalhoInterdiciplinar.Entity.Agencia;
import com.planway.trabalhoInterdiciplinar.Entity.UsuarioComum;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import com.planway.trabalhoInterdiciplinar.Service.UserService;
import com.planway.trabalhoInterdiciplinar.Repository.AgenciaRepository;
import com.planway.trabalhoInterdiciplinar.Repository.UserComumRepository;

public class JWTAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private AuthenticationManager authenticationManager;

    private JWTUtil jwtUtil;

    private UserService userService;

    private BCryptPasswordEncoder bCryptPasswordEncoder;

    private UserComumRepository userRepository;

    private AgenciaRepository agenciaRepository;

    public JWTAuthenticationFilter(AuthenticationManager authenticationManager, JWTUtil jwtUtil) {
        setAuthenticationFailureHandler(new SimpleUrlAuthenticationFailureHandler("/login?error=true"));

        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException {
        try {
            ObjectMapper mapper = new ObjectMapper();
            String body = request.getReader().lines().reduce("", String::concat);
            String documento = mapper.readTree(body).get("documento").asText();
            String senha = mapper.readTree(body).get("senha").asText();

            String tipoDocumento = userService.identificarDocumento(documento); // Chamando o método de UserService

            if ("CPF".equals(tipoDocumento)) { // CPF
                UsuarioComum userCredentials = new UsuarioComum();
                userCredentials.setCpf(documento);
                userCredentials.setPassword(senha);

                Optional<UsuarioComum> optionalUsuario = userRepository.findByCpf(userCredentials.getCpf());
                if (optionalUsuario.isPresent()) {
                    UsuarioComum usuario = optionalUsuario.get();
                    if (bCryptPasswordEncoder.matches(userCredentials.getPassword(), usuario.getPassword())) {
                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                usuario.getEmail(), userCredentials.getPassword(), new ArrayList<>());
                        return this.authenticationManager.authenticate(authToken);
                    } else {
                        throw new BadCredentialsException("Senha inválida");
                    }
                } else {
                    throw new UsernameNotFoundException("Usuário não encontrado");
                }
            } else if ("CNPJ".equals(tipoDocumento)) { // CNPJ
                Agencia agenciaCredentials = new Agencia();
                agenciaCredentials.setCnpj(documento);
                agenciaCredentials.setPassword(senha);

                Optional<Agencia> optionalAgencia = agenciaRepository.findByCnpj(agenciaCredentials.getCnpj());
                if (optionalAgencia.isPresent()) {
                    Agencia agencia = optionalAgencia.get();
                    if (bCryptPasswordEncoder.matches(agenciaCredentials.getPassword(), agencia.getPassword())) {
                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                agencia.getEmail(), agenciaCredentials.getPassword(), new ArrayList<>());
                        return this.authenticationManager.authenticate(authToken);
                    } else {
                        throw new BadCredentialsException("Senha inválida");
                    }
                } else {
                    throw new UsernameNotFoundException("Agência não encontrada");
                }
            } else {
                throw new IllegalArgumentException("Documento inválido. Deve ser CPF (11 dígitos) ou CNPJ (14 dígitos).");
            }
        } catch (IOException e) {
            throw new RuntimeException("Falha ao ler as credenciais do usuário", e);
        }
    }

    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain, Authentication authentication) throws IOException, ServletException {
        UserSpringSecurity userSpringSecurity = (UserSpringSecurity) authentication.getPrincipal();
        String username = userSpringSecurity.getUsername();
        String token = this.jwtUtil.generateToken(username);
        response.addHeader("Authorization", "Bearer " + token);
        response.addHeader("access-control-expose-headers", "Authorization");

    }
}
