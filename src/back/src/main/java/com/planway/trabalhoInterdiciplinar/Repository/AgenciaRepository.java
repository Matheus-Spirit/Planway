package com.planway.trabalhoInterdiciplinar.Repository;

import com.planway.trabalhoInterdiciplinar.Entity.Agencia;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AgenciaRepository extends JpaRepository<Agencia, Long> {

    Optional<Agencia> findByCnpj(String cnpj);

    Optional<Agencia> findByEmail(String email);

    void deleteByCnpj(String cnpj);
}
