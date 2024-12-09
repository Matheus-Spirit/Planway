package com.planway.trabalhoInterdiciplinar.Controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.planway.trabalhoInterdiciplinar.Dto.VendasDto;
import com.planway.trabalhoInterdiciplinar.Entity.Excursao;
import com.planway.trabalhoInterdiciplinar.Entity.Vendas;

import com.planway.trabalhoInterdiciplinar.Service.VendasService;

@RestController
@RequestMapping("/api/vendas")
public class VendasController {

    @Autowired
    private VendasService vendasService;

    @PostMapping("/cadastro")
    public ResponseEntity<?> realizarVenda(@RequestBody VendasDto dto) {
        var vendas = vendasService.realizarVenda(dto);
        return ResponseEntity.ok(vendas);

    }

    @GetMapping("/listVenda/{email}")
    public ResponseEntity<?> listVendaByUsuario(@PathVariable String email) {
        try {
            Optional<Vendas> vendas = vendasService.listarVendaUsuario(email);

            return ResponseEntity.ok(vendas.get());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Venda não encontrada.");
        }
    }

    @DeleteMapping("/deleteVenda/{email}")
    public ResponseEntity<Void> deleteVenda(@PathVariable String email) {
        try {
            vendasService.deleteVenda(email);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        return ResponseEntity.noContent().build();
    }

}