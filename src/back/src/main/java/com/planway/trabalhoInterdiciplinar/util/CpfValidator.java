package com.planway.trabalhoInterdiciplinar.util;

public class CpfValidator {

    public static boolean isValid(String cpf) {
        cpf = cpf.replaceAll("\\D", "");

        if (cpf.length() != 11 || cpf.matches("(\\d)\\1{10}")) {
            return false;
        }

        return validarDigitoVerificador(cpf, 9) && validarDigitoVerificador(cpf, 10);
    }

    private static boolean validarDigitoVerificador(String cpf, int posicao) {
        int soma = 0;
        int peso = posicao + 1;

        for (int i = 0; i < posicao; i++) {
            int digito = Character.getNumericValue(cpf.charAt(i));
            soma += digito * peso--;
        }

        int resto = soma % 11;
        int digitoVerificador = (resto < 2) ? 0 : 11 - resto;

        return digitoVerificador == Character.getNumericValue(cpf.charAt(posicao));
    }
}
