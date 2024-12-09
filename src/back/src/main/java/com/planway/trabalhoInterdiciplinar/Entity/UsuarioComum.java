package com.planway.trabalhoInterdiciplinar.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@DiscriminatorValue("UsuarioComum")
public class UsuarioComum extends User {

    @Column(name = "usuario_cpf", unique = true, nullable = true)
    @Size(min = 11, max = 11)
    private String cpf;

    public UsuarioComum(String email, String password, String cpf) {
        super(email, password);
        this.cpf = cpf;
    }

    public UsuarioComum() {
    }

    public String getCpf() {
        return this.cpf;
    }

}
