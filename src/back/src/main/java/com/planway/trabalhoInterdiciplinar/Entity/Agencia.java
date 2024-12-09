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
@DiscriminatorValue("Agencia")
public class Agencia extends User {

    @Column(name = "agencia_cnpj", unique = true, nullable = true)
    @Size(min = 14, max = 14)
    private String cnpj;

    // @OneToMany(mappedBy = "agencia", cascade = CascadeType.ALL)
    // private List<Roteiro> roteiros = new ArrayList<>();
    public Agencia(String email, String password, String cnpj) {
        super(email, password);
        this.cnpj = cnpj;
    }

    public Agencia() {
    }

}
