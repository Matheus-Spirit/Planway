package com.planway.trabalhoInterdiciplinar.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.planway.trabalhoInterdiciplinar.Entity.Roteiro;

public interface RoteiroRepository extends JpaRepository<Roteiro, Long> {

    Roteiro findByTitulo(String titulo);
}
