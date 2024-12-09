package com.planway.trabalhoInterdiciplinar.Service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.planway.trabalhoInterdiciplinar.Dto.VendasDto;
import com.planway.trabalhoInterdiciplinar.Entity.Vendas;
import com.planway.trabalhoInterdiciplinar.Repository.VendasRepository;

@Service
public class VendasService {

    @Autowired
    private VendasRepository vendasRepository;

    public Vendas realizarVenda(VendasDto dto) {
        try {
            Optional<Vendas> existingVenda = vendasRepository.findByEmailUsuario(dto.emailUsuario());

            if (existingVenda.isPresent()) {
                throw new RuntimeException("Usuário já cadastrado na excursão.");
            }

            var venda = new Vendas(
                    null,
                    dto.valor(),
                    dto.emailUsuario(),
                    dto.nomeExcursao()
            );

            venda = vendasRepository.save(venda);
            return venda;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Erro ao realizar a venda", e);
        }
    }

    public Optional<Vendas> listarVendaUsuario(String emailUsuario) {
        return vendasRepository.findByEmailUsuario(emailUsuario);
    }

    public void deleteVenda(String email) {
        Optional<Vendas> venda = vendasRepository.findByEmailUsuario(email);
        if (venda.isPresent()) {
            vendasRepository.delete(venda.get());
        } else {
            throw new RuntimeException("Venda não encontrada para o usuário com email: " + email);
        }
    }
}