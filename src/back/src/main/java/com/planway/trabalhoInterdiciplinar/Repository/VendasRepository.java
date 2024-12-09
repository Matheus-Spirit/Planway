package com.planway.trabalhoInterdiciplinar.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.planway.trabalhoInterdiciplinar.Entity.Vendas;

@Repository
public interface VendasRepository extends JpaRepository<Vendas, Long> {

    Optional<Vendas> findByEmailUsuario(String emailUsuario);

    Optional<Vendas> deleteByEmailUsuario(String emailUsuario);
}
