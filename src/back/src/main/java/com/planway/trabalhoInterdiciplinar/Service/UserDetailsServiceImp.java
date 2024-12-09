package com.planway.trabalhoInterdiciplinar.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.planway.trabalhoInterdiciplinar.Entity.Agencia;
import com.planway.trabalhoInterdiciplinar.Repository.AgenciaRepository;
import com.planway.trabalhoInterdiciplinar.Security.CustomUserDetails;

@Service
public class UserDetailsServiceImp implements UserDetailsService {

    @Autowired
    private AgenciaRepository agenciaRepository;

    @Override
    public CustomUserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Agencia user = agenciaRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return new CustomUserDetails(user.getEmail(), user.getPassword(), user.getCnpj());
    }
}
