import { useEffect, useState } from "react";
import { api } from "../../api/client";
import { LeadForm } from "../../components/LeadForm/LeadForm";
import "./Gate.css";

const PRODUTOS = [
  {
    legenda: "Sem barreiras de acesso",
  },
  {
    legenda: "Elegância, conforto e segurança",
  },
  {
    legenda: "Ambientes novos ou reformas",
  },
];

const ESTATISTICAS = [
  {
    numero: "500+",
    titulo: "Projetos",
  },
  {
    numero: "98%",
    titulo: "Satisfação",
  },
  {
    numero: "6+",
    titulo: "Anos",
  },
];

export function Gate() {
  const [convertido, setConvertido] = useState(
    () => sessionStorage.getItem("box_lead_convertido") === "true"
  );

  useEffect(() => {
    api.registrarVisita().catch(() => {});
  }, []);

  return (
    <div className="gate">
      <section className="gate__hero">
        <div className="gate__brand">
          <span className="gate__logo">B</span>

          <div>
            <strong>Box Acessível</strong>
          </div>
        </div>

        <div className="gate__hero-content">
          <h1>
            Solução de
            <br />
            Acessibilidade
            <br />
            que Transforma
            <br />
            Espaços
          </h1>

          <p className="gate__subtitle">
            Desenvolvemos soluções inteligentes em acessibilidade para
            residências, empresas e empreendimentos, unindo segurança,
            elegância e funcionalidade.
          </p>
        </div>

        <div className="gate__stats">
          {ESTATISTICAS.map((item) => (
            <div className="gate__stat" key={item.titulo}>
              <strong>{item.numero}</strong>
              <span>{item.titulo}</span>
            </div>
          ))}
        </div>

        <div className="gate__produtos">
          {PRODUTOS.map((produto) => (
            <div
              className="gate__produto"
              key={produto.legenda}
            >
              <div
                className="gate__produto-imagem"
                aria-hidden="true"
              />

              <p>{produto.legenda}</p>
            </div>
          ))}
        </div>

        <div className="gate__social">
          <a href="#" target="_blank" rel="noreferrer">
            Instagram
          </a>

          <a href="#" target="_blank" rel="noreferrer">
            Facebook
          </a>

          <a href="#" target="_blank" rel="noreferrer">
            YouTube
          </a>

          <a
            className="gate__whatsapp"
            href="https://wa.me/5571993459678?text=Olá,%20gostaria%20de%20conhecer%20a%20Box%20Acessível."
            target="_blank"
            rel="noreferrer"
          >
            Falar no WhatsApp
          </a>
        </div>
      </section>

      {!convertido ? (
        <aside className="gate__form-area">
          <LeadForm
            onSucesso={() => setConvertido(true)}
          />
        </aside>
      ) : (
        <aside className="gate__conteudo-liberado">
          <h2>Conteúdo liberado!</h2>

          <p>
            Aqui será carregada automaticamente a Landing Page completa
            da Box Acessível após a conversão do lead.
          </p>
        </aside>
      )}
    </div>
  );
}