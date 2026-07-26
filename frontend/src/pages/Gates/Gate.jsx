import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { LeadForm } from '../../components/LeadForm/LeadForm';
import './Gate.css';

const PRODUTOS = [
  { legenda: 'Sem barreiras de acesso' },
  { legenda: 'Elegância, conforto e segurança' },
  { legenda: 'Ambientes novos ou reformas' },
];

export function Gate() {
  const [convertido, setConvertido] = useState(
    () => sessionStorage.getItem('box_lead_convertido') === 'true'
  );

  useEffect(() => {
    api.registrarVisita().catch(() => {});
  }, []);

  return (
    <div className="gate">
      <section className="gate__hero">
        <div className="gate__brand">
          <span className="gate__logo">B</span>
          <span>Box Acessível</span>
        </div>

        <h1>
          Solução de Acessibilidade
          <br />
          que Transforma Espaços
        </h1>

        <div className="gate__stats">
          <div>
            <strong>500+</strong>
            <span>Projetos</span>
          </div>

          <div>
            <strong>98%</strong>
            <span>Satisfação</span>
          </div>

          <div>
            <strong>6+</strong>
            <span>Anos</span>
          </div>
        </div>

        <div className="gate__produtos">
          {PRODUTOS.map((produto) => (
            <div className="gate__produto" key={produto.legenda}>
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
          <LeadForm onSucesso={() => setConvertido(true)} />
        </aside>
      ) : (
        <aside className="gate__conteudo-liberado">
          <h2>Conteúdo liberado, obrigado!</h2>

          <p>
            Troque este bloco pelo conteúdo real da Landing Page da Box
            Acessível após a conversão do lead.
          </p>
        </aside>
      )}
    </div>
  );
}