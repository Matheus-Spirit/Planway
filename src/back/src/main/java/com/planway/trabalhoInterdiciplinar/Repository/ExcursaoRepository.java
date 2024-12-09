package com.planway.trabalhoInterdiciplinar.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.planway.trabalhoInterdiciplinar.Entity.Excursao;

@Repository
public interface ExcursaoRepository extends JpaRepository<Excursao, Long> {

    List<Excursao> findByEmail(String email);
}
