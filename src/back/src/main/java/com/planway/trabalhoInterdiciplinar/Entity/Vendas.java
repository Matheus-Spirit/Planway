package com.planway.trabalhoInterdiciplinar.Entity;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Vendas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double valor;

    private String emailUsuario;

    private String nomeExcursao;

    private String localExcursao;

    // @ManyToMany
    // @JoinTable(
    //         name = "venda_excursao", // Nome da tabela de junção
    //         joinColumns = @JoinColumn(name = "venda_id"), // Chave estrangeira para a tabela Vendas
    //         inverseJoinColumns = @JoinColumn(name = "excursao_id") // Chave estrangeira para a tabela Excursao
    // )
    // private List<Excursao> excursao;
    public Vendas() {

    }

    public Vendas(Long id, double valor, String emailUsuario, String nomeExcursao) {
        this.id = id;
        this.valor = valor;
        this.emailUsuario = emailUsuario;
        this.nomeExcursao = nomeExcursao;

    }

}