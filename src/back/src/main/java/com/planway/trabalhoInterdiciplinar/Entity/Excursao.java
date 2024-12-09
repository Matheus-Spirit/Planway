package com.planway.trabalhoInterdiciplinar.Entity;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Excursao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String descricao;
    private double valor;
    private String local;
    private String email;
    private int quantidadePessoas;

    @Column(name = "data_inicio")
    private LocalDate dataInicio;

    @Column(name = "data_fim")
    private LocalDate dataFim;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UsuarioComum> participantes = new ArrayList<>();

    public Excursao() {
    }

    public Excursao(String nome, String descricao, double valor, String local, LocalDate dataInicio, LocalDate dataFim, String email, int quantidadePessoas) {
        this.nome = nome;
        this.descricao = descricao;
        this.valor = valor;
        this.local = local;
        this.dataInicio = dataInicio;
        this.dataFim = dataFim;
        this.email = email;
        this.quantidadePessoas = quantidadePessoas;
    }

}
