package com.planway.trabalhoInterdiciplinar.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.planway.trabalhoInterdiciplinar.Entity.UsuarioComum;

@Repository
public interface UserComumRepository extends JpaRepository<UsuarioComum, Long> {

    Optional<UsuarioComum> findByCpf(String cpf);

    Optional<UsuarioComum> findByEmail(String email);

    void deleteByCpf(String cpf);
}
