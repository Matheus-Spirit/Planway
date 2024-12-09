package com.planway.trabalhoInterdiciplinar.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.planway.trabalhoInterdiciplinar.Dto.RoteiroDto;
import com.planway.trabalhoInterdiciplinar.Entity.Roteiro;
import com.planway.trabalhoInterdiciplinar.Service.RoteiroService;

import jakarta.persistence.EntityNotFoundException;

@RestController
@RequestMapping("/api/roteiro")
public class RoteiroController {

    @Autowired
    private RoteiroService roteiroService;

    @PostMapping("/criarRoteiro")
    public ResponseEntity<Object> criarRoteiro(@RequestBody RoteiroDto roteiroDto) {

        try {
            Roteiro roteiro = roteiroService.createRoteiro(roteiroDto);
            return ResponseEntity.ok(roteiro);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/listRoteiros")
    public ResponseEntity<List<Roteiro>> listAllRoteiros() {
        List<Roteiro> roteiros = roteiroService.listRoteiros();

        return ResponseEntity.ok(roteiros);
    }

    @PutMapping("/updateRoteiro/{id}")
    public void updateRoteiro(@PathVariable Long id, @RequestBody RoteiroDto roteirodto) {
        roteiroService.updateRoteiro(id, roteirodto);
        ResponseEntity.noContent().build();
    }

    @DeleteMapping("/deleteRoteiro/{id}")
    public ResponseEntity<Void> deleteRoteiro(@PathVariable Long id) {
        try {
            roteiroService.deleteRoteiro(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
