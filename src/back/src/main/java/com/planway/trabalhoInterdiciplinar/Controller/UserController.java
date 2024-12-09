package com.planway.trabalhoInterdiciplinar.Controller;

import java.util.List;
import java.util.Optional;

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

import com.planway.trabalhoInterdiciplinar.Dto.LoginRequest;
import com.planway.trabalhoInterdiciplinar.Dto.UpdateUserDto;
import com.planway.trabalhoInterdiciplinar.Dto.UserDto;
import com.planway.trabalhoInterdiciplinar.Entity.User;
import com.planway.trabalhoInterdiciplinar.Service.UserService;

@RestController
@RequestMapping("/api/usuarios")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/cadastrar")
    public ResponseEntity<Object> criarUsuario(@RequestBody UserDto userDto) {
        try {
            Object usuario = userService.createUser(userDto.email(), userDto.password(), userDto.documento());
            return ResponseEntity.ok(usuario);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest) {
        boolean isAuthenticated = userService.authenticate(loginRequest.email(), loginRequest.password(), loginRequest.documento());

        if (isAuthenticated) {
            return ResponseEntity.ok("Login bem sucedido");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciais inválidas");
        }
    }

    @PutMapping("/updateUser")
    public void updateUserByDocument(@PathVariable String documento, @RequestBody UpdateUserDto userDto) {
        userService.updateUser(documento, userDto);
        ResponseEntity.noContent().build();
    }

    @GetMapping("/listUsers")
    public ResponseEntity<List<User>> listUsers() {
        var users = userService.listUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<User>> getUserById(@PathVariable Long id) {
        var usuario = userService.getUserById(id);
        if (usuario == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(usuario);
    }

    @DeleteMapping("/deleteUser/{documento}")
    public ResponseEntity<Void> deleteUserByDocument(@PathVariable("documento") String documento) {
        userService.deleteUserByDocument(documento);
        return ResponseEntity.noContent().build();
    }

}
