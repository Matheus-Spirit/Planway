package com.planway.trabalhoInterdiciplinar.Service;

import com.planway.trabalhoInterdiciplinar.Dto.ExcursaoDto;
import com.planway.trabalhoInterdiciplinar.Entity.Excursao;
import com.planway.trabalhoInterdiciplinar.Repository.ExcursaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExcursaoService {

    @Autowired
    private ExcursaoRepository excursaoRepository;

    public Excursao criarExcursao(ExcursaoDto dto) {
        Excursao excursao = new Excursao(
                dto.nome(),
                dto.descricao(),
                dto.valor(),
                dto.local(),
                dto.dataInicio(),
                dto.dataFim(),
                dto.email(),
                dto.quantidadePessoas()
        );
        return excursaoRepository.save(excursao);
    }

    public List<Excursao> listExcursoes() {
        return excursaoRepository.findAll();
    }

    public List<Excursao> findExcursoesByEmail(String email) {
        return excursaoRepository.findByEmail(email);
    }

    public Excursao listExcursaoPeloId(Long id) {
        return excursaoRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Excursão não encontrada"));
    }

    public void updateExcursao(Long id, ExcursaoDto dto) {
        Excursao excursao = excursaoRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Excursão não encontrada"));

        excursao.setNome(dto.nome());
        excursao.setDescricao(dto.descricao());
        excursao.setValor(dto.valor());
        excursao.setLocal(dto.local());
        excursao.setDataInicio(dto.dataInicio());
        excursao.setDataFim(dto.dataFim());
        excursao.setQuantidadePessoas(dto.quantidadePessoas());

        excursaoRepository.save(excursao);
    }

    public void deleteExcursao(Long id) {
        if (!excursaoRepository.existsById(id)) {
            throw new IllegalArgumentException("Excursão não encontrada");
        }
        excursaoRepository.deleteById(id);
    }
}
