package com.planway.trabalhoInterdiciplinar.Dto;

import java.time.LocalDate;

public record ExcursaoDto(
        String nome,
        String descricao,
        double valor,
        String local,
        LocalDate dataInicio,
        LocalDate dataFim,
        String email,
        int quantidadePessoas) {

}
