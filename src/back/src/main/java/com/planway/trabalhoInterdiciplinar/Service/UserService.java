package com.planway.trabalhoInterdiciplinar.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.planway.trabalhoInterdiciplinar.Dto.UpdateUserDto;
import com.planway.trabalhoInterdiciplinar.Entity.Agencia;
import com.planway.trabalhoInterdiciplinar.Entity.User;
import com.planway.trabalhoInterdiciplinar.Entity.UsuarioComum;
import com.planway.trabalhoInterdiciplinar.Repository.AgenciaRepository;
import com.planway.trabalhoInterdiciplinar.Repository.UserComumRepository;
import com.planway.trabalhoInterdiciplinar.Repository.UserRepository;
import com.planway.trabalhoInterdiciplinar.util.CnpjValidator;
import com.planway.trabalhoInterdiciplinar.util.CpfValidator;

@Service
public class UserService {

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;
    @Autowired
    private UserComumRepository userRepository;
    @Autowired
    private AgenciaRepository agenciaRepository;

    @Autowired
    private UserRepository userReposi;

    public boolean validarCpf(UsuarioComum usuarioComum) {

        return CpfValidator.isValid(usuarioComum.getCpf());
    }

    public boolean validarCnpj(Agencia agencia) {

        return CnpjValidator.isValid(agencia.getCnpj());
    }

    public String identificarDocumento(String documento) {
        if (documento == null || documento.isEmpty()) {
            throw new IllegalArgumentException("Documento não pode ser nulo ou vazio.");
        }

        if (documento.length() == 11) {
            return "CPF"; // 11 dígitos corresponde ao CPF
        } else if (documento.length() == 14) {
            return "CNPJ"; // 14 dígitos corresponde ao CNPJ
        } else {
            throw new IllegalArgumentException("Documento inválido. CPF deve ter 11 dígitos e CNPJ deve ter 14 dígitos.");
        }
    }

    public Object createUser(String email, String senha, String documento) {
        String tipoDocumento = identificarDocumento(documento);

        if ("CPF".equals(tipoDocumento)) {
            return cadastrarUsuarioComum(email, this.bCryptPasswordEncoder.encode(senha), documento);
        } else if ("CNPJ".equals(tipoDocumento) && documento.length() == 14) {
            return cadastrarAgencia(email, this.bCryptPasswordEncoder.encode(senha), documento);
        }

        throw new IllegalArgumentException("Documento inválido.");
    }

    public UsuarioComum cadastrarUsuarioComum(String email, String senha, String cpf) {
        UsuarioComum usuarioComum = new UsuarioComum(email, senha, cpf);
        return userRepository.save(usuarioComum);
    }

    public Agencia cadastrarAgencia(String email, String senha, String cnpj) {
        Agencia agencia = new Agencia(email, senha, cnpj);
        return agenciaRepository.save(agencia);
    }

    public Optional<UsuarioComum> findUserByCpf(String cpf) {
        return userRepository.findByCpf(cpf);
    }

    public Optional<Agencia> findUserByCnpj(String cnpj) {
        return agenciaRepository.findByCnpj(cnpj);
    }

    public List<User> listUsers() {

        List<UsuarioComum> usuariosComuns = userRepository.findAll();

        List<Agencia> agencias = agenciaRepository.findAll();

        List<User> allUsers = new ArrayList<>();
        allUsers.addAll(usuariosComuns);
        allUsers.addAll(agencias);

        return allUsers.stream()
                .distinct()
                .collect(Collectors.toList());
    }

    public void updateUser(String documento, UpdateUserDto userDto) {
        String tipoDocumento = identificarDocumento(documento);

        if ("CPF".equals(tipoDocumento)) {
            var userExists = userRepository.findByCpf(tipoDocumento);

            if (userExists.isPresent()) {
                var user = userExists.get();

                if (userDto.email() != null) {
                    user.setEmail(userDto.email());
                }

                if (userDto.password() != null) {
                    user.setPassword(userDto.password());
                    user.setPassword(this.bCryptPasswordEncoder.encode(userDto.password()));
                }
                userRepository.save(user);
            }
        } else if ("CNPJ".equals(tipoDocumento) && documento.length() == 14) {
            var agenciaExists = agenciaRepository.findByCnpj(tipoDocumento);
            if (agenciaExists.isPresent()) {
                var agencia = agenciaExists.get();

                if (userDto.email() != null) {
                    agencia.setEmail(userDto.email());
                }

                if (userDto.password() != null) {
                    agencia.setPassword(userDto.password());
                    agencia.setPassword(this.bCryptPasswordEncoder.encode(userDto.password()));
                }
                agenciaRepository.save(agencia);
            }
        }
    }

    public void deleteUserByDocument(String documento) {
        String tipoDocumento = identificarDocumento(documento);

        if ("CPF".equals(tipoDocumento)) {
            userRepository.deleteByCpf(tipoDocumento);
        } else if ("CNPJ".equals(tipoDocumento) && documento.length() == 14) {
            agenciaRepository.deleteByCnpj(tipoDocumento);
        }
    }

    public boolean authenticate(String email, String password, String documento) {
        Optional<UsuarioComum> optionalUserComum = userRepository.findByEmail(email);
        Optional<Agencia> optionalAgencia = agenciaRepository.findByEmail(email);

        if (optionalUserComum.isPresent()) {
            UsuarioComum user = optionalUserComum.get();
            return bCryptPasswordEncoder.matches(password, user.getPassword());
        }

        if (optionalAgencia.isPresent()) {
            Agencia agencia = optionalAgencia.get();
            return bCryptPasswordEncoder.matches(password, agencia.getPassword());
        }

        return false;
    }

    public Optional<User> getUserById(Long id) {
        return userReposi.findById(id);
    }
}
