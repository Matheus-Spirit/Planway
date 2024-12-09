// Script simples para navegação suave ao clicar nos links do menu
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

let usuarioDocumento;
export function setUsuarioDocumento(usuarioDocumento) {
    usuarioDocumento = usuarioDocumento;
}

export function getUsuarioDocumento() {
    return usuarioDocumento;;
}
