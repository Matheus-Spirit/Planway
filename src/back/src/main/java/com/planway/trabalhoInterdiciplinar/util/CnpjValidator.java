package com.planway.trabalhoInterdiciplinar.util;

public class CnpjValidator {

    public static boolean isValid(String cnpj) {
        cnpj = cnpj.replaceAll("\\D", "");

        if (cnpj.length() != 14 || cnpj.matches("(\\d)\\1{13}")) {
            return false;
        }

        return validarDigitoVerificador(cnpj, 12) && validarDigitoVerificador(cnpj, 13);
    }

    private static boolean validarDigitoVerificador(String cnpj, int posicao) {
        int soma = 0;
        int peso = (posicao == 12) ? 5 : 6;

        for (int i = 0; i < posicao; i++) {
            int digito = Character.getNumericValue(cnpj.charAt(i));
            soma += digito * peso;
            peso = (peso == 2) ? 9 : peso - 1;
        }

        int resto = soma % 11;
        int digitoVerificador = (resto < 2) ? 0 : 11 - resto;

        return digitoVerificador == Character.getNumericValue(cnpj.charAt(posicao));
    }
}
