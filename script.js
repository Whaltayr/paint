const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("open");
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
    });
  });
}

const quoteForm = document.getElementById("quoteForm");

if (quoteForm) {
  quoteForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const tipo = document.getElementById("tipo").value.trim();
    const produto = document.getElementById("produto").value.trim();
    const mensagem = document.getElementById("mensagem").value.trim();

    const texto = `Olá INSI Tintas Lda!%0A%0A` +
      `Nome: ${encodeURIComponent(nome)}%0A` +
      `Telefone: ${encodeURIComponent(telefone)}%0A` +
      `Tipo de projecto: ${encodeURIComponent(tipo)}%0A` +
      `Produto pretendido: ${encodeURIComponent(produto)}%0A` +
      `Detalhes: ${encodeURIComponent(mensagem)}`;

    const numero = "244000000000"; // troca pelo número real
    window.open(`https://wa.me/${numero}?text=${texto}`, "_blank");
  });
}