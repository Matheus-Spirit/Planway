package com.planway.trabalhoInterdiciplinar.Security;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class CustomUserDetails implements UserDetails {

    private String email;
    private String password;
    private String cnpj;
    private Collection<? extends GrantedAuthority> authorities;

    public CustomUserDetails(String email, String password, String cnpj) {
        this.email = email;
        this.password = password;
        this.cnpj = cnpj;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public String getEmail() {
        return email;
    }

    public String getCnpj() {
        return cnpj;
    }
}
