package com.planway.trabalhoInterdiciplinar.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.planway.trabalhoInterdiciplinar.Dto.RoteiroDto;
import com.planway.trabalhoInterdiciplinar.Entity.Roteiro;
import com.planway.trabalhoInterdiciplinar.Repository.RoteiroRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
public class RoteiroService {

    @Autowired
    private RoteiroRepository roteiroRepository;

    @Autowired
    private EntityManager entityManager;

    @Transactional
    public Roteiro createRoteiro(RoteiroDto roteiroDto) {
        var roteiro = new Roteiro(
                null,
                roteiroDto.titulo(),
                roteiroDto.dataFim(),
                roteiroDto.email(),
                roteiroDto.local(),
                roteiroDto.dataInicio()
        );

        roteiro = entityManager.merge(roteiro);  // Ou use save se preferir

        return roteiro;
    }

    public List<Roteiro> listRoteiros() {

        List<Roteiro> roteiros = roteiroRepository.findAll();

        return roteiros.stream().distinct().collect(Collectors.toList());
    }

    public void updateRoteiro(Long roteiroId, RoteiroDto roteiroDto) {
        var roteiroExists = roteiroRepository.findById(roteiroId);

        if (roteiroExists.isPresent()) {
            var roteiro = roteiroExists.get();

            if (roteiroDto.titulo() != null) {
                roteiro.setTitulo(roteiroDto.titulo());;
            }

            if (roteiroDto.dataFim() != null) {
                roteiro.setDataFim(roteiroDto.dataFim());
            }

            if (roteiroDto.local() != null) {
                roteiro.setLocal(roteiroDto.local());
            }

            if (roteiroDto.dataInicio() != null) {
                roteiro.setDataInicio(roteiroDto.dataInicio());
            }

            roteiroRepository.save(roteiro);

        }
    }

    public void deleteRoteiro(Long roteiroId) {
        Optional<Roteiro> roteiro = roteiroRepository.findById(roteiroId);
        if (!roteiro.isPresent()) {
            throw new EntityNotFoundException("Roteiro não encontrado");
        }
        roteiroRepository.deleteById(roteiroId);
    }

    public Optional<Roteiro> findRoteiroById(Long roteiroId) {
        Optional<Roteiro> roteiro = roteiroRepository.findById(roteiroId);
        return roteiro;
    }

    public void deleteAllRoteiros() {
        roteiroRepository.deleteAll();
    }
}
