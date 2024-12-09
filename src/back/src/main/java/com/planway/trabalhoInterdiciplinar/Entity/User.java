package com.planway.trabalhoInterdiciplinar.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

import lombok.Setter;

@Entity
@Table(name = "user")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@Getter
@Setter
public abstract class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Email
    @NotBlank
    @Column(name = "email", unique = true
    )
    private String email;

    @NotBlank
    private String password;

    public User(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public User() {
    }

}
